import { Coordinate } from '.';

export class Block {
    size: number;
    mouseDown: Function;
    mouseUp: Function;
    mouseOver: Function;
    position: Coordinate;
    class: string;
    selected: boolean;
    end: boolean;
    single: boolean;
  }