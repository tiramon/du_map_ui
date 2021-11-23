import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SelectedTile } from 'src/app/model/SelectedTile';
import { Settings } from 'src/app/model/Settings';
import { EventService } from 'src/app/service/event.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit {
  faCog = faCog;

  settings: Settings;
  selectedTile: SelectedTile;

  constructor(
    public settingsService: SettingsService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
    this.eventService.tileSelected.subscribe((selectedTile: SelectedTile) => {
      console.log('change');
      this.selectedTile = selectedTile;
    });
  }

  /**
   * Sets the settings according to the given tier
   *
   * @param tier tier of the checkbox that was changed
   * @param event event of theck changed checkbox
   */
  showOreIconChanged(tier: number, event) {
    if (tier === 0) {
      this.settingsService.setSettingsValue('showResourceIcons', event.target.checked);
    } else if (tier === 1) {
      this.settingsService.setSettingsValue('showT1Ores', event.target.checked);
    } else if (tier === 2) {
      this.settingsService.setSettingsValue('showT2Ores', event.target.checked);
    } else if (tier === 3) {
      this.settingsService.setSettingsValue('showT3Ores', event.target.checked);
    } else if (tier === 4) {
      this.settingsService.setSettingsValue('showT4Ores', event.target.checked);
    } else if (tier === 5) {
      this.settingsService.setSettingsValue('showT5Ores', event.target.checked);
    }
  }

  /**
   * Sets the settings according to the given tier
   *
   * @param tier tier of the checkbox that was changed
   * @param event event of theck changed checkbox
   */
  showOreAmountChanged(tier: number, event) {
    if (tier === 0) {
      this.settingsService.setSettingsValue('showResourceAmount', event.target.checked);
    } else if (tier === 1) {
      this.settingsService.setSettingsValue('showT1ResourceAmount', event.target.checked);
    } else if (tier === 2) {
      this.settingsService.setSettingsValue('showT2ResourceAmount', event.target.checked);
    } else if (tier === 3) {
      this.settingsService.setSettingsValue('showT3ResourceAmount', event.target.checked);
    } else if (tier === 4) {
      this.settingsService.setSettingsValue('showT4ResourceAmount', event.target.checked);
    } else if (tier === 5) {
      this.settingsService.setSettingsValue('showT5ResourceAmount', event.target.checked);
    }
  }

  changeMinOre(minOre: number) {
    //this.settingsService.setSettingsValue(`${this.selectedTile.celestialId}.minOre`, +minOre);
    this.settingsService.setSettingsValue(`minOre`, +minOre);
  }

  changeMaxOre(maxOre: number) {
    //this.settingsService.setSettingsValue(`${this.selectedTile.celestialId}.maxOre`, +maxOre);
    this.settingsService.setSettingsValue(`maxOre`, +maxOre);
  }

  getMinOre(): number {
    //return this.settingsService.getSettingsValue(`${this.selectedTile.celestialId}.minOre`) as number;
    return this.settingsService.getSettingsValue(`minOre`) as number;
  }

  getMaxOre(): number {
    //return this.settingsService.getSettingsValue(`${this.selectedTile.celestialId}.maxOre`) as number;
    return this.settingsService.getSettingsValue(`maxOre`) as number;
  }
}
