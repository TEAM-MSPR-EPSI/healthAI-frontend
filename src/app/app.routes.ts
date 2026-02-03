
import { Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page.component';
import { DataCheckingPageComponent } from './pages/data-checking-page.component';
import { Home } from './pages/home/home';

export const routes: Routes = [
  // { path: '', component: Home },
  { path: '', component: AdminPageComponent },
  { path: 'home', component: Home },
  { path: 'admin', component: AdminPageComponent },
  { path: 'data-check', component: DataCheckingPageComponent }
];
