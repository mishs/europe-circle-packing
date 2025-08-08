import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
// import { Country } from '../../models/country.model';

@Component({
  selector: 'app-country-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-drawer.component.html',
  styleUrls: ['./country-drawer.component.scss']
})
export class CountryDrawerComponent {
  @Input() country: Country | null = null;
	countries: any;
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36"/>';
  }
}
