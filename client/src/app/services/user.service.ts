import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getUserEnrolledCourses(userId) {
    return this.http.get(environment.HOST + '/api/user/getUserEnrolledCourses/' + userId).toPromise();
  }

  getAllUsers() {
    return this.http.get(environment.HOST + '/api/user/getAllUsers', { headers: this.auth.getAuthorizationHeader }).toPromise();
  }

  getUserById(userId) {
    return this.http.get(environment.HOST + '/api/user/getUserById/' + userId, { headers: this.auth.getAuthorizationHeader }).toPromise();
  }

  updateUser(userId, userData) {
    return this.http.post(environment.HOST + '/api/user/updateUser/' + userId, userData, { headers: this.auth.getAuthorizationHeader });
  }

  suspendUser(userId) {
    return this.http.get(environment.HOST + '/api/user/suspendUser/' + userId, { headers: this.auth.getAuthorizationHeader });
  }
}
