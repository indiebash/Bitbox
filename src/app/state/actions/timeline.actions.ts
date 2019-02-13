import { Action } from '@ngrx/store';
import { Block } from 'src/app/models';
 
export enum ActionTypes {
  SetTimeline = 'SetTimeline',
}
 
export class SetTimeline implements Action {
  readonly type = ActionTypes.SetTimeline;
  constructor(public payload: [Block[]]) {}
}

export type TimelineAction = {type: ActionTypes, payload: any}