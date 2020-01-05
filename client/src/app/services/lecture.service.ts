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

  getLectureBySlug(slug) {
    return this.http.get(`/api/lecture/get-lecture-by-slug/${slug}`);
  }

  getLectureHTMLContentBySlug(slug) {
    return this.http.get(`/api/lecture/get-lecture-html-content-by-slug/${slug}`);
  }

  createLecture(moduleId, data) {
    return this.http.post(`/api/lecture/new/${moduleId}`, data,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  editLecture(lectureId, data) {
    return this.http.post(`/api/lecture/edit/${lectureId}`, data,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  deleteLecture(lectureId) {
    return this.http.get(`/api/lecture/delete/${lectureId}`,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  skipLecture(courseIndex, nextModuleIndex, nextLectureIndex) {
    return this.http.get(`/api/lecture/skip/${courseIndex}/${nextModuleIndex}/${nextLectureIndex}`,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  finishLecture(courseIndex, nextModuleIndex, nextLectureIndex) {
    return this.http.get(`/api/lecture/finish/${courseIndex}/${nextModuleIndex}/${nextLectureIndex}`,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }
}
