import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Layer } from 'src/app/models';
import { SetPlaybackRate, SetOctave, SetPlaybackType, SetPitch } from 'src/app/state/actions/layer.actions';
import { Incrementor } from '../incrementor/incrementor.component';
import { PlaybackType } from 'src/app/enums';

@Component({
  selector: 'playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss']
})
export class PlaybackControlsComponent implements OnInit {
  layers: Layer[];
  selectedLayer: number;
  incrementorControls: Incrementor[] = [];
  
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
      this.incrementorControls = [];

      this.incrementorControls.push(new Incrementor(
        'Octave',
        this.getOctave(),
        this.layers[this.selectedLayer].color,
        this.raiseOctave.bind(this),
        this.lowerOctave.bind(this)
      ));

      this.incrementorControls.push(new Incrementor(
        'Pitch',
        this.getPitch(),
        this.layers[this.selectedLayer].color,
        this.raisePitch.bind(this),
        this.lowerPitch.bind(this)
      ));

      this.incrementorControls.push(new Incrementor(
        'Speed',
        this.getSpeed(),
        this.layers[this.selectedLayer].color,
        this.raiseSpeed.bind(this),
        this.lowerSpeed.bind(this)
      ));

      this.incrementorControls.push(new Incrementor(
        'Direction',
        this.getPlaybackIcon(),
        this.layers[this.selectedLayer].color,
        this.nextPlaybackType.bind(this),
        this.previousPlaybackType.bind(this),
        true
      ));
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
      switch(this.layers[this.selectedLayer].octave) {
        case 1: return '-3';
        case 2: return '-2';
        case 3: return '-1';
        case 4: return '+0';
        case 5: return '+1';
        case 6: return '+2';
        case 7: return '+3';
        case 8: return '+4';
      }
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

  getPlaybackIcon() {
    switch(this.layers[this.selectedLayer].playbackType) {
      case PlaybackType.forward: return 'arrow_forward';
      case PlaybackType.backwards: return 'arrow_back';
      default: return '-';
    }
  }

  nextPlaybackType() {
    const newPlaybackType = this.layers[this.selectedLayer].playbackType === 1 ? 0 : 1

    this.store.dispatch(
      new SetPlaybackType({
        index: this.selectedLayer, 
        value: newPlaybackType
      })
    );
  }

  previousPlaybackType() {
    const newPlaybackType = this.layers[this.selectedLayer].playbackType === 0 ? 1 : 0

    this.store.dispatch(
      new SetPlaybackType({
        index: this.selectedLayer, 
        value: newPlaybackType
      })
    );
  }

  getPitch() {
    if(this.layers) {
      return `${this.layers[this.selectedLayer].pitch >= 0 ? '+' : ''}${this.layers[this.selectedLayer].pitch}`
    }
    return '-';
  }

  raisePitch() {
    if(this.layers[this.selectedLayer].pitch < 12) {
      this.store.dispatch(
        new SetPitch({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].pitch + 1
        })
      );
    }
  }

  lowerPitch() {
    if(this.layers[this.selectedLayer].pitch > -12) {
      this.store.dispatch(
        new SetPitch({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].pitch - 1
        })
      );
    }
  }

}
