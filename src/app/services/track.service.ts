import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  public playing = false;

  constructor() {
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = '0:16';
    Tone.Transport.bpm.value = 120;
  }

  public togglePlay() {
    this.playing = !this.playing;
    if(this.playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
  }

  public clear() {
    Tone.Transport.cancel();  
  }

  public getTime() {
    return Tone.Transport.seconds;
  }
}
