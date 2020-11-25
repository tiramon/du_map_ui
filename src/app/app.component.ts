import { Component, Inject, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedTile } from './model/SelectedTile';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { EventService } from './service/event.service';

@Component({
  selector: 'dumap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faDiscord = faDiscord;
  faCog = faCog;
  title = 'DuMapUi';
  lastTileValue: string;
  public showAddScan = false;
  public showSettings = false;

  @ViewChild('tileId', { static: true })
  tileIdInput: ElementRef<HTMLInputElement>;

  public celestialId = 31;

  private modelChanged: Subject<SelectedTile> = new Subject<SelectedTile>();

  constructor(
    private eventService: EventService,
    private oauthService: OAuthService,
    @Inject('PLANETS') public planets
  ) {
    // hides the addscan and setting dialog if a user gets loged out
    this.eventService.loginChange.subscribe((logedIn: boolean) => {
      if (!logedIn) {
        this.showAddScan = false;
        this.showSettings = false;
      }
    });
    this.handleOauth2(oauthService);
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
    // config.redirectUri = window.location.origin + '/';
    config.redirectUri = 'http://localhost:4201/';
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

    this.oauthService.configure(config);
    oauthService.setStorage(sessionStorage);

    oauthService.setupAutomaticSilentRefresh();
    oauthService.tryLoginCodeFlow().then(() => {
      if (!oauthService.getIdentityClaims() && oauthService.getAccessToken()) {
        oauthService.loadUserProfile().then( o => {
        });
      }
    });
  }

  public ngOnInit() {
    // when another tile was selected tell it to the world
    this.modelChanged.subscribe(
      (selectedTile: SelectedTile) => {
        this.eventService.tileSelected.emit(selectedTile);
      });

    // somehow handle a change of planet and tile from another location, but make sure it's not our own event reacting to
    this.eventService.tileSelected.subscribe( selectedTile => {
      //IMPLEMENT ME
    });
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
    this.modelChanged.next(new SelectedTile(value.length > 0 ? +value : 0, this.celestialId));
  }

  /**
   * Shows/hides the addScanDialog
   */
  showAddScanDialog() {
    this.showAddScan = !this.showAddScan;
  }

  /**
   * Deletes all local authentication data and informs the application that the user is no longer loged in
   */
  logout() {
    this.oauthService.logOut();
    this.eventService.loginChange.emit(false);
  }
}
