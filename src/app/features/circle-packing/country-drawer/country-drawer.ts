import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-drawer.html',
  styleUrls: ['./country-drawer.scss']
})
export class CountryDrawer {
  @Input() country: any;
}
