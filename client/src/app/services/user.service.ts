import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserEnrolledCourses(userId) {
    return this.http.get(environment.HOST + '/api/user/getUserEnrolledCourses/' + userId).toPromise();
  }

  getAllUsers() {
    return this.http.get(environment.HOST + '/api/user/getAllUsers').toPromise();
  }

  getUserById(userId) {
    return this.http.get(environment.HOST + '/api/user/getUserById/' + userId).toPromise();
  }

  updateUser(userId, userData) {
    return this.http.post(environment.HOST + '/api/user/updateUser/' + userId, userData);
  }
  
  suspendUser(userId) {
    return this.http.get(environment.HOST + '/api/user/suspendUser/' + userId);
  }
}
