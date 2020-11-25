import { EventEmitter, Injectable } from '@angular/core';
import { Settings } from '../model/Settings';

@Injectable({
    providedIn: 'root'
  })
export class SettingsService {
    public settingsChanged = new EventEmitter<Settings>();
    private settings: Settings;

    constructor() {
        this.settings = new Settings();
    }

    public getSettings() {
        return this.settings;
    }

    public setSettings(key: string, value: boolean) {
        this.settings[key] = value;
        this.settingsChanged.emit(this.settings);
    }
}
