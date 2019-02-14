import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Layer } from 'src/app/models';
import { SetLayerSpeed } from 'src/app/state/actions/layer.actions';

@Component({
  selector: 'playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss']
})
export class PlaybackControlsComponent implements OnInit {
  layers: Layer[];
  selectedLayer: number;
  
  constructor(private trackService: TrackService, private store: Store<AppState>) {
    this.store.pipe(select('layers')).subscribe(layers => this.layers = layers);
    this.store.pipe(select('misc', 'selectedLayer')).subscribe(selectedLayer => this.selectedLayer = selectedLayer);
  }

  ngOnInit() {}

  getSpeed() {
    if(this.layers) {
      switch(this.layers[this.selectedLayer].speedMultiplier) {
        case 0.5: return '1/2';
        case 0.25:  return '1/4';
        case 0.125: return '1/8';
        default: return this.layers[this.selectedLayer].speedMultiplier;
      };
    }
    return '-';
  }

  raiseSpeed() {
    if(this.layers[this.selectedLayer].speedMultiplier < 8) {
      this.store.dispatch(
        new SetLayerSpeed({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].speedMultiplier * 2
        })
      );
    }
  }

  lowerSpeed() {
    if(this.layers[this.selectedLayer].speedMultiplier > 0.125) {
      this.store.dispatch(
        new SetLayerSpeed({
          index: this.selectedLayer, 
          value: this.layers[this.selectedLayer].speedMultiplier / 2
        })
      );
    }
  }

}
