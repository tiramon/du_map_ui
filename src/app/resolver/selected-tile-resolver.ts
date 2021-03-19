import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectedTile } from '../model/SelectedTile';

@Injectable()
export class SelectedTileResolver implements Resolve<SelectedTile> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SelectedTile | Observable<SelectedTile> | Promise<SelectedTile> {
        const planetId = route.params.planetId;
        const tileId = route.params.tileId;
        let selectedTile: SelectedTile;
        if (planetId && tileId) {
            selectedTile = new SelectedTile(+tileId, +planetId);
          } else {
            selectedTile = new SelectedTile(0, 31);
          }
        return selectedTile;
    }
}
