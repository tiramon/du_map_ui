import { EventEmitter, Injectable } from '@angular/core';
import { Settings } from '../model/Settings';

@Injectable({
    providedIn: 'root'
  })
export class SettingsService {
    public settingsChanged = new EventEmitter<Settings>();
    private settings: Settings;

    constructor() {
        this.settings = new Settings(JSON.parse(localStorage.getItem('dumap_settings')));
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public setSettingsValue(key: string, value: boolean | number) {
        this.settings[key] = value;
        this.settingsChanged.emit(this.settings);
        localStorage.setItem('dumap_settings', JSON.stringify(this.settings));
    }

    public getSettingsValue(key: string): boolean | number {
        return this.settings[key];
    }
}
