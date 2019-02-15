import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Layer } from 'src/app/models';
import { SetPlaybackRate, SetOctave } from 'src/app/state/actions/layer.actions';
import { Incrementor } from '../incrementor/incrementor.component';

@Component({
  selector: 'playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss']
})
export class PlaybackControlsComponent implements OnInit {
  layers: Layer[];
  selectedLayer: number;
  octaveIncrementor: Incrementor;
  playbackRateIncrementor: Incrementor;
  
  constructor(private trackService: TrackService, private store: Store<AppState>) {
    this.store.pipe(select('layers')).subscribe(layers => {
      this.layers = layers;
      this.setIncrementors(); 
    });
    this.store.pipe(select('misc', 'selectedLayer')).subscribe(selectedLayer => {
      this.selectedLayer = selectedLayer;
      this.setIncrementors();
    });
  }

  setIncrementors() {
    if(this.layers && (this.selectedLayer || this.selectedLayer >= 0)) {
      this.octaveIncrementor = new Incrementor(
        'Octave',
        this.getOctave(),
        this.layers[this.selectedLayer].color,
        this.raiseOctave.bind(this),
        this.lowerOctave.bind(this)
      );

      this.playbackRateIncrementor = new Incrementor(
        'Playback Rate',
        this.getSpeed(),
        this.layers[this.selectedLayer].color,
        this.raiseSpeed.bind(this),
        this.lowerSpeed.bind(this)
      );
    }
  }

  ngOnInit() {}

  getSpeed() {
    if(this.layers) {
      switch(this.layers[this.selectedLayer].playbackRate) {
        case 0.5: return '1/2';
        case 0.25:  return '1/4';
        case 0.125: return '1/8';
        default: return this.layers[this.selectedLayer].playbackRate;
      };
    }
    return '-';
  }

  raiseSpeed() {
    if(this.layers[this.selectedLayer].playbackRate < 8) {
      this.store.dispatch(
        new SetPlaybackRate({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].playbackRate * 2
        })
      );
    }
  }

  lowerSpeed() {
    if(this.layers[this.selectedLayer].playbackRate > 0.125) {
      this.store.dispatch(
        new SetPlaybackRate({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].playbackRate / 2
        })
      );
    }
  }

  getOctave() {
    if(this.layers) {
      return this.layers[this.selectedLayer].octave;
    }
    return '-';
  }

  raiseOctave() {
    if(this.layers[this.selectedLayer].octave < 8) {
      this.store.dispatch(
        new SetOctave({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].octave + 1
        })
      );
    }
  }

  lowerOctave() {
    if(this.layers[this.selectedLayer].octave > 1) {
      this.store.dispatch(
        new SetOctave({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].octave - 1
        })
      );
    }
  }

}
