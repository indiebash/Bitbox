import { Action } from '@ngrx/store';
import { Layer } from '../../models';

export enum ActionTypes {
  AddLayer = 'Add Layer',
}
 
export class AddLayer implements Action {
  readonly type = ActionTypes.AddLayer;
  constructor(public payload: Layer) {}
}

export type LayerAction = {type: ActionTypes, payload: any}