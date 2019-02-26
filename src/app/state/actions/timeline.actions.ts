import { Action } from '@ngrx/store';
import { Note } from 'src/app/models';
 
export enum ActionTypes {
  SetTimeline = 'SetTimeline',
  AddNote = 'AddNote'
}
 
export class SetTimeline implements Action {
  readonly type = ActionTypes.SetTimeline;
  constructor(public payload: Note[]) {}
}

export class AddNote implements Action {
  readonly type = ActionTypes.AddNote;
  constructor(public payload: Note) {}
}

export type TimelineAction = {type: ActionTypes, payload: any}