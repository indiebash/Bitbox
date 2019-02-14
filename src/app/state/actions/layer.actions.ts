import { Action } from '@ngrx/store';
import { Layer } from '../../models';

export enum ActionTypes {
  AddLayer = 'Add Layer',
  SetLayerSpeed = 'Set Layer Speed'
}
 
export class AddLayer implements Action {
  readonly type = ActionTypes.AddLayer;
  constructor(public payload: Layer) {}
}

export class SetLayerSpeed implements Action {
  readonly type = ActionTypes.SetLayerSpeed;
  constructor(public payload: {index: number, value: number}) {}
}

export type LayerAction = {type: ActionTypes, payload: any}