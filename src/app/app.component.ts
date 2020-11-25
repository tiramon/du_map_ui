import { Component, Inject, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedTile } from './model/SelectedTile';
import { MapService } from './service/map.service';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

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
    private mapService: MapService,
    private oauthService: OAuthService,
    @Inject('PLANETS') public planets
  ) {
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
    this.modelChanged.subscribe(
      (selectedTile: SelectedTile) => {
        console.log(selectedTile);
        this.mapService.tileSelected.emit(selectedTile);
      });
    this.mapService.tileSelected.subscribe( selectedTile => {
      // somehow handle a change of planet and tile from another location, but make sure it's not our own event reacting to
    });
  }

  public isLogedin() {
    return this.oauthService.getAccessTokenExpiration() > Date.now();
  }

  public inputValidator(event: any) {
    const value = event.target.value;
    const pattern = /^[0-9]+$/;
    if (!pattern.test(value)) {
      // invalid character, prevent input
      event.target.value = value.replace(/[^0-9]/g, '');
    }
  }

  changePlanet(event) {
    // console.log(event);
    this.celestialId = +event.target.options[event.target.selectedIndex].value;
    this.tileIdInput.nativeElement.value = '0';
    // this.modelChanged.next(new SelectedTile(0, this.celestialId));
  }

  onKeydown(event) {
    const value = event.target.value;
    this.modelChanged.next(new SelectedTile(value.length > 0 ? +value : 0, this.celestialId));
  }

  showAddScanDialog() {
    this.showAddScan = !this.showAddScan;
  }

  logout() {
    this.oauthService.logOut();
    //this.authService.logout();
    this.mapService.loginChange.emit(false);
  }
}
