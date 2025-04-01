import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from './Components/admin/admin.component';
import { LoginComponent } from './Components/login/login.component';
import { HeaderComponent } from './Components/header/header.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Intern-app';
  http = inject(HttpClient);

  private API_URL = 'https://localhost:3002';

  // getPosts() {
  //   return this.http.get(`${this.API_URL}/post`);
  // }

  // constructor() {
  //   this.getPosts().subscribe((data: any) => {
  //     console.log(data);
  //   });
  // }
}
