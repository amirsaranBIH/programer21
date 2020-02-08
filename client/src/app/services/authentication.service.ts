import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  public userData = null;

  constructor(private http: HttpClient) {}

  public fetchUserSessionData() {
    return new Promise((resolve, reject) => {
      this.http.get(environment.HOST + '/api/auth/fetchUserSessionData').subscribe({
        error: error => {
          console.error(error);
          reject(error);
        },
        next: (res: any) => {
          this.userData = res.data;
          resolve(true);
        }
      });
    });
  }

  public signup(data): Observable<any> {
    return this.http.post(environment.HOST + '/api/auth/signup', data);
  }

  public login(data): Observable<any> {
    return this.http.post(environment.HOST + '/api/auth/login', data);
  }

  public logout() {
    this.http.get(environment.HOST + '/api/auth/logout').subscribe({
      error: error => console.error(error),
      next: (res: any) => {
        if (res.status) {
          this.userData = null;
          this.fetchUserSessionData();
        }
      }
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
