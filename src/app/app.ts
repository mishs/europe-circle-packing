import { Component } from '@angular/core';
import { CirclePackingComponent } from './features/circle-packing/circle-packing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CirclePackingComponent],
  template: `<app-circle-packing></app-circle-packing>`
})
export class App {}
