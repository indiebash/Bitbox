import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, MiscState } from 'src/app/state/app.state';

@Component({
  selector: 'scrubber',
  templateUrl: './scrubber.component.html',
  styleUrls: ['./scrubber.component.scss']
})
export class ScrubberComponent implements OnInit {
  position = '0px';
  interval;
  timelineWidth;

  constructor(private store: Store<AppState>) {
    this.store.pipe(select('misc')).subscribe((misc:MiscState) => {
      this.timelineWidth = (window.innerWidth * 0.8) - 30;
      this.position = `${(misc.time/8)*this.timelineWidth+10}px`;
    }); 
  }

  ngOnInit() { }

}
