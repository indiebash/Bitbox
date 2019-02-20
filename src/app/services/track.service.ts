import { Injectable, OnInit } from "@angular/core";
import * as Tone from "tone";
import { SetTime } from "../state/actions/state.actions";
import { AppState } from "../state/app.state";
import { Store, select } from "@ngrx/store";
import { Coordinate, Block, Layer } from "../models";
import { SelectionType, PlaybackType } from "../enums";

@Injectable({
  providedIn: "root"
})
export class TrackService {
  public playing = false;
  interval;
  trackLength;
  notes;
  layers: Layer[] = [];
  timeline;

  constructor(private store: Store<AppState>) {
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `0:${16*8}`;
    Tone.Transport.bpm.value = 120;

    this.store
      .pipe(select("misc", "notes"))
      .subscribe(notes => (this.notes = notes));
    this.store
      .pipe(select("layers"))
      .subscribe(layers => {
        this.layers = layers;
        this.updateNotes();
      });
    this.store
      .pipe(select("misc", "trackLength"))
      .subscribe(trackLength => (this.trackLength = trackLength));
    this.store.pipe(select("timeline")).subscribe(timeline => {
      this.timeline = timeline;
      this.updateNotes();
    });
  }

  updateNotes() {
    if (
      this.timeline &&
      this.timeline.length > 0 &&
      this.timeline[0] &&
      this.timeline[0].length > 0
    ) {
      console.log("setting notes");
      this.setNotes(this.timeline);
    }
  }

  public togglePlay() {
    this.playing = !this.playing;
    if (this.playing) {
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

    this.layers.forEach(layer => {
      let lineNotes = [];
      let lastNote: Coordinate = undefined;
      // start, length, noteIndex
      for (let y = 0; y < this.notes.length; y++) {
        lastNote = new Coordinate(-10, -10);
        for (let x = 0; x < this.trackLength; x++) {
          if (timeline[x][y].selected) {
            console.log("checking x:" + x, x - 1);
            console.log("lastNote", this.lastNote);
            if (
              this.lastNote.x === x - 1 &&
              this.lastNote.y === y &&
              (timeline[x - 1][y].class === SelectionType.center ||
                timeline[x - 1][y].class === SelectionType.left)
            ) {
              console.log("lastNote found! Extending note", { x: x, y: y });
              lineNotes[lineNotes.length - 1].length += 1;
              this.lastNote = new Coordinate(x, y);
            } else {
              this.lastNote = new Coordinate(x, y);
              console.log("just set lastNote", x);
              lineNotes.push({
                start: x,
                length: 1,
                noteIndex: y
              });
              console.log('added line note', lineNotes)
            }
            // lineNotes.push({ "time": `0:${x}`, "note": `${this.notes[y]}4`, "length": "0:1:0" });
          }
        }
      }
      console.log("notes", lineNotes);

      let final = lineNotes.map(lineNote => {
        return {
          time: `0:${this.getNoteStart(layer, lineNote)}`,
          note: this.getNoteWithPitch(layer, `${this.notes[lineNote.noteIndex]}${layer.octave}`),
          length: `0:${lineNote.length / layer.playbackRate}:0`
        };
      });
      let part = new Tone.Part(function(time, value) {
        synth.triggerAttackRelease(value.note, value.length, time);
      }, final); 

      part.loop = true;
      part.loopEnd = `0:16`
      part.playbackRate = layer.playbackRate;
      part.start(0);
    });
  }

  getNoteStart(layer: Layer, lineNote) {
    const x = lineNote.start;
    switch(layer.playbackType) {
      case PlaybackType.backwards: 
        if(x+1 < this.trackLength) {
          return this.trackLength - 1 - x - (lineNote.length - 1);
        } else {
          return x - (this.trackLength - (this.trackLength - x)) - (lineNote.length - 1);
        }
      default: return x;
    }
  }

  getNoteWithPitch(layer: Layer, note) {
    let fullRange = [];
    for(var i=0; i<10; i++) {
      this.notes.forEach(note => {
        fullRange.push(`${note}${i}`);
      });
    }
    let idx = fullRange.findIndex(x => x === note);
    return fullRange[idx - layer.pitch];
  }
}
