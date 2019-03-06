import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { LayersComponent } from './components/layers/layers.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { TrackService } from './services/track.service';
import { StoreModule } from '@ngrx/store';
import { stateReducer } from './state/reducers/state.reducer';
import { timelineReducer } from './state/reducers/timeline.reducer';
import { layerReducer } from './state/reducers/layer.reducer';
import { IncrementorComponent } from './components/incrementor/incrementor.component';
import { MidiService } from './services/midi.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimelineComponent,
    LayersComponent,
    PlaybackControlsComponent,
    IncrementorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    StoreModule.forRoot({ 
      misc: stateReducer,
      timeline: timelineReducer,
      layers: layerReducer
    })
  ],
  providers: [TrackService, MidiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
