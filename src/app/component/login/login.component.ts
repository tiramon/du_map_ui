import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'dumap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  faDiscord = faDiscord;

  @Input() modal;

  @Output()
  endModal  = new EventEmitter();

  constructor(
      private oauthService: OAuthService,
  ) {

  }

  ngOnInit() {
  }

  /**
   * Starts the OAuth2 authentication process with discord
   */
  public discord() {
    this.oauthService.initCodeFlow();
  }
}
