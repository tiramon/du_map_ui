import { Component, Inject, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedTile } from './model/SelectedTile';
import { AuthenticationService } from './service/authentication.service';
import { MapService } from './service/map.service';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dumap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faDiscord = faDiscord;
  faCog = faCog;
  title = 'DuMapUi';
  lastTileValue: string;
  public showAddScan = false;
  public showSettings = false;

  @ViewChild('tileId', { static: true })
  tileIdInput: ElementRef<HTMLInputElement>;

  public celestialId = 31;

  private modelChanged: Subject<SelectedTile> = new Subject<SelectedTile>();

  constructor(
    private mapService: MapService,
    private authService: AuthenticationService,
    @Inject('PLANETS') public planets
  ) { }

  public ngOnInit() {
    this.modelChanged.subscribe(
      (selectedTile: SelectedTile) => {
        console.log(selectedTile);
        this.mapService.tileSelected.emit(selectedTile);
      });
    this.mapService.tileSelected.subscribe( selectedTile => {
      // somehow handle a change of planet and tile from another location, but make sure it's not our own event reacting to
    });
  }

  public isLogedin() {
    return this.authService.currentUserValue;
  }

  public inputValidator(event: any) {
    const value = event.target.value;
    const pattern = /^[0-9]+$/;
    if (!pattern.test(value)) {
      // invalid character, prevent input
      event.target.value = value.replace(/[^0-9]/g, '');
    }
  }

  changePlanet(event) {
    // console.log(event);
    this.celestialId = +event.target.options[event.target.selectedIndex].value;
    this.tileIdInput.nativeElement.value = '0';
    // this.modelChanged.next(new SelectedTile(0, this.celestialId));
  }

  onKeydown(event) {
    const value = event.target.value;
    this.modelChanged.next(new SelectedTile(value.length > 0 ? +value : 0, this.celestialId));
  }

  showAddScanDialog() {
    this.showAddScan = !this.showAddScan;
  }

  logout() {
    this.authService.logout();
    this.mapService.loginChange.emit(false);
  }
}
