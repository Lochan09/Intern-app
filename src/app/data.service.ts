import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { adminData } from './model/admindata';
import { userdata } from './model/userdata';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/post';
  private apiUrl2 = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addPost(post: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, post);
  }

  updatePost(post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${post.id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);
  }

  addData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl2, data);
  }

  updateData(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl2}/${data.id}`, data);
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl2}/${id}`);
  }

  loadAdminData(): Observable<adminData[]> {
    return this.http.get<adminData[]>(this.apiUrl2);
  }

  loadUserData(): Observable<userdata[]> {
    return this.http.get<userdata[]>(this.apiUrl);
  }
}
