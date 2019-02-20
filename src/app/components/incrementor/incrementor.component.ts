import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'incrementor',
  templateUrl: './incrementor.component.html',
  styleUrls: ['./incrementor.component.scss']
})
export class IncrementorComponent implements OnInit {
  @Input() data: Incrementor;

  constructor() { }

  ngOnInit() { }

}

export class Incrementor {
  label: string;
  value: any;
  color: string;
  increaseFunc: Function;
  decreaseFunc: Function;
  useIcon: boolean;

  constructor(label: string, value: any, color: string, increaseFunc: Function, decreaseFunc: Function, useIcon?: boolean) {
    this.label = label;
    this.value = value;
    this.color = color;
    this.increaseFunc = increaseFunc;
    this.decreaseFunc = decreaseFunc;
    this.useIcon = useIcon;
  }
}
