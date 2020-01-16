import { Action } from '@ngrx/store';
import { MidiSource } from 'src/app/models';
 
export enum ActionTypes {
  ResetTime = 'Reset Time',
  SetTime = 'Set Time',
  SetDragging = 'Set Dragging',
  SetDraggingRow = 'Set Dragging Row',
  SelectLayer = 'Select Layer',
  SetMidiSources = 'Set Midi Sources',
  ShowOptions = 'Show Options'
}
 
export class ResetTime implements Action {
  readonly type = ActionTypes.ResetTime;
}
 
export class SetTime implements Action {
  readonly type = ActionTypes.SetTime;
  constructor(public payload: number) {}
}

export class SetDragging implements Action {
  readonly type = ActionTypes.SetDragging;
  constructor(public payload: boolean) {}
}

export class SetDraggingRow implements Action {
  readonly type = ActionTypes.SetDraggingRow;
  constructor(public payload: number) {}
}

export class SelectLayer implements Action {
  readonly type = ActionTypes.SelectLayer;
  constructor(public payload: number) {}
}
export class SetMidiSources implements Action {
  readonly type = ActionTypes.SetMidiSources;
  constructor(public payload: MidiSource[]) {}
}

export class ShowOptions implements Action {
  readonly type = ActionTypes.ShowOptions;
  constructor(public payload: Boolean) {}
}

export type StateAction = {type: ActionTypes, payload: any}