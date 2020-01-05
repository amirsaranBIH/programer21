import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  verified_email: boolean;
  verify_token?: string;
  role: string;
  picture?: string;
  updated_at?: Date;
  coursesEnrolledIn?: any[];
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('programer21-token', token);
    this.token = token;
  }

  public get getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('programer21-token');
    }
    return this.token;
  }

  public get getUserDetails(): UserDetails {
    const token = this.getToken;
    let payload;
    if (token) {
      payload = token.split('.')[1];

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      payload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      // payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails;
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'signup'|'dashboard', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    } else {
      base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken}` }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public signup(user: TokenPayload): Observable<any> {
    return this.request('post', 'signup', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public dashboard(): Observable<UserDetails> {
    return this.request('get', 'dashboard');
  }

  public logout(): void {
    this.token = '';
    localStorage.removeItem('programer21-token');
    this.router.navigateByUrl('/');
  }

  public async checkIfEmailIsTaken(email: string) {
    return await this.http.post<boolean>('/api/isEmailTaken', { email }).toPromise();
  }
}
