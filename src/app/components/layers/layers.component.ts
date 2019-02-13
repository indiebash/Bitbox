import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Layer } from 'src/app/models';
import { AddLayer } from 'src/app/state/actions/layer.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  layers$: Observable<Layer[]>;
  colors = ['blue', 'pink', 'mint', 'purple'];

  constructor(private store: Store<AppState>) {
    this.layers$ = this.store.pipe(select('layers'));
  }

  ngOnInit() { }

  addLayer() {
    this.layers$.pipe(take(1)).subscribe(layers => {
      this.store.dispatch(new AddLayer(new Layer(1, 1, this.colors[layers.length])));
    });
  }

  getColor() {
    
  }

}
