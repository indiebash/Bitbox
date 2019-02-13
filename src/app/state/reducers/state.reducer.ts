import { Action } from '@ngrx/store';
import { ActionTypes, StateAction } from '../actions/state.actions';
import { AppState, MiscState } from '../app.state';

export const initialState: MiscState = {
  time: 0,
  trackLength: 16,
  notes: ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C']
};

export function stateReducer(state = initialState, action: StateAction) {
  switch (action.type) {
    case ActionTypes.SetTime:
      return {...state, time: action.payload};

    case ActionTypes.ResetTime:
      return {...state, time: 0};

    default:
      return state;
  }
}