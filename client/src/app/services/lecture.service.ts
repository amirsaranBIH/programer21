import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAllLectures() {
    return this.http.get('/api/lecture/get-all-lectures');
  }

  getLectureById(lectureId) {
    return this.http.get(`/api/lecture/get-lecture/${lectureId}`);
  }

  createLecture(moduleId, data) {
    return this.http.post(`/api/lecture/new/${moduleId}`, data,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  editLecture(lectureId, data) {
    return this.http.post(`/api/lecture/edit/${lectureId}`, data,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }
}
