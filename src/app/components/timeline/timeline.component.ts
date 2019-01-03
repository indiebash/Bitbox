import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Block, Coordinate, SelectionType } from '../block/block.component';
import * as Tone from 'tone';
import { TrackService } from 'src/app/services/track.service';

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
  notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  constructor(private trackService: TrackService) {
    this.notes = this.notes.reverse();
  }

  ngOnInit() {
    // let synth = new Tone.Synth().toMaster();
    // //use an array of objects as long as the object has a "time" attribute
    // var part = new Tone.Part(function (time, value) {
    //   //the value is an object which contains both the note and the velocity
    //   synth.triggerAttackRelease(value.note, value.length, time);
    // }, [{ "time": "0:0", "note": "C3", "length": "8n" },
    // { "time": "0:2", "note": "C4", "length": "8n" }
    //   ]).start(0);
    //   var part2 = new Tone.Part(function (time, value) {
    //     //the value is an object which contains both the note and the velocity
    //     synth.triggerAttackRelease(value.note, value.length, time);
    //   }, [{ "time": "0:0", "note": "D3", "length": "8n" },
    //   { "time": "0:2", "note": "D4", "length": "8n" }
    //     ]).start(0);
  }

    ngAfterViewInit() { 
    this.setBlocks();
  }
 
  setBlocks() {
    let width = document.getElementById('timeline').clientWidth;
    let size  = (width / (this.trackLength) * 0.98) - 10;

    for(let x=0; x<this.trackLength; x++) {
      this.timeline[x] = [];
      for(let y=0; y<this.notes.length; y++){
        this.timeline[x].push({
            size: size,
            mouseDown: this.mouseDown.bind(this),
            mouseUp: this.mouseUp.bind(this),
            mouseOver: this.mouseOver.bind(this),
            position: {x: x, y: y},
            class: 'unselected',
            selected: false,
            end: false,
            single: false
          });
      }
    }
  }

  mouseDown(position: Coordinate) {
    this.clicking = true;
    this.startPosition = position;
    let block = this.getBlock(position.x, position.y);
    block.selected = true;
    block.class = SelectionType.selected;
    block.end = true;
    this.lastDragged = position;
    //this.setRowClasses();
  }

  mouseUp(position: Coordinate) {
    this.clicking = false;
    this.endPosition = position;
    if(this.endPosition.x > this.lastDragged.x+1 || this.endPosition.x < this.lastDragged.x-1) {
      this.getBlock(this.lastDragged.x, this.startPosition.y).end = true;
    } else {
      this.getBlock(position.x, this.startPosition.y).end = true;
    }
    if(this.startPosition.x === this.endPosition.x){
      this.timeline[this.startPosition.x][this.startPosition.y].single = true;
      this.timeline[this.startPosition.x][this.startPosition.y].class = SelectionType.selected;
    }
    //this.setRowClasses();
    this.setNotes();
  }

  lastNote = new Coordinate(-10, -10);
  setNotes() {
    this.trackService.clear();
    let synth = new Tone.PolySynth(12, Tone.Synth).toMaster();
    let lineNotes = [];
    let lastNote: Coordinate = undefined;
    // start, length, noteIndex
    for (let y = 0; y < this.notes.length; y++) {
      lastNote = new Coordinate(-10, -10);
      for (let x = 0; x < this.trackLength; x++) {
        if (this.timeline[x][y].selected) {
          console.log('checking x:' + x, x - 1);
          console.log('lastNote', this.lastNote);
          if (this.lastNote.x === x - 1 && this.lastNote.y === y && (this.timeline[x-1][y].class === SelectionType.center || this.timeline[x-1][y].class === SelectionType.left)) {
            console.log('lastNote found! Extending note', { x: x, y: y });
            lineNotes[lineNotes.length - 1].length += 1;
            this.lastNote = new Coordinate(x, y);
          } else {
            this.lastNote = new Coordinate(x, y);
            console.log('just set lastNote', x);
            lineNotes.push({
              start: x,
              length: 1,
              noteIndex: y
            });
          }
          // lineNotes.push({ "time": `0:${x}`, "note": `${this.notes[y]}4`, "length": "0:1:0" });
        }
      }
    }
    console.log('notes', lineNotes);

    let final = lineNotes.map(lineNote => {
      return {
        time: `0:${lineNote.start}`,
        note: `${this.notes[lineNote.noteIndex]}4`,
        length: `0:${lineNote.length}:0`
      }
    });
    new Tone.Part(function (time, value) {
      synth.triggerAttackRelease(value.note, value.length, time); 
    }, final).start(0);
  }

  setPreviousLeft(x: number, y: number) {
    if(x > 0) {
      let block = this.getBlock(x-1, y);
      if(block.selected) {
        if(block.end) {
          block.class = SelectionType.left;
        } else {
          block.class = SelectionType.center;
        }
      }
    }
  }

  setPreviousRight(x: number, y: number) {
    if(x < this.trackLength-1) {
      let block = this.getBlock(x+1, y);
      if(block.selected) {
        if(block.end) {
          block.class = SelectionType.right;
        } else {
          block.class = SelectionType.center;
        }
      }
    }
  }

  setNextRight(x: number, y: number) {
    if(x < this.timeline.length-1) {
      let block = this.getBlock(x+1, y);

    }
  }

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

  mouseOver(position: Coordinate) {
    if(this.clicking 
      && !this.timeline[position.x][this.startPosition.y].selected
      && (this.lastDragged.x === position.x+1 || this.lastDragged.x === position.x-1)
      ) {
      //this.toggleBlock({x: position.x, y: this.startPosition.y}, true, SelectionType.selected);
      this.timeline[position.x][this.startPosition.y].selected = true;
      this.timeline[position.x][this.startPosition.y].single = false;
      if(position.x > this.lastDragged.x) {
        //console.log('moving right');
        this.timeline[position.x][this.startPosition.y].class = SelectionType.right;
        this.setPreviousLeft(position.x, this.startPosition.y);
        if(position.x <= this.startPosition.x) {
          this.timeline[position.x-1][this.startPosition.y].selected = false;
        }

      } else if (position.x < this.lastDragged.x) {
        //console.log('moving left');
        this.timeline[position.x][this.startPosition.y].class = SelectionType.left;
        this.setPreviousRight(position.x, this.startPosition.y);
        if(position.x >= this.startPosition.x) {
          this.timeline[position.x+1][this.startPosition.y].selected = false;
        }
      } else {
        //console.log('at origin');                
      }
      //this.setRowClasses();
      this.lastDragged = position;
    }
  }

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

  isOnLeft(position: Coordinate) {
    let rightBlock = this.getRightBlock(position);
    let leftBlock = this.getLeftBlock(position);
    return rightBlock 
    && rightBlock.selected 
    && (rightBlock.class === SelectionType.right || rightBlock.class === SelectionType.center)
    && (!leftBlock || !leftBlock.selected || leftBlock.class !== SelectionType.right);
  }

  isOnRight(position: Coordinate) {
    let rightBlock = this.getRightBlock(position);
    let leftBlock = this.getLeftBlock(position);
    return leftBlock && rightBlock.selected && (!rightBlock || !rightBlock.selected);
  }

  isInCenter(position: Coordinate) {
    return this.getRightBlock(position) && this.getRightBlock(position).selected 
    && this.getLeftBlock(position) && this.getLeftBlock(position).selected
  }

  getBlock(x: number, y: number) {
    return this.timeline[x][y];
  }

  getRightBlock(position: Coordinate) {
    return position.x !== this.trackLength - 1 ? this.getBlock(position.x+1, position.y): undefined;
  }

  getLeftBlock(position: Coordinate) {
    return position.x !== 0 ? this.getBlock(position.x-1, position.y): undefined;
  }

  // toggleBlock(position: Coordinate, selected: boolean, selectionType?: SelectionType) {
  //   let block = this.getBlock(position);
  //   block.selected = selected;
  //   if(selected) {
  //     block.class = selectionType;
  //   } else {
  //     block.class = SelectionType.unselected;
  //   }
  // }

}
