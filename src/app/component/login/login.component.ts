import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { MapService } from 'src/app/service/map.service';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

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

  error = '';
  login: string;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private mapService: MapService
  ) {

  }

  ngOnInit() {
  }

  onSubmit(event) {
    if (!event.target.username.value && !event.target.password.value) {
      this.error = 'Username or password missing';
      return;
    }

    if (this.login === 'login') {
      this.mapService.loading.next(true);
      this.authenticationService.login(event.target.username.value, event.target.password.value, null)
        .pipe(
          first(),
          tap(() => this.mapService.loading.next(false))
        )
        .subscribe(
          data => {
            event.target.username.value = '';
            event.target.password.value = '';
            this.mapService.loginChange.emit(true);
          },
          error => {
            this.mapService.loading.next(false)
            console.log(error);
            this.error = error;
            if (error.status === 0) {
              this.error = 'Backend not reachable';
            }
            if (error.status === 401) {
              this.error = 'Invalid Logindata';
            }
          });
    } else {
      console.log('register');
      this.mapService.loading.next(true);
      this.authenticationService.register(event.target.username.value, event.target.password.value, null)
      .pipe(
        first(),
        tap(() => this.mapService.loading.next(false))
      )
      .subscribe(
        data => {
          event.target.username.value = '';
          event.target.password.value = '';
          this.mapService.loginChange.emit(true);
        },
        error => {
          this.mapService.loading.next(false)
          console.log(error);
          this.error = error;
          if (error.status === 0) {
            this.error = 'Backend not reachable';
          }
          if (error.status === 500) {
            this.error = 'Username already used';
          }
        });
    }
  }
}
