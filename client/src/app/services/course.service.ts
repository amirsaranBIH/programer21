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
    return this.http.get('/api/course/getAllCourses').toPromise();
  }

  getCourseById(courseId) {
    return this.http.get(`/api/course/getCourseById/${courseId}`).toPromise();
  }

  getCourseBySlug(courseSlug) {
    return this.http.get(`/api/course/getCourseBySlug/${courseSlug}`).toPromise();
  }

  getCourseIdBySlug(courseSlug): Promise<any> {
    return this.http.get(`/api/course/getCourseIdBySlug/${courseSlug}`).toPromise();
  }

  getCourseLectures(courseId) {
    return this.http.get(`/api/course/getCourseLectures/${courseId}`).toPromise();
  }

  createCourse(data) {
    return this.http.post('/api/course/createCourse', data);
  }

  updateCourse(courseId, data) {
    return this.http.post(`/api/course/updateCourse/${courseId}`, data);
  }

  deleteCourse(courseId) {
    return this.http.get(`/api/course/deleteCourse/${courseId}`);
  }

  enrollInCourse(courseId) {
    return this.http.get(`/api/course/enroll/${courseId}`);
  }
}
