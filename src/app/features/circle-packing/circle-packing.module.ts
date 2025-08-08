import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { CirclePackingComponent } from './circle-packing.component';
import { CountryDrawerComponent } from '../country-drawer-component/country-drawer.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AsyncPipe,
    CirclePackingComponent,
    CountryDrawerComponent
  ],
  exports: [
    CountryDrawerComponent
  ]
})
export class CirclePackingModule { }
