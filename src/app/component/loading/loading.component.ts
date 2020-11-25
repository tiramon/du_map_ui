import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'dumap-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  faSpinner = faSpinner;
  loading = false;
  constructor(eventService: EventService) {
    // reacts to load events, setting the internal variable and by this show or hides the modal loading dialog
    eventService.loading.subscribe( loading => this.loading = loading);
  }

  ngOnInit() {
  }

}
