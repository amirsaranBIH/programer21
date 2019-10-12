import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  _id: string;
  username?: string;
  email?: string;
  verifiedEmail: boolean;
  verifyToken?: string;
  role: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoriesEnrolledIn?: object[];
  categoriesFinished?: object[];
  modulesSkipped?: object[];
  lecturesSkipped?: object[];
  numberOfModulesSkipped?: number;
  numberOfLecturesSkipped?: number;
  lastTimeLoggedIn?: Date;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  username?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('avika-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('avika-token');
    }
    return this.token;
  }

  public get getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
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

  private request(method: 'post'|'get', type: 'login'|'signup'|'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    } else {
      base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
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

  public profile(): Observable<UserDetails> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public async checkIfUsernameIsTaken(username: string) {
    return await this.http.post<boolean>('/api/isUsernameTaken', { username }).toPromise();
  }

  public async checkIfEmailIsTaken(email: string) {
    return await this.http.post<boolean>('/api/isEmailTaken', { email }).toPromise();
  }
}
