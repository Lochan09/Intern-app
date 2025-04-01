import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private message: string = '';
  private welcome: string = '';

  setMessage(data: string) {
    this.message = data;
  }

  getMessage() {
    return this.message;
  }

  setWelcome(data: string) {
    this.welcome = data;
  }

  getWelcome() {
    return this.welcome;
  }
}
