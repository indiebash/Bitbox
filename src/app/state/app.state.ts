import { Block, Layer } from '../models';

export interface AppState {
    misc: MiscState;
    timeline: [Block[]];
    layers: Layer[];
}

export interface MiscState {
    time: number;
    trackLength: number;
    notes: string[];
    selectedLayer: number
}