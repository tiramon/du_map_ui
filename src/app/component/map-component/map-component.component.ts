import { Component, ElementRef,  HostListener, Inject, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { Face } from 'src/app/model/Face';
import { MinedOre } from 'src/app/model/MinedOre';
import { Scan } from 'src/app/model/Scan';
import { SelectedTile } from 'src/app/model/SelectedTile';
import { Settings } from 'src/app/model/Settings';
import { EventService } from 'src/app/service/event.service';
import { RequestService } from 'src/app/service/request.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  selectedTile = null;
  perspectiveScale = 1000;

  public CANVAS_WIDTH  = 900;
  public CANVAS_HEIGHT = 800;
  public offsetX2D = this.CANVAS_WIDTH / 2;
  public offsetY2D = this.CANVAS_HEIGHT / 2;

  public canvasTolerance = 200;
  public face: Face[];

  scrollOffset = 0;

  oreIcons = {};
  oreIconsLoaded = {};
  private imagesLoadedSubject: Subject<any>;

  private settings: Settings;

  @HostListener('window:scroll', ['$event'])
  doSomething(event) {
    // console.debug("Scroll Event", document.body.scrollTop);
    // see András Szepesházi's comment below
    this.scrollOffset = window.pageYOffset;
  }

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private eventService: EventService,
    private oauthService: OAuthService,
    private settingsService: SettingsService,
    @Inject('ORES') private oreNames,
    @Inject('PLANETS') private planetNames,
    @Inject(LOCALE_ID) public locale: string
  ) {
    const scaleFromStorage = localStorage.getItem('dumap_perspectiveScale');
    if (scaleFromStorage) {
      this.perspectiveScale = +scaleFromStorage;
    }
    // a tile has been choosen, map must be loaded and drawn
    this.eventService.tileSelected.subscribe((selectedTile: SelectedTile) => {
      if (!selectedTile) {
        return;
      }
      this.selectedTile = selectedTile;
      localStorage.setItem('lastSelectedTile', JSON.stringify(selectedTile));
      if (oauthService.hasValidAccessToken()) {
        this.loadMap(selectedTile.celestialId, selectedTile.tileId, this.perspectiveScale)
          .then( faces =>  this.eventService.faceSelected.emit(faces[0]));
      }
    });

    // subscription must be done after tileSelected subscription, else we miss the emit
    route.data.subscribe(data => {
      this.eventService.tileSelected.emit(data.selectedTile);
    });

    // loads map after user loged in else clears the map
    this.eventService.loginChange.subscribe((logedIn: boolean) => {
      if (logedIn) {
        if (this.selectedTile) {
          this.loadMap(this.selectedTile.celestialId, this.selectedTile.tileId, this.perspectiveScale);
        }
      } else {
        this.clear();
      }
    });

    this.settings = settingsService.getSettings();
    let minimized = this.settings.minimizedNav;
    // redraws the map when settings are changed
    settingsService.settingsChanged.subscribe(
      (settings: Settings) => {
        if (settings.minimizedNav !== minimized) {
          minimized = settings.minimizedNav;
          window.dispatchEvent(new Event('resize'));
        }
        this.drawMap();
      }
    );

    // if a scan was added, add it to the tile without reload and repaint the map
    this.eventService.scanAdded.subscribe( (scan: Scan) => {
      const planet = this.planetNames.find(p => p.name === scan.planet);
      console.log('scan added at ', planet, this.selectedTile.celestialId);
      if (+planet.id === +this.selectedTile.celestialId) {
        const scannedTile = this.face.find(f => +f.tileId === +scan.tileId);
        console.log('searching for tile', scan.tileId, scannedTile);
        if (scannedTile) {
          scannedTile.scan = scan;
          this.drawMap();
        }
      }
    });

    // if mined ore was added, add it to the scan without reload and repaint the map
    this.eventService.minedOreAdded.subscribe( (minedOre: MinedOre) => {
      const planet = this.planetNames.find(p => p.name === minedOre.planet);
      console.log('mined ore added at ', planet, this.selectedTile.celestialId);
      if (+planet.id === +this.selectedTile.celestialId) {
        const scannedTile = this.face.find(f => +f.tileId === +minedOre.tileId);
        console.log('searching for tile', minedOre.tileId, scannedTile);
        if (scannedTile && scannedTile.scan) {
          const dateMined  = new Date(minedOre.time);
          const dateScan = new Date(scannedTile.scan.time);
          if (dateScan < dateMined) {
            if (!scannedTile.scan.minedOre) {
              scannedTile.scan.minedOre = [];
            }
            scannedTile.scan.minedOre.push(minedOre);
            console.log(scannedTile.scan);
            this.drawMap();
          }
        }
      }
    });


    this.imagesLoadedSubject = new Subject<any>();
  }


  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * If the user is not loged in the maps get cleared
   * If the user i loged in the backend ist contacted for the tiles of the given planet and tileId and the map is drawn
   *
   * @param celestialId internal id of the selected planet
   * @param tileId id of the selected tile
   */
  loadMap(celestialId: number, tileId: number, scale: number): Promise<Face[]> {
    if (!this.oauthService.getIdentityClaims()) {
      this.clear();
      return;
    }
    return this.requestService.requestMap(celestialId, tileId, scale).then(
      result => {
        this.eventService.loading.emit(false);
        this.face = result;
        this.drawMap();
        // this.markCenter();
        return this.face;
      }
    );
  }

  /**
   * First draws all faces and after that all text is drawn, so no face is overlapping and hiding a text or parts of it
   */
  private drawMap() {
    // console.log(this.settings['maxOre'],this.settings['minOre']);
    this.validateScale();
    this.clear();
    if (this.face) {
      for (const f of this.face) {
        this.drawFace(f);
      }
      for (const f of this.face) {
        this.drawText(f);
      }
    }
  }

  /**
   * Clears the map canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  }

  /**
   * Draws 2 lines marking the center 0/0 of the canvas, mainly used for debuging
   */
  markCenter() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.CANVAS_HEIGHT / 2);
    this.ctx.lineTo(this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 2);
    this.ctx.moveTo(this.CANVAS_WIDTH / 2, 0);
    this.ctx.lineTo(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT);
    this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    this.ctx.stroke();
  }

  /**
   * Method to preload icons for ores, because if this is not done the map will be drawn before the images are loaded
   * @param oreName name of the ore to load the icon for
   */
  getOreIcon(oreName: string) {
    if (!this.oreIcons[oreName]) {
      this.oreIconsLoaded[oreName] = false;
      const img = new Image();
      img.width = 30;
      img.height = 30;
      img.onload = () => { console.log('image loaded'); this.setImageLoaded(oreName); };
      img.src = `/assets/${oreName}.png`;
      this.oreIcons[oreName] = img;
    }

    return this.oreIcons[oreName];
  }
  setImageLoaded(oreName: string) {
    this.oreIconsLoaded[oreName] = true;
    if (this.getAllIconsLoaded()) {
      this.imagesLoadedSubject.next(true);
    }
  }

  getAllIconsLoaded() {
    let loaded = true;
    for (const loadedImg of Object.keys(this.oreIconsLoaded)) {
      loaded = loaded && this.oreIconsLoaded[loadedImg];
    }
    return loaded;
  }

  drawText(face: Face) {
    const vertex = face.vertices;
    const center = face.center;
    // console.log('face vertices', face, vertex , center);
    let x;
    let y;
    let z;
    if (center[0] < -(this.CANVAS_WIDTH / 2) - this.canvasTolerance || center [0] > this.CANVAS_WIDTH / 2 + this.canvasTolerance) {
    //  console.log('skip width', face);
      return;
    }
    if (center[1] < -(this.CANVAS_HEIGHT / 2) - this.canvasTolerance || center [1] > this.CANVAS_HEIGHT / 2 + this.canvasTolerance) {
    //  console.log('skip height', face);
      return;
    }
    this.ctx.beginPath();
    let minY = Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let maxX = -Infinity;
    [x, y] = vertex[vertex.length - 1];
    this.ctx.moveTo(x + this.offsetX2D, y + this.offsetY2D);
    for (const v of vertex) {
      [x, y, z] = v;
      minX = x < minX ? x : minX;
      maxX = x > maxX ? x : maxX;
      minY = y < minY ? y : minY;
      maxY = y > maxY ? y : maxY;
      this.ctx.lineTo(x + this.offsetX2D, y + this.offsetY2D);
    }
    const centerToTop = minY - center[1];
    const yModifier = Math.abs(centerToTop) < 45 ? 0 : 15;
    if ( face.scan) {
      [x, y] = center;
      let yOreOffset = 0;
      let xOreOffset = 0;
      if (this.settings.showResourceIcons) {
        let lastOre;
        for (const ore of this.oreNames) {
          if (face.scan.ores[ore.name]) {
            if (this.settings.showOreIconsT(ore.tier)) {
              if (lastOre && ore.tier !== lastOre.tier) {
                yOreOffset += 20;
                xOreOffset = 0;
              }
              console.log('draw image', this.getAllIconsLoaded());
              this.ctx.drawImage(this.getOreIcon(ore.pictureName ? ore.pictureName : ore.name),
                0, 0, 82, 82,
                x + this.offsetX2D - 40 + xOreOffset, y + this.offsetY2D  - yModifier + yOreOffset, 22, 22
              );
              xOreOffset += 18;
              lastOre = ore;
            }
          }
        }
        yOreOffset += 20;
      }

      xOreOffset = 0;
      if (this.settings.showResourceAmount) {
        const fontSize = 13 * (this.perspectiveScale / 1000);
        this.ctx.font = fontSize + 'px Arial';
        this.ctx.fillStyle = `rgba(0, 0, 0, ${1.0})`;
        for (const ore of this.oreNames) {
          if (face.scan.ores[ore.name]) {
            if (this.settings.showOreTextsT(ore.tier)) {
              const oreShort = ore.name.substring(0, 3);
              const mined = Scan.sumOreMined(face.scan, ore.name);
              const oreLeft = Math.max(0, face.scan.ores[ore.name] - mined);
              if (oreLeft > 0) {
                const amount = new Intl.NumberFormat().format(Math.round( oreLeft));
                const text = `${amount}L`; // ${oreShort}
                const metrics = this.ctx.measureText(text);
                this.ctx.fillStyle = ore.color || `rgba(0, 0, 0, ${1.0})`;
                this.ctx.fillText(
                  text + ` ${oreShort}`,
                  x + this.offsetX2D + 5 - metrics.width + xOreOffset,
                  y + this.offsetY2D  - yModifier + fontSize * 1.2 + yOreOffset
                );
                yOreOffset += fontSize;
              }
            }
          }
        }
      }
    }

    if ('' + face.tileId) {
      [x, y] = center;
      const fontSize = 24; // Math.round(26 / 6000 * this.perspectiveScale);
      this.ctx.font = fontSize * (this.perspectiveScale / 1000) + 'px Arial';
      const text = '' + face.tileId;
      const metrics = this.ctx.measureText(text);
      // + fontSize / 2
      this.ctx.fillText(
        text,
        x + this.offsetX2D - metrics.width / 2,
        y -  (face.scan && this.settings.showResourceAmount ? yModifier : 0) + this.offsetY2D
      );
    }
  }

  drawFace(face: Face, color: string = `rgb(64,77,85)`) {
    const vertex = face.vertices;
    const center = face.center;
    // console.log('face vertices', face, vertex , center);
    let x;
    let y;
    let z;
    if (center[0] < -(this.CANVAS_WIDTH / 2) - this.canvasTolerance || center [0] > this.CANVAS_WIDTH / 2 + this.canvasTolerance) {
    //  console.log('skip width', face);
      return;
    }
    if (center[1] < -(this.CANVAS_HEIGHT / 2) - this.canvasTolerance || center [1] > this.CANVAS_HEIGHT / 2 + this.canvasTolerance) {
    //  console.log('skip height', face);
      return;
    }
    this.ctx.beginPath();

    let minY = Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let maxX = -Infinity;
    [x, y] = vertex[vertex.length - 1];
    this.ctx.moveTo(x + this.offsetX2D, y + this.offsetY2D);
    for (const v of vertex) {
      [x, y, z] = v;
      minX = x < minX ? x : minX;
      maxX = x > maxX ? x : maxX;
      minY = y < minY ? y : minY;
      maxY = y > maxY ? y : maxY;
      this.ctx.lineTo(x + this.offsetX2D, y + this.offsetY2D);
    }
    this.ctx.closePath();

    const centerToTop = minY - y;

    if (face.owner) {
      if (face.color) {
        this.ctx.fillStyle = `rgba(${face.color.r},${face.color.g}, ${face.color.b}, 1.0)`;
      } else if (face.own) {
        this.ctx.fillStyle = `rgba(0,160, 0, 1.0)`;
      } else {
        this.ctx.fillStyle = `rgba(160, 0, 0, 1.0)`;
      }
    } else {
      this.ctx.fillStyle = color;
    }
    this.ctx.fill();

    if (face.scan &&  Object.keys(face.scan.ores).length === 0) {
      this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
      this.ctx.fill();
    } else if (face.scan) {
      this.ctx.fillStyle = `rgba(40, 40, 40, 0.5)`;
      this.ctx.fill();
    }

    this.ctx.strokeStyle = 'lightgrey'; // rgba(0,0,0,0.3)';  // light lines, less cartoony, more render-y
    this.ctx.stroke();
  }

  public onCanvasClick(event) {
    if (!this.face) {
      return;
    }
    event.preventDefault();
    // relative mouse coords
    const mouseX = event.clientX - this.offsetX2D - this.canvas.nativeElement.getBoundingClientRect().left;
    const mouseY = event.clientY - this.offsetY2D - this.scrollOffset - this.canvas.nativeElement.getBoundingClientRect().top;
    // console.log(mouseX, mouseY);
    for (const f of this.face) {
      if (this.isInside(f.vertices, [mouseX, mouseY])) {
        // console.log('clicked in tile ' + f.tileId);
        this.eventService.faceSelected.emit(f);
        break;
      }
    }
  }

  public onCanvasDoubleClick(event: MouseEvent) {
    if (!this.face) { return; }
    event.preventDefault();
    // relative mouse coords
    const mouseX = event.clientX - this.offsetX2D - this.canvas.nativeElement.getBoundingClientRect().left;
    const mouseY = event.clientY - this.offsetY2D - this.scrollOffset - this.canvas.nativeElement.getBoundingClientRect().top;
    // console.log(mouseX, mouseY);
    for (const f of this.face) {
      if (this.isInside(f.vertices, [mouseX, mouseY])) {
        // console.log('clicked in tile ' + f.tileId);
        this.router.navigate(['map', this.selectedTile.celestialId, f.tileId]);
        break;
      }
    }
  }

  public onCanvasRightClick(event: MouseEvent) {
    if (!this.face) { return; }
    event.preventDefault();
    // relative mouse coords
    const mouseX = event.clientX - this.offsetX2D - this.canvas.nativeElement.getBoundingClientRect().left;
    const mouseY = event.clientY - this.offsetY2D - this.scrollOffset - this.canvas.nativeElement.getBoundingClientRect().top;
    // console.log(mouseX, mouseY);
    for (const f of this.face) {
      if (this.isInside(f.vertices, [mouseX, mouseY])) {
        console.log('right clicked in tile ' + f.tileId);
        // this.eventService.faceSelected.emit(f);
        break;
      }
    }
  }

  isInside(vertices: number[][], point: number[]) {
    const extreme = [10000, point[1]];
    let count = 0;
    let i = 0;
    do {
      const next = (i + 1) % vertices.length;
      if (this.doIntersect(vertices[i], vertices[next], point, extreme)) {
        if (this.orientation(vertices[i], point, vertices[next]) === 0) {
          return this.onSegment(vertices[i], point, vertices[next]);
        }
        count++;
      }
      i = next;
    } while (i !== 0);
    return (count % 2 === 1);
  }

  doIntersect(p1, q1, p2, q2) {
    const o1 = this.orientation(p1, q1, p2);
    const o2 = this.orientation(p1, q1, q2);
    const o3 = this.orientation(p2, q2, p1);
    const o4 = this.orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) {
      return true;
    }
    if (o1 === 0 && this.onSegment(p1, p2, q1)) {
      return true;
    }
    if (o2 === 0 && this.onSegment(p1, q2, q1)) {
      return true;
    }
    if (o3 === 0 && this.onSegment(p2, p1, q2)) {
      return true;
    }
    if (o4 === 0 && this.onSegment(p2, q1, q2)) {
      return true;
    }
    return false;
  }

  orientation(p: number[], q: number[], r: number[]) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) {
      return 0;
    }
    return (val > 0) ? 1 : 2;
  }
  onSegment(p: number[], q: number[], r: number[]) {
    if (q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])) {
      return true;
    }
    return false;
  }

  zoom(event) {
    event.preventDefault();

    const oldScale = this.perspectiveScale;
    this.perspectiveScale = Math.round(this.perspectiveScale * (10 + (event.deltaY > 0 ? -1 : 1)) / 10);
    this.validateScale();
    if (oldScale !== this.perspectiveScale) {
      localStorage.setItem('dumap_perspectiveScale', '' + this.perspectiveScale);
      this.loadMap(this.selectedTile.celestialId, this.selectedTile.tileId, this.perspectiveScale);
    }
  }

  validateScale() {
    if (this.perspectiveScale < 300) { this.perspectiveScale = 300; }
    if (this.perspectiveScale > 2000) { this.perspectiveScale = 2000; }
  }

 @HostListener('window:resize', ['$event'])
 onResize(event) {
   // console.log(event.target.innerWidth);
   // this.CANVAS_WIDTH = Math.max(event.target.innerWidth - 530, 200);
   const navWidth = this.settings.minimizedNav ? 95 : 240;
   const offset = this.settings.minimizedNav ? 110 : 130;

   this.CANVAS_WIDTH = Math.max(event.target.innerWidth - navWidth, 200);
   this.canvas.nativeElement.width = this.CANVAS_WIDTH;

   this.CANVAS_HEIGHT = Math.max(event.target.innerHeight, 200);
   this.canvas.nativeElement.height = this.CANVAS_HEIGHT;

   this.offsetX2D = this.CANVAS_WIDTH / 2 - offset;
   this.offsetY2D = this.CANVAS_HEIGHT / 2;
   this.drawMap();
 }
}
