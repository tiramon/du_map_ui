import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MapService } from 'src/app/service/map.service';

@Component({
  selector: 'dumap-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  faSpinner = faSpinner;
  loading = false;
  constructor(private mapService: MapService) {
    mapService.loading.subscribe( loading => this.loading = loading);
  }

  ngOnInit() {
  }

}
