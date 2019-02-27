import { ActionTypes, TimelineAction } from '../actions/timeline.actions';
import { Note } from 'src/app/models';
import { Action } from 'rxjs/internal/scheduler/Action';

export const initialState: Note[] = [];

export function timelineReducer(state = initialState, action: TimelineAction) {
  let newState = [...state];

  switch (action.type) {

    case ActionTypes.SetTimeline:
      return [...action.payload];

    case ActionTypes.AddNote:
      return [...state, action.payload];

    case ActionTypes.ExtendNoteRight:
      newState.find(note => note.position === action.payload.position).length += 1;
      return newState;

    case ActionTypes.ReduceNoteRight:
      newState.find(note => note.position === action.payload.position).length -= 1;
      return newState;

    case ActionTypes.ExtendNoteLeft:
      newState.find(note => note.position === action.payload.position).length += 1;
      newState.find(note => note.position === action.payload.position).position.x -= 1;
      return newState;

    case ActionTypes.DeleteNote:
      return newState.filter(note => note.position !== action.payload.position);

    default:
      return state;
  }
}