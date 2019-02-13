import { Block } from 'src/app/models';
import { ActionTypes, TimelineAction } from '../actions/timeline.actions';

export const initialState: [Block[]] = [[]];

export function timelineReducer(state = initialState, action: TimelineAction) {
  switch (action.type) {

    case ActionTypes.SetTimeline:
      return [...action.payload];

    default:
      return state;
  }
}