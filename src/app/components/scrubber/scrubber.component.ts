import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'scrubber',
  templateUrl: './scrubber.component.html',
  styleUrls: ['./scrubber.component.scss']
})
export class ScrubberComponent implements OnInit {
  position = '0px';
  interval;
  timelineWidth;

  constructor(private trackService: TrackService) { 
    this.interval = setInterval(() => {
      this.timelineWidth = window.innerWidth * 0.8;
      this.position = `${(this.trackService.getTime()/8)*this.timelineWidth}px`;
    }, 10);
  }

  ngOnInit() { }

}
