import { Component, Inject, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedTile } from './model/SelectedTile';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCaretLeft, faCaretRight, faCog, faDoorOpen, faHardHat, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faListAlt, faMap } from '@fortawesome/free-regular-svg-icons';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { EventService } from './service/event.service';
import { Router } from '@angular/router';
import { Settings } from './model/Settings';
import { SettingsService } from './service/settings.service';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'dumap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faDiscord = faDiscord;
  faCog = faCog;
  faListAlt = faListAlt;
  faDoorOpen = faDoorOpen;
  faPlus = faPlus;
  faMap = faMap;
  faHardHat = faHardHat;
  faCaretLeft = faCaretLeft;
  faCaretRight = faCaretRight;

  lastTileValue: string;
  public showAddScan = false;
  public showSubtractMinedOre = false;
  public showSettings = false;

  private settings: Settings;

  @ViewChild('tileIdInput', { static: true })
  tileIdInput: ElementRef<HTMLInputElement>;

  @ViewChild('planetIdInput', { static: true })
  planetIdInput: ElementRef<HTMLSelectElement>;

  public celestialId = 31;
  public tileId = 0;

  private modelChanged: Subject<SelectedTile> = new Subject<SelectedTile>();

  private localStorageKeyWarningRead = 'dumap_warning_read';

  constructor(
    private eventService: EventService,
    private oauthService: OAuthService,
    public settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router,
    @Inject('PLANETS') public planets
  ) {
    // hides the addscan and setting dialog if a user gets loged out
    this.eventService.loginChange.subscribe((logedIn: boolean) => {
      if (!logedIn) {
        this.showAddScan = false;
        this.showSettings = false;
        return;
      }

      const warningread = localStorage.getItem(this.localStorageKeyWarningRead);

      if (!warningread) {
        toastr.warning(
          'The order of the ores in the add dialog has been altered to better fit the ingame order in the scans.\n' +
          'If you find ores in the wrong order, please tell me in Discord.',
          'Changed ore order',
          {
            disableTimeOut: true,
            positionClass: 'toast-center-center'
          }
        );
        localStorage.setItem(this.localStorageKeyWarningRead, 'true');
      }
      console.log(router.navigated);
      if (router.navigated) {
        const lastTile: SelectedTile = JSON.parse(localStorage.getItem('lastSelectedTile'));
        console.log(lastTile);
        if (lastTile) {
          this.modelChanged.next(lastTile);
        }
      }
    });
  }

  /**
   * Configures the OAuthService for communication with discord
   * @param oauthService the service to use
   */
  private handleOauth2(oauthService: OAuthService) {
    const config = new AuthConfig();

    config.loginUrl = 'https://discord.com/api/oauth2/authorize';
    config.logoutUrl = 'https://discord.com/api/oauth2/token/revoke';
    config.tokenEndpoint = 'https://discord.com/api/oauth2/token';

    // URL of the SPA to redirect the user to after login
    config.redirectUri = window.location.origin + '/';
    // The SPA's id. The SPA is registerd with this id at the auth-server
    config.clientId = '780864362234511400';
    config.dummyClientSecret = 'Tk1Ni6x6wm239aN2juHh3o90glPusCqB';
    config.responseType = 'code';

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    config.scope = 'identify';

    config.showDebugInformation = false;
    config.strictDiscoveryDocumentValidation = false;
    config.oidc = false;
    config.userinfoEndpoint = 'https://discordapp.com/api/users/@me';

    oauthService.configure(config);
    oauthService.setStorage(sessionStorage);

    oauthService.setupAutomaticSilentRefresh();
    oauthService.tryLoginCodeFlow().then(() => {
      if (!oauthService.getIdentityClaims() && oauthService.getAccessToken()) {
        oauthService.loadUserProfile().then( o => {
          this.eventService.loginChange.emit(true);
        });
      } else if (oauthService.getIdentityClaims() && oauthService.getAccessToken()) {
        this.eventService.loginChange.emit(true);
      }
    });
  }

  public ngOnInit() {
    this.handleOauth2(this.oauthService);

    // when another tile was selected tell it to the world
    this.modelChanged.subscribe(
      (selectedTile: SelectedTile) => {
        const planetName = this.getPlanetById(selectedTile.celestialId).name;
        this.router.navigate([`/map/${planetName}/${selectedTile.tileId}`]);
      });

    // somehow handle a change of planet and tile from another location, but make sure it's not our own event reacting to
    this.eventService.tileSelected.subscribe( selectedTile => {
      if (selectedTile && (selectedTile.tileId !== this.tileId || selectedTile.celestialId !== this.celestialId)) {
        this.celestialId = selectedTile.celestialId;
        this.tileId = selectedTile.tileId;
        this.tileIdInput.nativeElement.value = '' + this.tileId;
        this.planetIdInput.nativeElement.selectedIndex = this.planets.map(p => p.id).indexOf(this.celestialId);
      }
    });
  }

  public getPlanetById(celestialId: number): {id: number, name: string} {
    return this.planets.find((p: {id: number}) => p.id === celestialId);
  }

  public getPlanetByName(celestialName: string): {id: number, name: string} {
    return this.planets.find((p: {name: string}) => p.name === celestialName);
  }

  /**
   * Method to check if the user is currently loged in or not
   */
  public isLogedin(): boolean {
    return this.oauthService.getAccessTokenExpiration() > Date.now();
  }

  /**
   * Validator to limit input to only digits, also no plus, minus or decimal seperator
   * @param event event that triggered this validator
   */
  public inputValidator(event: any) {
    const value = event.target.value;
    const pattern = /^[0-9]+$/;
    if (!pattern.test(value)) {
      // invalid character, prevent input
      event.target.value = value.replace(/[^0-9]/g, '');
    }
  }

  /**
   * Handler if another planet is selected, sets the internal variable and resets the selected tileId to 0
   *
   * @param event event that triggered this handler
   */
  changePlanet(event) {
    this.celestialId = +event.target.options[event.target.selectedIndex].value;
    this.tileIdInput.nativeElement.value = '0';
  }

  /**
   * Handler to handle a new selected tile, emits a modelChanged Event
   * @param event event that triggered this handler
   */
  onKeydown(event) {
    const value = event.target.value;
    this.tileId = value.length > 0 ? +value : 0;
    this.modelChanged.next(new SelectedTile(this.tileId, this.celestialId));
  }

  /**
   * Shows/hides the addScanDialog
   */
  showAddScanDialog() {
    this.showAddScan = !this.showAddScan;
  }

  showSubtractMinedOreDialog() {
    this.showSubtractMinedOre = !this.showSubtractMinedOre;
  }

  /**
   * Deletes all local authentication data and informs the application that the user is no longer loged in
   */
  logout() {
    this.oauthService.logOut();
    this.eventService.loginChange.emit(false);
  }

  minimizeNav() {
    this.settingsService.setSettingsValue('minimizedNav', true);
  }

  maximizeNav() {
    this.settingsService.setSettingsValue('minimizedNav', false);
  }
}
