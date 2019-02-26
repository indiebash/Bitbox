import { ActionTypes, TimelineAction } from '../actions/timeline.actions';
import { Note } from 'src/app/models';

export const initialState: Note[] = [];

export function timelineReducer(state = initialState, action: TimelineAction) {
  let newState = [...state];

  switch (action.type) {

    case ActionTypes.SetTimeline:
      return [...action.payload];

    case ActionTypes.AddNote:
      return [...state, action.payload]

    default:
      return state;
  }
}