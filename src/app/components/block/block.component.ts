import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() data: Block;

  constructor() { }

  ngOnInit() { }

}

export class Block {
  size: number;
  mouseDown: Function;
  mouseUp: Function;
  mouseOver: Function;
  position: Coordinate;
  class: string;
  selected: boolean;
}

export class Coordinate {
  x: number;
  y: number;
}

export enum SelectionType {
  unselected = 'unselected',
  selected = 'selected',
  center = 'center',
  left = 'left',
  right = 'right'
}
