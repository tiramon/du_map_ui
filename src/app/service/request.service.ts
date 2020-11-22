import { Inject, Injectable, ɵɵpureFunction1 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Scan } from '../model/Scan';
import { Face } from '../model/Face';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    @Inject('BASEURL') protected defaultURL,
    protected http: HttpClient,
    protected mapService: MapService
  ) { }

  public requestMap(celestialId: number, tileId: number): Promise<Face[]> {
    const url = `${this.defaultURL}faces?tileId=${tileId}&celestialId=${celestialId}`;//&perspectiveScale=${perspectiveScale}`;
    this.mapService.loading.next(true);
    return this.http.get(url, this.getRequestConfigObject())
      .pipe(
        map(response => response as Face[]),
        tap(() => this.mapService.loading.next(false))
      )
      .toPromise();
  }

  public requestTile(celestialId: number, tileId: number): Promise<Face> {
    const url = `${this.defaultURL}face?tileId=${tileId}&celestialId=${celestialId}`;
    this.mapService.loading.next(true);
    return this.http.get(url, this.getRequestConfigObject())
      .pipe(
        map(response => response as Face),
        tap(() => this.mapService.loading.next(false))
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

  requestScan(tileId: number): Promise<Scan> {
    const s = new Scan();
    s.time = new Date();
    s.ores = [
      {name: 'Bauxite', amount: 5},
      {name: 'Hematite', amount: 1300000},
      {name: 'Quartz', amount: 5300}
    ];
    return Promise.resolve(s);
  }

  saveScan(scan: Scan) {
    const url = `${this.defaultURL}scan`;
    this.mapService.loading.next(true);
    return this.http.post(url, scan, this.getRequestConfigObject())
      .pipe(
        tap(() => this.mapService.loading.next(false))
      )
      .toPromise();
  }
}
