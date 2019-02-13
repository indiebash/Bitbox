import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss']
})
export class PlaybackControlsComponent implements OnInit {
  speed = 1;
  
  constructor(private trackService: TrackService) {

   }

  ngOnInit() {}

}
