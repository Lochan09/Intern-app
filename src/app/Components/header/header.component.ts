import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DatePipe],
})
export class HeaderComponent implements OnInit {
  title = 'Intern-project';
  message = 'Intern-project Greetings';
  time = new Date().getHours();
  greeting: string = '';
  currentDateTime: any;
  showLogoutButton: boolean = true;
  isDarkMode: boolean = true;

  constructor(
    private router: Router,
    private shared: SharedService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.shared.setMessage(this.message);

    setInterval(() => {
      this.currentDateTime = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
    }, 1000);

    if (this.time < 12) {
      this.greeting = `Good Morning`;
    } else if (this.time < 16) {
      this.greeting = `Good Afternoon`;
    } else {
      this.greeting = `Good Evening`;
    }
    this.shared.setWelcome(this.greeting);

    // Check the current route and hide the logout button if on the login page
    this.router.events.subscribe(() => {
      this.showLogoutButton = this.router.url !== '/login';
    });

    // Initialize theme mode from local storage or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || !savedTheme;
    this.applyTheme();
  }

  changeTheme(event: Event) {
    const selectedTheme = (event.target as HTMLSelectElement).value;
    this.isDarkMode = selectedTheme === 'dark';
    localStorage.setItem('theme', selectedTheme);
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }

  Logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }
}
