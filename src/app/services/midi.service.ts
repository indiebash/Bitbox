import { Injectable } from '@angular/core';
import WebMidi, { INoteParam, IMidiChannel } from 'webmidi';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { SetMidiSources } from '../state/actions/state.actions';
import { MidiSource } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MidiService {
  output;

  constructor(private store: Store<AppState>) { 
    WebMidi.enable(function (err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
        this.store.dispatch(new SetMidiSources([
          new MidiSource('Bitbox', 'Bitbox')
        ]));
      } else {
          this.store.dispatch(new SetMidiSources([
            new MidiSource('Bitbox', 'Bitbox'),
            ...WebMidi.outputs.map(o => {
              return new MidiSource(o.id, o.name)
            })
          ]));
      }
    }.bind(this));
  }

  public playNote(note, duration) {
    let output = WebMidi.outputs[1]; // TODO play on correct channel
    output.playNote(note, 1, {duration: duration, velocity: 1});
  }
}
