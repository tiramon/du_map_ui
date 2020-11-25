import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit {
  faCog = faCog;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
  }

  showOreIconChanged(tier: number, event) {
    console.log(event)
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

  showOreAmountChanged(tier: number, event) {
    console.log(event)
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
