import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Layer } from 'src/app/models';
import { AddLayer, SetPlaying } from 'src/app/state/actions/layer.actions';
import { take } from 'rxjs/operators';
import { SelectLayer } from 'src/app/state/actions/state.actions';
import { TrackService } from 'src/app/services';

@Component({
  selector: 'layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  layers$: Observable<Layer[]>;
  colors: string[] = ['blue', 'pink', 'mint', 'purple', 'orange'];
  selectedLayer: number;

  constructor(private store: Store<AppState>, private trackService: TrackService) {
    this.layers$ = this.store.pipe(select('layers'));
    this.store.pipe(select('misc', 'selectedLayer')).subscribe(selectedLayer => {
      this.selectedLayer = selectedLayer;
    })
  }

  ngOnInit() { }

  addLayer() {
    this.layers$.pipe(take(1)).subscribe(layers => {
      this.store.dispatch(new AddLayer(new Layer(4, 1, this.getLayerColor(layers.length))));
      this.store.dispatch(new SelectLayer(layers.length));
    });
  }

  getLayerColor(layerCount) {
    if(layerCount < this.colors.length) {
      return this.colors[layerCount];
    } else {
      return this.colors[layerCount%this.colors.length];
    }
  }

  togglePlay(index: number, play: boolean) {
    this.layers$.pipe(take(1)).subscribe(layers => {
      if(!layers.some(x => x.playing) && play) {
        this.trackService.startTrack();
      } else if(layers.filter(layer => layer.playing).length === 1 && !play) {
        this.trackService.stopTrack();
      }
      this.store.dispatch(new SetPlaying({index: index, value: play}));
    });
  }

  selectLayer(index: number) {
    this.store.dispatch(new SelectLayer(index));
  }

}
