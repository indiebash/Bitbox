import { Action } from '@ngrx/store';
import { ActionTypes, StateAction } from '../actions/state.actions';
import { AppState } from '../app.state';

export const initialState: AppState = {
  time: 0
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