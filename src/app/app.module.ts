import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { LayersComponent } from './components/layers/layers.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { BlockComponent } from './components/block/block.component';
import { TrackService } from './services/track.service';
import { CanvasService } from './services/canvas.service';
import { ScrubberComponent } from './components/scrubber/scrubber.component';
import { StoreModule } from '@ngrx/store';
import { stateReducer } from './state/reducers/state.reducer';
import { timelineReducer } from './state/reducers/timeline.reducer';
import { layerReducer } from './state/reducers/layer.reducer';
import { IncrementorComponent } from './components/incrementor/incrementor.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimelineComponent,
    LayersComponent,
    PlaybackControlsComponent,
    BlockComponent,
    ScrubberComponent,
    IncrementorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ 
      misc: stateReducer,
      timeline: timelineReducer,
      layers: layerReducer
    })
  ],
  providers: [TrackService, CanvasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
