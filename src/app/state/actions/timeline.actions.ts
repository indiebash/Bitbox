import { Action } from '@ngrx/store';
import { Note } from 'src/app/models';
 
export enum ActionTypes {
  SetTimeline = 'SetTimeline',
  AddNote = 'AddNote',
  ExtendNoteRight = 'ExtendNoteRight',
  ReduceNoteRight = 'ReduceNoteRight',
  ExtendNoteLeft = 'ExtendNoteLeft',
  DeleteNote = 'DeleteNote'
}
 
export class SetTimeline implements Action {
  readonly type = ActionTypes.SetTimeline;
  constructor(public payload: Note[]) {}
}

export class AddNote implements Action {
  readonly type = ActionTypes.AddNote;
  constructor(public payload: Note) {}
}

export class ExtendNoteRight implements Action {
  readonly type = ActionTypes.ExtendNoteRight;
  constructor(public payload: Note) {}
}

export class ReduceNoteRight implements Action {
  readonly type = ActionTypes.ReduceNoteRight;
  constructor(public payload: Note) {}
}

export class ExtendNoteLeft implements Action {
  readonly type = ActionTypes.ExtendNoteLeft;
  constructor(public payload: Note) {}
}

export class DeleteNote implements Action {
  readonly type = ActionTypes.DeleteNote;
  constructor(public payload: Note) {}
}

export type TimelineAction = {type: ActionTypes, payload: any}