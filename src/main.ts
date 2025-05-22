import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Route } from '@angular/router';
import { LoginComponent } from './app/Components/login/login.component';
import { HeaderComponent } from './app/Components/header/header.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserComponent } from './app/Components/user/user.component';
import { AdminComponent } from './app/Components/admin/admin.component';
import { AdminDashboardComponent } from './app/Components/admin-dashboard/admin-dashboard.component';
import { authGuard } from './app/auth-guard';
import { GenaiComponent } from './app/Components/genai/genai.component';
import { provideAnimations } from '@angular/platform-browser/animations';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const translateProviders =
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }).providers || [];

const routes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'genai', component: GenaiComponent },
  { path: 'texttoimage', component: GenaiComponent },
  { path: 'aisupport', component: GenaiComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    TranslateStore,
    ...translateProviders,
    GenaiComponent,
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
