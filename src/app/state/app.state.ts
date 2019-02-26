import { Layer, Note } from '../models';

export interface AppState {
    misc: MiscState;
    timeline: Note[];
    layers: Layer[];
}

export interface MiscState {
    time: number;
    trackLength: number;
    notes: string[];
    selectedLayer: number
}