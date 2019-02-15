import { Component } from '@angular/core';
import { TrackService } from './services/track.service';
import { Layer } from './models';
import { Store, select } from '@ngrx/store';
import { AppState } from './state/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  layers: Layer[] = [];
  
  constructor(private trackService: TrackService, private store: Store<AppState>) {
    this.store.pipe(select('layers')).subscribe(layers => this.layers = layers); 
  }
}
