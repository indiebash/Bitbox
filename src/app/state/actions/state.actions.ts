import { Action } from '@ngrx/store';
import { Block } from 'src/app/models';
 
export enum ActionTypes {
  ResetTime = '[Time] Reset',
  SetTime = '[Time] Set',
  SetDragging = '[Timeline] Dragging',
  SetDraggingRow = '[Timeline] DraggingRow',
  SelectLayer = 'Select Layer'
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

export type StateAction = {type: ActionTypes, payload: any}