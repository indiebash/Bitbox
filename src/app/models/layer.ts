import { PlaybackType } from "../enums";

export class Layer {
    octave: number;
    playbackRate: number;
    color: string;
    playbackType: PlaybackType;
    pitch: number;
    playing: false = false;

    constructor(octave?: number, playbackRate?: number, color?: string, playbackType?: PlaybackType, pitch?: number) {
        this.octave = octave ? octave : 4;
        this.playbackRate = playbackRate ? playbackRate : 1;
        this.color = color ? color : 'blue';
        this.playbackType = playbackType ? playbackType : PlaybackType.forward;
        this.pitch = pitch ? pitch : 0;
    }
}