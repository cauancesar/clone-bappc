import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/auth.component').then(m => m.AuthComponent),
  }
];
