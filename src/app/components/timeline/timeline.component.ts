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
    this.setNotes();
  }

  lastNote = -10;
  setNotes() {
    this.trackService.clear();
    let synth = new Tone.PolySynth(12, Tone.Synth).toMaster();
    let lineNotes = [];
    let lastNote = undefined;
    // start, length, noteIndex
    for(let y=0; y<this.notes.length; y++){
      lastNote = -10
        for(let x=0; x<this.trackLength; x++) {
        if(this.timeline[x][y].selected) {
          console.log('checking x:'+x, x-1);
          console.log('lastNote', this.lastNote);
          if(this.lastNote === x-1) {
            console.log('lastNote found!', {x: x, y: y});
            lineNotes[lineNotes.length-1].length += 1;
            this.lastNote = x;
          } else {
            this.lastNote = x;
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
    console.log(lineNotes.length + ' notes recored');

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

  mouseOver(position: Coordinate) {
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
