import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getAllPublicCourses() {
    return this.http.get('/api/course/getAllPublicCourses').toPromise();
  }

  getAllCourses() {
    return this.http.get('/api/course/getAllCourses', { headers: this.auth.getAuthorizationHeader }).toPromise();
  }

  getCourseById(courseId) {
    return this.http.get(`/api/course/getCourseById/${courseId}`).toPromise();
  }

  getCourseLectures(courseId) {
    return this.http.get(`/api/course/getCourseLectures/${courseId}`).toPromise();
  }

  createCourse(data) {
    return this.http.post('/api/course/createCourse', data, { headers: this.auth.getAuthorizationHeader });
  }

  updateCourse(courseId, data) {
    return this.http.post(`/api/course/updateCourse/${courseId}`, data, { headers: this.auth.getAuthorizationHeader });
  }

  deleteCourse(courseId) {
    return this.http.get(`/api/course/deleteCourse/${courseId}`, { headers: this.auth.getAuthorizationHeader });
  }

  enrollInCourse(courseId) {
    return this.http.get(`/api/course/enroll/${courseId}`, { headers: this.auth.getAuthorizationHeader });
  }
}
