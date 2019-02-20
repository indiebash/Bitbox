import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, MiscState } from 'src/app/state/app.state';
import { Layer } from 'src/app/models';
import { PlaybackType } from 'src/app/enums';

@Component({
  selector: 'scrubber',
  templateUrl: './scrubber.component.html',
  styleUrls: ['./scrubber.component.scss']
})
export class ScrubberComponent implements OnInit {
  @Input() layer: Layer;
  position = undefined;
  interval;
  timelineWidth;

  constructor(private store: Store<AppState>) {
    this.store.pipe(select('misc')).subscribe((misc:MiscState) => {
      if(this.layer) {
        this.timelineWidth = (window.innerWidth * 0.8) - 30;
        if(this.layer.playbackType === PlaybackType.forward) {
          this.position = `${(misc.time/8%8*this.layer.playbackRate%1)*this.timelineWidth+10+(window.innerWidth*0.2)}px`;
        } else if (this.layer.playbackType === PlaybackType.backwards) {
          this.position = `${((1-(misc.time/8%8*this.layer.playbackRate%1))*this.timelineWidth)+(window.innerWidth*0.2)}px`;
        }
      }
    }); 
  }

  ngOnInit() { }

}
