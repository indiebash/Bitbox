import { Layer } from 'src/app/models';
import { ActionTypes, LayerAction } from '../actions/layer.actions';

export const initialState: Layer[] = [new Layer()];

export function layerReducer(state = initialState, action: LayerAction) {
  let newState = [...state];

  switch (action.type) {

    case ActionTypes.AddLayer:
      return [...state, action.payload];

    case ActionTypes.SetPlaybackRate:
      newState[action.payload.index].playbackRate = action.payload.value;
      return newState;

    case ActionTypes.SetOctave:
      newState[action.payload.index].octave = action.payload.value;
      return newState;

    default:
      return state;
  }
}