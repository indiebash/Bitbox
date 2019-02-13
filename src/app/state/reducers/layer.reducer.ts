import { Layer } from 'src/app/models';
import { ActionTypes, LayerAction } from '../actions/layer.actions';

export const initialState: Layer[] = [new Layer()];

export function layerReducer(state = initialState, action: LayerAction) {
  switch (action.type) {

    case ActionTypes.AddLayer:
      return [...state, action.payload];

    default:
      return state;
  }
}