import { Coordinate } from "./coordinate";

export class Note {
    position: Coordinate;
    length: number;

    constructor(position: Coordinate, length?: number) {
        this.position = position;
        this.length = length ? length : 1;
    }
}