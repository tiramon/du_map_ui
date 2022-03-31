import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectedTile } from '../model/SelectedTile';

@Injectable()
export class SelectedTileResolver implements Resolve<SelectedTile> {
    constructor(
      @Inject('PLANETS') public planets
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SelectedTile | Observable<SelectedTile> | Promise<SelectedTile> {
        const planet = route.params.planet;
        const tileId = route.params.tileId;
        let selectedTile: SelectedTile;
        if (planet && tileId) {
            selectedTile = new SelectedTile(+tileId, this.getPlanetByName(planet).id);
          } else {
            selectedTile = new SelectedTile(0, 31);
          }
        return selectedTile;
    }
    public getPlanetByName(celestialName: string): {id: number, name: string} {
      return this.planets.find((p: {name: string}) => p.name === celestialName);
    }
}
