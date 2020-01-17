import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ColorType, PlaybackType } from '../../enums';
import { Coordinate, Layer, Note } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState, MiscState } from 'src/app/state/app.state';
import { AddNote, ExtendNoteRight, ExtendNoteLeft, DeleteNote } from 'src/app/state/actions/timeline.actions';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layers: Layer[] = [];
  state: MiscState;
  lineHeight: number;
  columnWidth: number;
  position: Coordinate;
  timeline: Note[] = [];
  dragging: boolean = false;
  startPos: Coordinate;
  deleting: boolean = false;

  constructor(private store: Store<AppState>) { }

  ngOnInit() { }

  ngAfterViewInit() {
    
    // Prevent menu during right click
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);

    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.onmousemove = this.mouseOver.bind(this);
    this.canvas.onmouseleave = this.mouseLeave.bind(this);
    this.drawCanvas();

    window.addEventListener("resize", this.drawCanvas.bind(this));

    this.store.pipe(select('layers')).subscribe(layers => {
      this.layers = layers;
      this.drawCanvas();
    });

    this.store.pipe(select('misc')).subscribe((misc: MiscState) => {
      this.state = misc;
      this.drawCanvas();
    });

    this.store.pipe(select('timeline')).subscribe(timeline => {
      this.timeline = timeline;
      this.drawCanvas();
    });
  }

  mouseOver(e: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let yPos = Math.trunc(y/(this.canvas.height/12));
    let xPos = Math.trunc(x/(this.canvas.width/this.state.trackLength));
    if(!this.position || this.position.x !== xPos || this.position.y !== yPos) {
      // Position Changed
      if(this.dragging) {
        let note = this.getNote(this.startPos);
        if(xPos > this.position.x) {
          // Dragged right
          if(!this.getNote(new Coordinate(xPos, yPos)) && xPos === note.position.x + note.length) {
            this.store.dispatch(new ExtendNoteRight(note));
          }
        } else if(xPos < this.position.x) {
          // Dragged left
          if(!this.getNote(new Coordinate(xPos, yPos)) && xPos === note.position.x - 1) {
            this.store.dispatch(new ExtendNoteLeft(note));
          }
        }
      }
      this.position = new Coordinate(xPos, yPos);
    }
    this.drawCanvas();
  }

  mouseLeave(e: MouseEvent) {
    this.position = undefined;
    this.dragging = false;
    this.startPos = undefined;
    this.drawCanvas();
  }

  mouseUp() {
    this.position = undefined;
    this.dragging = false;
    this.startPos = undefined;
  }

  mouseDown(e: MouseEvent) {
    this.deleting = e.button !== 0;
      this.startPos = {...this.position};
      this.dragging = true;
      if(!this.getNote(this.position) && !this.deleting) {
        this.store.dispatch(new AddNote(new Note(this.position)));
      } else if(this.getNote(this.position) && this.deleting) {
        this.store.dispatch(new DeleteNote(this.getNote(this.position)));
      }
  }

  getNote(position: Coordinate) : Note {
    return this.position ? this.timeline.find(note => 
      note.position.y === position.y
      && position.x >= note.position.x
      && position.x <= note.position.x+note.length-1
    ) : undefined;
  };

  drawNotes() {
    this.ctx.fillStyle = ColorType[this.layers[this.state.selectedLayer].color];
    this.ctx.shadowBlur = 50;
    this.ctx.shadowColor = ColorType[this.layers[this.state.selectedLayer].color];

    this.timeline.forEach(note => {
      this.roundRect(
        note.position.x * this.columnWidth + 2.5,
        note.position.y * this.lineHeight + 2.5,
        note.length * this.columnWidth - 5,
        this.lineHeight - 5,
        5,
        true
      );
    });
    this.ctx.shadowBlur = 0;
  }

  highlightNote(xIndex: number, yIndex: number) {
    this.ctx.fillStyle = "#444";
    this.ctx.globalAlpha = 0.5;
    this.roundRect(
      xIndex*this.canvas.width/this.state.trackLength+2.5, 
      yIndex*this.canvas.height/12+2.5, 
      this.canvas.width / this.state.trackLength-5,
      this.lineHeight-5,
      5,
      true
    );
    this.ctx.globalAlpha = 1;
  }

  highlightRow(yIndex: number) {
    this.ctx.fillStyle = "#444";
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillRect(0,yIndex*this.canvas.height/12,this.canvas.width,this.canvas.height/12);
    this.ctx.globalAlpha = 1;
  }

  drawCanvas() {
    if (this.state) {
      this.canvas.width = window.innerWidth * 0.8;
      this.canvas.height = window.innerHeight * 0.8;
      this.lineHeight = this.canvas.height / 12;
      this.columnWidth = this.canvas.width / this.state.trackLength;
      this.drawTimelineBackground();
      this.drawGrid();

      // Mouse over canvas
      if (this.position) {
        this.highlightRow(this.position.y);
        this.highlightNote(this.position.x, this.position.y);
      }

      this.drawNotes();
      this.drawScrubbers();
    }
  }

  drawGrid() {
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = "#444";
    if(this.state) {
      for(var x=0; x<this.state.trackLength; x++) {
        for(var y=0; y<this.state.notes.length; y++) {
          //this.ctx.fillRect(x*columnWidth+5, y*this.lineHeight+5, columnWidth-5, this.lineHeight-5);
          this.roundRect(x*this.columnWidth+2.5, y*this.lineHeight+2.5, this.columnWidth-5, this.lineHeight-5, 5, true);
        }  
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawTimelineBackground() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#222";
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.5;

    if (this.state) {
      for (var i = 0; i < this.state.trackLength / 4; i++) {
        this.ctx.fillRect(
          this.canvas.width / (this.state.trackLength / 4) + (i * (this.canvas.width / (this.state.trackLength / 8))),
          0,
          this.canvas.width / (this.state.trackLength / 4),
          this.canvas.height
        );
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawScrubbers() {
    this.ctx.shadowBlur = 25;
    this.ctx.lineWidth = 2;
    this.layers.filter(layer => layer.playing).forEach(layer => {
      this.ctx.strokeStyle = ColorType[layer.color];
      this.ctx.shadowColor = ColorType[layer.color];
      let xPos;
      let halfLength = this.state.trackLength / 2;
      if(layer.playbackType === PlaybackType.forward) {
        xPos = (this.state.time/halfLength%halfLength*layer.playbackRate%1)*this.canvas.width;
      } else if (layer.playbackType === PlaybackType.backwards) {
        xPos = ((1-(this.state.time/halfLength%halfLength*layer.playbackRate%1))*this.canvas.width);
      }

      this.ctx.beginPath();
      this.ctx.moveTo(xPos, 0);
      this.ctx.lineTo(xPos, this.canvas.height);
      this.ctx.stroke();
    });
    this.ctx.shadowBlur = 0;
  }

  roundRect(x: number, y: number, width: number, height: number, radius: number, fill: boolean) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    if (fill) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
 
}
