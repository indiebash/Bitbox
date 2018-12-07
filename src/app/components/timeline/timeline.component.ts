import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Block, Coordinate, SelectionType } from '../block/block.component';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  trackLength = 16;
  timeline: [Block[]] = [[]];
  clicking: boolean = false;
  startPosition: Coordinate;
  endPosition: Coordinate;
  lastDragged: Coordinate;

  ngOnInit() { 
   
  }

  ngAfterViewInit() { 
    this.setBlocks();
  }

  setBlocks() {
    let width = document.getElementById('timeline').clientWidth;
    let size  = (width / (this.trackLength) * 0.98) - 10;
    console.log(width);
    console.log(size);

    for(let x=0; x<this.trackLength; x++) {
      this.timeline[x] = [];
      for(let y=0; y<this.trackLength; y++){
        this.timeline[x].push({
            size: size,
            mouseDown: this.mouseDown.bind(this),
            mouseUp: this.mouseUp.bind(this),
            mouseOver: this.mouseOver.bind(this),
            position: {x: x, y: y},
            class: 'unselected',
            selected: false
          });
      }
    }
  }

  mouseDown(position: Coordinate) {
    this.clicking = true;
    this.startPosition = position;
    this.toggleBlock(position, true, SelectionType.selected);
    this.lastDragged = position;
    this.setRowClasses();
  }

  mouseUp(position: Coordinate) {
    this.clicking = false;
    this.endPosition = position;
  }

  mouseOver(position: Coordinate) {
    console.log(position);
    if(this.clicking) {
      this.toggleBlock({x: position.x, y: this.startPosition.y}, true, SelectionType.selected);
      if(position.x > this.lastDragged.x) {
        console.log('moving right');
        if(position.x <= this.startPosition.x) {
          this.toggleBlock({x: position.x-1, y: this.startPosition.y}, false);
        }
      } else if (position.x < this.lastDragged.x) {
        console.log('moving left');
        if(position.x >= this.startPosition.x) {
          this.toggleBlock({x: position.x+1, y: this.startPosition.y}, false);
        }
      } else {
        console.log('at origin');
      }
      this.setRowClasses();
      this.lastDragged = position;
    }
  }

  setRowClasses() {
    for(let i=0; i<this.trackLength; i++) {
      let block = this.getBlock({x: i, y: this.startPosition.y});
      if(block.selected) {
        if(this.isOnLeft(block.position)) {
          block.class = SelectionType.left;
        } else if (this.isInCenter(block.position)) {
          block.class = SelectionType.center;
        } else if (this.isOnRight(block.position)) {
          block.class = SelectionType.right;
        } else {
          block.class = SelectionType.selected;
        }
      } else {
        block.class = SelectionType.unselected;
      }
    }
  }

  isOnLeft(position: Coordinate) {
    return this.getRightBlock(position) && this.getRightBlock(position).selected 
    && (!this.getLeftBlock(position) || !this.getLeftBlock(position).selected)
  }

  isOnRight(position: Coordinate) {
    return this.getLeftBlock(position) && this.getLeftBlock(position).selected
    && (!this.getRightBlock(position) || !this.getRightBlock(position).selected)
  }

  isInCenter(position: Coordinate) {
    return this.getRightBlock(position) && this.getRightBlock(position).selected 
    && this.getLeftBlock(position) && this.getLeftBlock(position).selected
  }

  getBlock(position: Coordinate) {
    return this.timeline[position.x][position.y];
  }

  getRightBlock(position: Coordinate) {
    return position.x !== this.trackLength - 1 ? this.getBlock({x: position.x+1, y: position.y}): undefined;
  }

  getLeftBlock(position: Coordinate) {
    return position.x !== 0 ? this.getBlock({x: position.x-1, y: position.y}): undefined;
  }

  toggleBlock(position: Coordinate, selected: boolean, selectionType?: SelectionType) {
    let block = this.getBlock(position);
    block.selected = selected;
    if(selected) {
      block.class = selectionType;
    } else {
      block.class = SelectionType.unselected;
    }
  }

}
