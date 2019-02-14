import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Layer } from 'src/app/models';
import { AddLayer } from 'src/app/state/actions/layer.actions';
import { take } from 'rxjs/operators';
import { SelectLayer } from 'src/app/state/actions/state.actions';

@Component({
  selector: 'layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  layers$: Observable<Layer[]>;
  colors: string[] = ['blue', 'pink', 'mint', 'purple'];
  selectedLayer: number;

  constructor(private store: Store<AppState>) {
    this.layers$ = this.store.pipe(select('layers'));
    this.store.pipe(select('misc', 'selectedLayer')).subscribe(selectedLayer => {
      this.selectedLayer = selectedLayer;
    })
  }

  ngOnInit() { }

  addLayer() {
    this.layers$.pipe(take(1)).subscribe(layers => {
      this.store.dispatch(new AddLayer(new Layer(1, 1, this.getColor(layers.length))));
    });
  }

  getColor(layerCount) {
    if(layerCount < this.colors.length) {
      return this.colors[layerCount];
    } else {
      return this.colors[layerCount%this.colors.length];
    }
  }

  selectLayer(index: number) {
    this.store.dispatch(new SelectLayer(index));
  }

}
