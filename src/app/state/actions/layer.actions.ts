import { Action } from '@ngrx/store';
import { Layer } from '../../models';

export enum ActionTypes {
  AddLayer = 'Add Layer',
  SetPlaybackRate = 'Set PlaybackRate',
  SetOctave = 'Set Octave'
}
 
export class AddLayer implements Action {
  readonly type = ActionTypes.AddLayer;
  constructor(public payload: Layer) {}
}

export class SetPlaybackRate implements Action {
  readonly type = ActionTypes.SetPlaybackRate;
  constructor(public payload: {index: number, value: number}) {}
}

export class SetOctave implements Action {
  readonly type = ActionTypes.SetOctave;
  constructor(public payload: {index: number, value: number}) {}
}

export type LayerAction = {type: ActionTypes, payload: any}