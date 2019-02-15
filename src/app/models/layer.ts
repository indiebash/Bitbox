export class Layer {
    octave: number;
    playbackRate: number;
    color: string;

    constructor(octave?: number, playbackRate?: number, color?: string) {
        this.octave = octave ? octave : 1;
        this.playbackRate = playbackRate ? playbackRate : 1;
        this.color = color ? color : 'blue';
    }
}