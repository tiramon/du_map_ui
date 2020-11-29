import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Settings } from 'src/app/model/Settings';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit {
  faCog = faCog;

  settings: Settings;

  constructor(
    public settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
  }

  /**
   * Sets the settings according to the given tier
   *
   * @param tier tier of the checkbox that was changed
   * @param event event of theck changed checkbox
   */
  showOreIconChanged(tier: number, event) {
    if (tier === 0) {
      this.settingsService.setSettings ('showResourceIcons', event.target.checked);
    } else if (tier === 1) {
      this.settingsService.setSettings ('showT1Ores', event.target.checked);
    } else if (tier === 2) {
      this.settingsService.setSettings ('showT2Ores', event.target.checked);
    } else if (tier === 3) {
      this.settingsService.setSettings ('showT3Ores', event.target.checked);
    } else if (tier === 4) {
      this.settingsService.setSettings ('showT4Ores', event.target.checked);
    } else if (tier === 5) {
      this.settingsService.setSettings ('showT5Ores', event.target.checked);
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
      this.settingsService.setSettings ('showResourceAmount', event.target.checked);
    } else if (tier === 1) {
      this.settingsService.setSettings ('showT1ResourceAmount', event.target.checked);
    } else if (tier === 2) {
      this.settingsService.setSettings ('showT2ResourceAmount', event.target.checked);
    } else if (tier === 3) {
      this.settingsService.setSettings ('showT3ResourceAmount', event.target.checked);
    } else if (tier === 4) {
      this.settingsService.setSettings ('showT4ResourceAmount', event.target.checked);
    } else if (tier === 5) {
      this.settingsService.setSettings ('showT5ResourceAmount', event.target.checked);
    }
  }
}
