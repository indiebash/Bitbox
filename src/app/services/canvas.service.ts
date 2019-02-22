import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, MiscState } from '../state/app.state';
import { Layer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  layers: Layer[] = [];
  state: MiscState;
  lineHeight: number;

  constructor(private store: Store<AppState>) {   }

  initialize() {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.onmousemove = this.mouseMove.bind(this);
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
  }

  mouseMove(e: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    this.drawCanvas();
    // this.ctx.fillStyle = "#444";
    // this.ctx.fillRect(x,y,20,20);
    // TODO - Find coordinate of note we're on. 
  }

  drawCanvas() {
    this.canvas.width = window.innerWidth*0.8;
    this.canvas.height = window.innerHeight*0.8;
    this.lineHeight = this.canvas.height / 12;
    this.drawTimelineBackground();
    //this.drawNotes();
    this.drawGrid();
  }

  drawGrid() {
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = "#444";
    if(this.state) {
      let columnWidth = this.canvas.width / this.state.trackLength;
      for(var x=0; x<this.state.trackLength; x++) {
        for(var y=0; y<this.state.notes.length; y++) {
          //this.ctx.fillRect(x*columnWidth+5, y*this.lineHeight+5, columnWidth-5, this.lineHeight-5);
          this.roundRect(x*columnWidth+5, y*this.lineHeight+5, columnWidth-5, this.lineHeight-5, 5, true);
        }  
      }
    }
    this.ctx.globalAlpha = 1;
  }

  // drawNotes() {
  //   for(var i=0; i<12; i++) {
  //     this.ctx.fillStyle = "#444";
  //     this.ctx.fillRect(0, i * this.lineHeight+2, this.canvas.width*0.05, this.lineHeight-2);
  //     if(this.state) {
  //       this.ctx.font = `${this.canvas.height*0.05}px Arial`;
  //       this.ctx.fillStyle = "#ddd";
  //       this.ctx.fillText(this.state.notes[i], this.canvas.width*0.01, i * this.lineHeight+(this.lineHeight*0.75));
  //     }
  //   }
  // }

  drawTimelineBackground() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#222";
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.4;

    if (this.state) {
      for (var i = 0; i < this.state.trackLength / 4; i++) {
        // this.ctx.fillRect(
        //   this.canvas.width / (this.state.trackLength / 4) + (i * (this.canvas.width / (this.state.trackLength / 8))),
        //   0,
        //   this.canvas.width / (this.state.trackLength / 4),
        //   this.canvas.height
        // );

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / (this.state.trackLength / 4) + (i * (this.canvas.width / (this.state.trackLength / 4)))+2.5, 0);
        this.ctx.lineTo(this.canvas.width / (this.state.trackLength / 4) + (i * (this.canvas.width / (this.state.trackLength / 4)))+2.5, this.canvas.height);
        this.ctx.stroke();
      }
    }
    this.ctx.globalAlpha = 1;
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
