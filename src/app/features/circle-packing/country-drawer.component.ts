import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Country {
  country: string;
  population: number;
  wikipedia: string;
  flag: string;
  land_area_km2: number;
  region: string;
}

@Component({
  selector: 'app-country-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="country">
      <header class="drawer-header">
        <img class="flag" [src]="country.flag" [alt]="country.country + ' flag'"
             (error)="onImgError($event)" />
        <div>
          <h2>{{ country.country }}</h2>
          <div class="sub">{{ country.region }}</div>
        </div>
      </header>

      <ul class="stats">
        <li><b>Population:</b> {{ country.population | number }}</li>
        <li><b>Land area:</b> {{ country.land_area_km2 | number }} km²</li>
        <li>
          <a [href]="country.wikipedia" target="_blank" rel="noopener">Wikipedia</a>
        </li>
      </ul>
    </ng-container>
  `,
  styles: [`
    .drawer-header { display:flex; align-items:center; gap:12px; padding:12px 0; }
    .flag { width:56px; height:36px; object-fit:cover; border-radius:4px; border:1px solid #ddd; }
    h2 { margin:0; font-size:20px; }
    .sub { color:#6b7280; font-size:12px; }
    .stats { list-style:none; padding:0; margin:12px 0 0; display:grid; gap:6px; }
    a { text-decoration: underline; }
  `]
})
export class CountryDrawerComponent {
  @Input() country: Country | null = null;
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36"/>';
  }
}
