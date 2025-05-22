import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DatePipe],
})
export class HeaderComponent implements OnInit {
  message = 'Intern-project Greetings';
  time = new Date().getHours();
  greeting: string = '';
  currentDateTime: any;
  showLogoutButton: boolean = false;
  isDarkMode: boolean = true;
  isLoggedIn: boolean = false;
  isLoginPage: boolean = false;

  constructor(
    private router: Router,
    private shared: SharedService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'hi', 'kn', 'te', 'ta', 'ml', 'ne']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.checkLoginStatus(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus(event.url);
      }
    });

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || !savedTheme;
    this.applyTheme();
    this.updateGreeting();
    this.updateTime();

    // Subscribe to language changes to update greeting
    this.translate.onLangChange.subscribe(() => {
      this.updateGreeting();
    });
  }

  checkLoginStatus(url: string): void {
    console.log('Current Route:', url);
    this.isLoginPage = url === '/login';
    if (url === '/user' || url === '/admin') {
      this.isLoggedIn = true;
      this.showLogoutButton = true;
      this.updateTime();
    } else {
      this.isLoggedIn = false;
      this.showLogoutButton = false;
    }
    console.log('Is Login Page:', this.isLoginPage);
  }

  updateGreeting(): void {
    let greetingKey = '';
    if (this.time < 12) {
      greetingKey = 'GOOD MORNING';
    } else if (this.time < 16) {
      greetingKey = 'GOOD AFTERNOON';
    } else {
      greetingKey = 'GOOD EVENING';
    }

    this.greeting = greetingKey;
    this.shared.setWelcome(greetingKey);
  }

  updateTime(): void {
    setInterval(() => {
      this.currentDateTime = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
    }, 1000);
  }

  changeLanguage(event: Event): void {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.translate.use(selectedLanguage);
    this.updateGreeting();
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
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }
}
