import { Injectable } from '@angular/core';
import * as Tone from 'tone';
import { StateAction, SetTime } from '../state/actions/state.actions';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  public playing = false;
  interval;
  timelineWidth;
  position;

  constructor(private store: Store<AppState>) {
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = '0:16';
    Tone.Transport.bpm.value = 120;
  }

  public togglePlay() {
    this.playing = !this.playing;
    if(this.playing) {
      Tone.Transport.start();
      this.interval = setInterval(() => {
        this.store.dispatch(new SetTime(this.getTime()));
      }, 10);
    } else {
      Tone.Transport.pause();
      clearInterval(this.interval);
    }
  }

  public clear() {
    Tone.Transport.cancel();  
  }

  public getTime() {
    return Tone.Transport.seconds;
  }

}
