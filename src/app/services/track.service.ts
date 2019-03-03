import { Injectable } from "@angular/core";
import * as Tone from "tone";
import { SetTime } from "../state/actions/state.actions";
import { AppState } from "../state/app.state";
import { Store, select } from "@ngrx/store";
import { Layer, Note } from "../models";
import { PlaybackType } from "../enums";
import { MidiService } from "./midi.service";

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

  constructor(private store: Store<AppState>, private midiService: MidiService) {
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

  public stopTrack() {
    Tone.Transport.stop();
    clearInterval(this.interval);
    this.store.dispatch(new SetTime(this.getTime()));
  }

  public startTrack() {
    Tone.Transport.start();
    this.interval = setInterval(() => {
      this.store.dispatch(new SetTime(this.getTime()));
    }, 10);
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

  setNotes(timeline: Note[]) {
    this.clear();
    let synth = new Tone.PolySynth(12, Tone.Synth).toMaster();

    this.layers.filter(layer => layer.playing).forEach(layer => {
      //this.buildWithLocalSynth(timeline, layer);
      this.buildWithMidiOutput(timeline, layer);
    });
  }

  buildWithLocalSynth(timeline: Note[], layer: Layer) {
    let synth = new Tone.PolySynth(12, Tone.Synth).toMaster();
    let final = timeline.map(note => {
      return {
        time: `0:${this.getNoteStart(layer, note)}`,
        note: this.getNoteWithPitch(layer, `${this.notes[note.position.y]}${layer.octave}`),
        length: `0:${note.length / layer.playbackRate}:0`
      };
    });

    let part = new Tone.Part(function (time, value) {
      synth.triggerAttackRelease(value.note, value.length, time);
    }, final);
    part.loop = true;
    part.loopEnd = `0:16`
    part.playbackRate = layer.playbackRate;
    part.start(0);

  }

  buildWithMidiOutput(timeline: Note[], layer: Layer) {
    let final = timeline.map(note => {
      return {
        start: this.getNoteStart(layer, note),
        note: this.getNoteWithPitch(layer, `${this.notes[note.position.y]}${layer.octave}`),
        length: note.length / layer.playbackRate
      };
    });

    let midiEvent = new Tone.Event(this.playMidi.bind(this), final);
    midiEvent.loop = true;
    midiEvent.loopEnd = `0:16`
    midiEvent.playbackRate = layer.playbackRate;
    midiEvent.start(0);
  }

  playMidi(time, value) {
    console.log('trigger midi', value);
    console.log('triger midi time', time);
    value.forEach(x => {
      this.midiService.playNote(x.note, "+"+x.start*500, x.length*500);
    });
  }

  getNoteStart(layer: Layer, note: Note) {
    const x = note.position.x;
    switch(layer.playbackType) {
      case PlaybackType.backwards: 
        if(x+1 < this.trackLength) {
          return this.trackLength - 1 - x - (note.length - 1);
        } else {
          return x - (this.trackLength - (this.trackLength - x)) - (note.length - 1);
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
