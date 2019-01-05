import { Action } from '@ngrx/store';
 
export enum ActionTypes {
  ResetTime = '[Time] Reset',
  SetTime = '[Time] Set',
}
 
export class ResetTime implements Action {
  readonly type = ActionTypes.ResetTime;
}
 
export class SetTime implements Action {
  readonly type = ActionTypes.SetTime;

  constructor(public payload: number) {}
}

export type StateAction = {type: ActionTypes, payload: any}