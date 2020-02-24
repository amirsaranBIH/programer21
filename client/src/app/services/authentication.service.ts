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
        this.http.get(environment.HOST + '/api/auth/getCurrentUser', { headers: token }).subscribe({
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

  public signup(data): Observable<any> {
    return this.http.post(environment.HOST + '/api/auth/signup', data);
  }

  public login(data): Promise<any> {
    return this.http.post(environment.HOST + '/api/auth/login', data)
    .toPromise().then(async (res: any) => {
      if (res.status) {
        this.setJwtToken(res.data.token);
        await this.fetchUserData();
      }

      return res;
    });
  }

  public async isEmailTaken(email: string): Promise<boolean> {
    return await this.http.post(environment.HOST + '/api/auth/isEmailTaken', { email })
      .toPromise()
      .then((res: any) => {
        if (res.status) {
          return res.data;
        }
      });
  }

  public async isEmailTakenWhileEditing(userId, email: string): Promise<boolean> {
    return await this.http.post(environment.HOST + '/api/auth/isEmailTakenWhileEditing/' + userId, { email })
      .toPromise()
      .then((res: any) => {
        if (res.status) {
          return res.data;
        }
      });
  }
}
