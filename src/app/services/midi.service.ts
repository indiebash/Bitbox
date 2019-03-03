import { Injectable } from '@angular/core';
import WebMidi, { INoteParam, IMidiChannel } from 'webmidi';

@Injectable({
  providedIn: 'root'
})
export class MidiService {
  output;

  constructor() { 
    WebMidi.enable(function (err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
        //setInterval(() => {
          console.log("Inputs", WebMidi.inputs);
          console.log("Outputs", WebMidi.outputs);

          //this.output = WebMidi.outputs[1];
          // output.playNote("C3");
          // output.stopNote("C3");
          //output.playNote("C4", 1, {duration: 1000, velocity: 1});
          //output.playNote("G4", 1, {duration: 5000, velocity: 1});
        //}, 5000);
      }
    });
    
  }

  public playNote(note, delay, duration) {
    console.log('playing note', note);
    console.log('delay',delay);
    console.log('duration', duration)
    let output = WebMidi.outputs[1];
    output.playNote(note, 1, {duration: duration, velocity: 1, time: delay});
  }
}
