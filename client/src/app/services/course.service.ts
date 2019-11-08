import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAllCourses() {
    return this.http.get('/api/course/get-all-courses');
  }

  getCourseById(courseId) {
    return this.http.get(`/api/course/get-course/${courseId}`);
  }

  createCourse(data) {
    return this.http.post('/api/course/new', data, { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  editCourse(courseId, data) {
    return this.http.post(`/api/course/edit/${courseId}`, data,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }
}
