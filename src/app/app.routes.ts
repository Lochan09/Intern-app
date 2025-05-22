import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AdminComponent } from './Components/admin/admin.component';
import { UserComponent } from './Components/user/user.component';
import { authGuard } from './auth-guard';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { GenaiComponent } from './Components/genai/genai.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
  { path: 'genai', component: GenaiComponent },
  { path: '**', redirectTo: 'login' },
];
