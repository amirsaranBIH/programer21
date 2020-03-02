import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private toastr: ToastrService
  ) { }


  getUserEnrolledCourses(userId) {
    return this.http.get('/api/user/getUserEnrolledCourses/' + userId).toPromise();
  }

  getAllUsers() {
    return this.http.get('/api/user/getAllUsers').toPromise();
  }

  getUserById(userId) {
    return this.http.get('/api/user/getUserById/' + userId).toPromise();
  }

  updateUser(userId, userData) {
    return this.http.post('/api/user/updateUser/' + userId, userData);
  }

  updateUserAccountInfo(userId, userData) {
    return this.http.post('/api/user/updateUserAccountInfo/' + userId, userData);
  }

  updateUserAdditionalInfo(userId, userData) {
    return this.http.post('/api/user/updateUserAdditionalInfo/' + userId, userData);
  }

  updateUserPassword(userId, userData) {
    return this.http.post('/api/user/updateUserPassword/' + userId, userData);
  }

  suspendUser(userId) {
    return this.http.get('/api/user/suspendUser/' + userId);
  }

  getUserCourseBySlug(courseSlug) {
    return this.http.get(`/api/user/getUserCourseBySlug/${courseSlug}/${this.auth.userData.id}`).toPromise();
  }

  getCourseActivityPercentages(userId) {
    return this.http.get('/api/user/getCourseActivityPercentages/' + userId).toPromise();
  }

  getAllLatestLecturesByUserId(userId) {
    return this.http.get('/api/user/getAllLatestLecturesByUserId/' + userId).toPromise();
  }

  getMonthlyActivity(userId) {
    return this.http.get('/api/user/getMonthlyActivity/' + userId).toPromise();
  }

  nextUsernameChangeAvailableIn(userId) {
    return this.http.get('/api/user/nextUsernameChangeAvailableIn/' + userId).toPromise();
  }

  enrollUserInCourse(userId, courseId) {
    return this.http.get('/api/user/enrollUserInCourse/' + userId + '/' + courseId).toPromise();
  }
}
