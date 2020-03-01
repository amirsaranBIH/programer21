import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  public userData = null;
  private localStorageTokenName = 'PROGRAMER21_JWT';

  constructor(private http: HttpClient) {}

  private setJwtToken(token) {
    localStorage.setItem(this.localStorageTokenName, token);
  }

  public removeJwtToken() {
    localStorage.removeItem(this.localStorageTokenName);
  }

  public get getAuthorizationHeader() {
    const token = localStorage.getItem(this.localStorageTokenName);

    return token ? { Authorization: `Bearer ${token}` } : null;
  }

  public fetchUserData() {
    const token = this.getAuthorizationHeader;

    if (token) {
      return new Promise((resolve, reject) => {
        this.http.get('/api/auth/getCurrentUser', { headers: token }).subscribe({
          error: error => {
            if (error.status === 401) {
              console.error(error);
              reject(error);
            }
          },
          next: (res: any) => {
            if (res.status) {
              this.userData = res.data;
            }

            resolve(true);
          }
        });
      });
    } else {
      return null;
    }
  }

  public signup(data): Promise<any> {
    return this.http.post('/api/auth/signup', data)
    .toPromise().then(async (res: any) => {
      if (res.status) {
        this.setJwtToken(res.data.token);
        await this.fetchUserData();
      }

      return res;
    });
  }

  public login(data): Promise<any> {
    return this.http.post('/api/auth/login', data)
    .toPromise().then(async (res: any) => {
      if (res.status) {
        this.setJwtToken(res.data.token);
        await this.fetchUserData();
      }

      return res;
    });
  }

  public async isEmailTaken(email: string): Promise<boolean> {
    return await this.http.post('/api/auth/isEmailTaken', { email })
      .toPromise()
      .then((res: any) => {
        if (res.status) {
          return res.data;
        }
      });
  }

  public async isEmailTakenWhileEditing(userId, email: string): Promise<boolean> {
    return await this.http.post('/api/auth/isEmailTakenWhileEditing/' + userId, { email }, { headers: this.getAuthorizationHeader })
      .toPromise()
      .then((res: any) => {
        if (res.status) {
          return res.data;
        }
      });
  }

  public forgotPassword(email: string) {
    return this.http.post('/api/auth/forgotPassword', { email }).toPromise();
  }

  public newPassword(newPassword, token) {
    return this.http.post('/api/auth/newPassword', { newPassword, token }).toPromise();
  }

  public verifyEmail(token) {
    return this.http.get(`/api/auth/verifyEmail/${token}`).toPromise();
  }
}
