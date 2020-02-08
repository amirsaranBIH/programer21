import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getAllPublicCourses() {
    return this.http.get('/api/course/getAllPublicCourses').toPromise();
  }

  getAllCourses() {
    return this.http.get('/api/course/getAllCourses').toPromise();
  }

  getCourseById(courseId) {
    return this.http.get(`/api/course/getCourseById/${courseId}`).toPromise();
  }

  getCourseLectures(courseId) {
    return this.http.get(`/api/course/getCourseLectures/${courseId}`).toPromise();
  }

  getCourseBySlug(slug) {
    return this.http.get(`/api/course/get-course-by-slug/${slug}`);
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
