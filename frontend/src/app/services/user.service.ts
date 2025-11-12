import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  nick: string;
  name: string;
  surname: string;
  role: number;
  id_company?: number;
  company_name?: string;
  company_display?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserData {
  nick: string;
  password: string;
  name: string;
  surname: string;
  role: number;
  creatorId?: number;
  company_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(requesterId?: number): Observable<User[]> {
    let url = this.apiUrl;
    if (requesterId) {
      url += `?requesterId=${requesterId}`;
    }
    return this.http.get<User[]>(url, { headers: this.getHeaders() });
  }

  getUsersByRole(role: number, requesterId?: number): Observable<User[]> {
    let url = `${this.apiUrl}/role/${role}`;
    if (requesterId) {
      url += `?requesterId=${requesterId}`;
    }
    return this.http.get<User[]>(url, { headers: this.getHeaders() });
  }

  createUser(userData: CreateUserData): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData, { headers: this.getHeaders() });
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
