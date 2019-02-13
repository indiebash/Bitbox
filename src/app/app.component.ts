import { Component } from '@angular/core';
import { TrackService } from './services/track.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(private trackService: TrackService) {
    
  }
}
