import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/circle-packing/circle-packing.module').then(m => m.CirclePackingModule) },
];
