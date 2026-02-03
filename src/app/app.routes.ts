
import { Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page.component';
import { DataCheckingPageComponent } from './pages/data-checking-page.component';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  // { path: '', component: HomeComponent },
  { path: '', component: AdminPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'data-check', component: DataCheckingPageComponent }
];
