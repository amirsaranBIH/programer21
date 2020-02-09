import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getAllLectures() {
    return this.http.get('/api/lecture/get-all-lectures');
  }

  getLectureById(lectureId) {
    return this.http.get(`/api/lecture/getLectureById/${lectureId}`).toPromise();
  }

  getLectureBySlug(slug) {
    return this.http.get(`/api/lecture/get-lecture-by-slug/${slug}`);
  }

  getLectureHTMLContentBySlug(slug) {
    return this.http.get(`/api/lecture/get-lecture-html-content-by-slug/${slug}`);
  }

  createLecture(courseId, data) {
    return this.http.post(`/api/lecture/createLecture/${courseId}`, data);
  }

  editLecture(lectureId, data) {
    return this.http.post(`/api/lecture/updateLecture/${lectureId}`, data);
  }

  deleteLecture(lectureId) {
    return this.http.get(`/api/lecture/deleteLecture/${lectureId}`);
  }

  skipLecture(courseIndex, nextModuleIndex, nextLectureIndex) {
    return this.http.get(`/api/lecture/skip/${courseIndex}/${nextModuleIndex}/${nextLectureIndex}`);
  }

  finishLecture(courseIndex, nextModuleIndex, nextLectureIndex) {
    return this.http.get(`/api/lecture/finish/${courseIndex}/${nextModuleIndex}/${nextLectureIndex}`);
  }
}
