import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectionType } from '../../enums';
import { Block, Coordinate } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { SetTimeline } from 'src/app/state/actions/timeline.actions';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  trackLength: number;
  timeline$: Observable<[Block[]]>;
  clicking: boolean;
  startPosition: Coordinate;
  endPosition: Coordinate;
  lastDragged: Coordinate;

  constructor(private store: Store<AppState>) {
    window.addEventListener("resize", this.initializeBlocks.bind(this));
    this.timeline$ = this.store.pipe(select('timeline'));
  }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.store.pipe(select('misc', 'trackLength')).subscribe(trackLength => {
        this.trackLength = trackLength;
        this.initializeBlocks();
      });
    }, 100);
  }
 
  initializeBlocks() {
    let initialTimeline: [Block[]] = [[]];
    const size = (document.getElementById('timeline').clientWidth / (this.trackLength) * 0.98) - 10;

    for(let x=0; x<this.trackLength; x++) {
      initialTimeline[x] = [];
      for(let y=0; y<12; y++){
        initialTimeline[x].push({
            size: size,
            mouseUp: this.mouseUp.bind(this),
            mouseDown: this.mouseDown.bind(this),
            mouseOver: this.mouseOver.bind(this),
            position: {x: x, y: y},
            class: 'unselected',
            selected: false,
            end: false,
            single: false
          });
      }
    }
    this.store.dispatch(new SetTimeline(initialTimeline));
  }

  mouseDown(position: Coordinate, event) {
    this.timeline$.pipe(take(1)).subscribe(timeline => {
      let block = this.getBlock(timeline, position);
      if(!block.selected) {
        this.clicking = true;
        this.startPosition = position;
        block.selected = true;
        block.class = SelectionType.selected;
        block.end = true;
        this.lastDragged = position;
        this.store.dispatch(new SetTimeline(timeline));
      }    
    });
  }

  mouseUp(position: Coordinate) {
    this.timeline$.pipe(take(1)).subscribe(timeline => {
      this.clicking = false;
      this.endPosition = position;
      if(this.endPosition.x > this.lastDragged.x+1 || this.endPosition.x < this.lastDragged.x-1) {
        this.getBlock(timeline, new Coordinate(this.lastDragged.x, this.startPosition.y)).end = true;
      } else {
        this.getBlock(timeline, new Coordinate(position.x, this.startPosition.y)).end = true;
      }
      if(this.startPosition.x === this.endPosition.x){
        timeline[this.startPosition.x][this.startPosition.y].single = true;
        timeline[this.startPosition.x][this.startPosition.y].class = SelectionType.selected;
      }
      this.store.dispatch(new SetTimeline(timeline));
    });
  }

  mouseOver(position: Coordinate) {
    this.timeline$.pipe(take(1)).subscribe(timeline => {
      if(this.clicking 
        && !timeline[position.x][this.startPosition.y].selected
        && (this.lastDragged.x === position.x+1 || this.lastDragged.x === position.x-1)
        ) {
        timeline[position.x][this.startPosition.y].selected = true;
        timeline[position.x][this.startPosition.y].single = false;
        if(position.x > this.lastDragged.x) {
          //console.log('moving right');
          timeline[position.x][this.startPosition.y].class = SelectionType.right;
          this.setPreviousLeft(timeline, new Coordinate(position.x, this.startPosition.y));
          if(position.x <= this.startPosition.x) {
            timeline[position.x-1][this.startPosition.y].selected = false;
          }
        } else if (position.x < this.lastDragged.x) {
          //console.log('moving left');
          timeline[position.x][this.startPosition.y].class = SelectionType.left;
          this.setPreviousRight(timeline, new Coordinate(position.x, this.startPosition.y));
          if(position.x >= this.startPosition.x) {
            timeline[position.x+1][this.startPosition.y].selected = false;
          }
        } else {
          //console.log('at origin');                
        }
        this.lastDragged = position;
        this.store.dispatch(new SetTimeline(timeline));
      }
    });
  }

  setPreviousLeft(timeline: [Block[]], position: Coordinate) {
    if(position.x > 0) {
      let block = this.getBlock(timeline, new Coordinate(position.x-1, position.y));
      if(block.selected) {
        if(block.end) {
          block.class = SelectionType.left;
        } else {
          block.class = SelectionType.center;
        }
      }
    }
  }

  setPreviousRight(timeline: [Block[]], position: Coordinate) {
    if(position.x < this.trackLength-1) {
      let block = this.getBlock(timeline, new Coordinate(position.x+1, position.y));
      if(block.selected) {
        if(block.end) {
          block.class = SelectionType.right;
        } else {
          block.class = SelectionType.center;
        }
      }
    }
  }

  // setNextRight(x: number, y: number) {
  //   if(x < this.timeline.length-1) {
  //     let block = this.getBlock(x+1, y);
  //   }
  // }

  // setBlockState(x: number, y: number) {
  //   if(x >= 0 && x <= this.timeline.length) {
  //     let block = this.getBlock(x,y);
  //     if(block.selected) {
  //       if(this.isOnLeft(block.position) && !block.single) {
  //         block.class = SelectionType.left;
  //       } else if (this.isInCenter(block.position) && !block.single) {
  //         block.class = SelectionType.center;
  //       } else if (this.isOnRight(block.position) && !block.single) {
  //         block.class = SelectionType.right;
  //       } else {
  //         block.class = SelectionType.selected;
  //       }
  //     } else {
  //       block.class = SelectionType.unselected;
  //       block.end = false;
  //     }
  //   }
  // }

  // setRowClasses() {
  //   for(let i=0; i<this.trackLength; i++) {
  //     let block = this.getBlock(i, this.startPosition.y);
  //     if(block.selected) {
  //       if(this.isOnLeft(block.position) && !block.single) {
  //         block.class = SelectionType.left;
  //       } else if (this.isInCenter(block.position) && !block.single) {
  //         block.class = SelectionType.center;
  //       } else if (this.isOnRight(block.position) && !block.single) {
  //         block.class = SelectionType.right;
  //       } else {
  //         block.class = SelectionType.selected;
  //       }
  //     } else {
  //       block.class = SelectionType.unselected;
  //     }
  //   }
  // }

  // isOnLeft(position: Coordinate) {
  //   let rightBlock = this.getRightBlock(position);
  //   let leftBlock = this.getLeftBlock(position);
  //   return rightBlock 
  //   && rightBlock.selected 
  //   && (rightBlock.class === SelectionType.right || rightBlock.class === SelectionType.center)
  //   && (!leftBlock || !leftBlock.selected || leftBlock.class !== SelectionType.right);
  // }

  // isOnRight(position: Coordinate) {
  //   let rightBlock = this.getRightBlock(position);
  //   let leftBlock = this.getLeftBlock(position);
  //   return leftBlock && rightBlock.selected && (!rightBlock || !rightBlock.selected);
  // }

  // isInCenter(position: Coordinate) {
  //   return this.getRightBlock(position) && this.getRightBlock(position).selected 
  //   && this.getLeftBlock(position) && this.getLeftBlock(position).selected
  // }

  getBlock(timeline: [Block[]], position: Coordinate) {
    return timeline[position.x][position.y];
  }

  // getRightBlock(position: Coordinate) {
  //   return position.x !== this.trackLength - 1 ? this.getBlock(position.x+1, position.y): undefined;
  // }

  // getLeftBlock(position: Coordinate) {
  //   return position.x !== 0 ? this.getBlock(position.x-1, position.y): undefined;
  // }
}
