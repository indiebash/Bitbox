import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { Layer, MidiSource } from 'src/app/models';
import { SetOutput } from 'src/app/state/actions/layer.actions';
import { ShowOptions, SetTrackLength } from 'src/app/state/actions/state.actions';

@Component({
  selector: 'options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  toggled: boolean = false;
  layers$: Observable<Layer[]>;
  midiOutputs: MidiSource[] = [];
  trackLength: number;

  constructor(private store: Store<AppState>) {
    this.store.pipe(select('misc', 'optionsToggled')).subscribe(optionsToggled => {
      this.toggled = optionsToggled;
    });

    this.store.pipe(select('misc', 'trackLength')).subscribe(trackLength => {
      this.trackLength = trackLength;
    });

    this.store.pipe(select('misc', 'midiSources')).subscribe(midiSources => {
      this.midiOutputs = midiSources;
    });

    this.layers$ = this.store.pipe(select('layers'));
  }

  ngOnInit() {
  }

  outputChange(index: number, outputId: number) {
    this.store.dispatch(
      new SetOutput({
        index: index,
        value: outputId
      })
    );
  }

  closeModal() {
    this.store.dispatch(new ShowOptions(false));
  }

  setTrackLength(value) {
    this.store.dispatch(new SetTrackLength(this.trackLength));
  }

}
