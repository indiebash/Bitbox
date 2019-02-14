import { Injectable, OnInit } from '@angular/core';
import * as Tone from 'tone';
import { SetTime } from '../state/actions/state.actions';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { Coordinate, Block } from '../models';
import { SelectionType } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  public playing = false;
  interval;
  trackLength;
  notes;

  constructor(private store: Store<AppState>) {
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = '0:16';
    Tone.Transport.bpm.value = 120;

    this.store.pipe(select('misc', 'notes')).subscribe(notes => this.notes = notes);
    this.store.pipe(select('misc', 'trackLength')).subscribe(trackLength => this.trackLength = trackLength);
    this.store.pipe(select('timeline')).subscribe(timeline => {
      if(timeline && timeline.length > 0 && timeline[0] && timeline[0].length > 0) {
        console.log('setting notes');
        this.setNotes(timeline);
      }
    });
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

  lastNote = new Coordinate(-10, -10);
  setNotes(timeline: [Block[]]) {
    this.clear();
    let synth = new Tone.PolySynth(12, Tone.Synth).toMaster();
    let lineNotes = [];
    let lastNote: Coordinate = undefined;
    // start, length, noteIndex
    for (let y = 0; y < this.notes.length; y++) {
      lastNote = new Coordinate(-10, -10);
      for (let x = 0; x < this.trackLength; x++) {
        if (timeline[x][y].selected) {
          console.log('checking x:' + x, x - 1);
          console.log('lastNote', this.lastNote);
          if (this.lastNote.x === x - 1 && this.lastNote.y === y && (timeline[x-1][y].class === SelectionType.center || timeline[x-1][y].class === SelectionType.left)) {
            console.log('lastNote found! Extending note', { x: x, y: y });
            lineNotes[lineNotes.length - 1].length += 1;
            this.lastNote = new Coordinate(x, y);
          } else {
            this.lastNote = new Coordinate(x, y);
            console.log('just set lastNote', x);
            lineNotes.push({
              start: x,
              length: 1,
              noteIndex: y
            });
          }
          // lineNotes.push({ "time": `0:${x}`, "note": `${this.notes[y]}4`, "length": "0:1:0" });
        }
      }
    }
    console.log('notes', lineNotes);

    let final = lineNotes.map(lineNote => {
      return {
        time: `0:${lineNote.start}`,
        note: `${this.notes[lineNote.noteIndex]}1`,
        length: `0:${lineNote.length}:0`
      }
    });
    new Tone.Part(function (time, value) {
      synth.triggerAttackRelease(value.note, value.length, time); 
    }, final).start(0);
  }

}
