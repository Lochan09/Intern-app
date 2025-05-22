import { Component, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthService } from '../../auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  title = 'Login page';
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  login() {
    if (this.username === 'admin' && this.password === 'admin123') {
      this.authService.login();
      this.router.navigate(['/admin']);
      localStorage.setItem('username', JSON.stringify(this.username));
      localStorage.setItem('password', JSON.stringify(this.password));
    } else if (this.username === 'user' && this.password === 'user123') {
      this.authService.login();
      this.router.navigate(['/user']);
      localStorage.setItem('username', JSON.stringify(this.username));
      localStorage.setItem('password', JSON.stringify(this.password));
    } else {
      this.errorMessage =
        'Login failed. Please check your credentials and try again.';
    }
  }

  navigateToGenai(): void {
    console.log('Navigating to Genai Component');
    this.router.navigate(['/genai']);
  }
}
