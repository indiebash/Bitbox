export class Layer {
    octave: number;
    speedMultiplier: number;
    color: string;

    constructor(octave?: number, speedMultiplier?: number, color?: string) {
        this.octave = octave ? octave : 1;
        this.speedMultiplier = speedMultiplier ? speedMultiplier : 1;
        this.color = color ? color : 'blue';
    }
}