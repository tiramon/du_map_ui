import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Scan } from '../model/Scan';
import { Face } from '../model/Face';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    @Inject('BASEURL') protected defaultURL: string,
    @Inject('PLANETS') private planetNames,
    private http: HttpClient,
    private eventService: EventService,
    private toastr: ToastrService
  ) { }

  /**
   * Request a array of faces of the tile selected and some of the tile around it
   * @param celestialId internal id of the selected planet
   * @param tileId  id of the selected tile
   */
  public requestMap(celestialId: number, tileId: number): Promise<Face[]> {
    const url = `${this.defaultURL}faces?tileId=${tileId}&celestialId=${celestialId}`;
    // &perspectiveScale=${perspectiveScale}`;
    this.eventService.loading.next(true);
    return this.http.get(url, this.getRequestConfigObject())
      .pipe(
        map(response => response as Face[]),
        catchError( error => {
          if (error.status === 404) {
            this.eventService.loading.next(false);
            const planetName = this.planetNames.find(p => p.id == celestialId).name;
            this.toastr.error(`Tile ${tileId} does not exist on ${planetName}`);
          } else if (error.status === 500) {
            this.eventService.loading.next(false);
            this.toastr.error('Serverside error, plz report to discord channel');
          } else {
            this.eventService.loading.next(false);
            this.toastr.error('Unexpcted error, plz report to discord channel');
          }
          return of([]);
        })
      )
      .toPromise();
  }

  private dummyData(): Face[] {
    const f1 = new Face();
    f1.center = [0, 0];
    f1.vertices = [[100, 100], [100, -100], [-100, -100], [-100, 100]];
    f1.scan = new Scan();
    f1.scan.time = new Date();
    f1.scan.planet = 'Alioth';
    f1.scan.ores = {Bauxite: 123};
    return [f1];
  }

  private getRequestConfigObject(type?: string): object {
    return {headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: type ? type : 'json'};
  }

  /**
   * Send a save request for a scan to the backend
   * @param scan scan to be saved
   */
  saveScan(scan: Scan) {
    const url = `${this.defaultURL}scan`;
    this.eventService.loading.next(true);
    return this.http.post(url, scan, this.getRequestConfigObject())
      .pipe(
        catchError(error => {
            this.eventService.loading.next(false);
            console.log(error);
            if (error.status === 0) {
              this.toastr.error('Backend not reachable');
            } else if (error.status === 500) {
              this.toastr.error('Serverside error, plz report to discord channel');
            } else if (error.status !== 400) {
              this.toastr.error('Unexpcted error, plz report to discord channel');
            }
            throw error;
          }
        )
      )
      .toPromise();
  }
}
