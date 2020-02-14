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
    return this.http.get(`/api/lecture/getLectureBySlug/${slug}`).toPromise();
  }

  getLectureHtmlBySlug(slug) {
    return this.http.get(`/api/lecture/getLectureHtmlBySlug/${slug}`).toPromise();
  }

  getLectureHTMLContentBySlug(slug) {
    return this.http.get(`/api/lecture/get-lecture-html-content-by-slug/${slug}`);
  }

  createLecture(courseId, data) {
    return this.http.post(`/api/lecture/createLecture/${courseId}`, data, { headers: this.auth.getAuthorizationHeader });
  }

  editLecture(lectureId, data) {
    return this.http.post(`/api/lecture/updateLecture/${lectureId}`, data, { headers: this.auth.getAuthorizationHeader });
  }

  deleteLecture(lectureId) {
    return this.http.get(`/api/lecture/deleteLecture/${lectureId}`, { headers: this.auth.getAuthorizationHeader });
  }

  skipLecture(courseIndex, nextModuleIndex, nextLectureIndex) {
    return this.http.get(`/api/lecture/skip/${courseIndex}/${nextModuleIndex}/${nextLectureIndex}`);
  }

  finishLecture(finishedLectureCourseId) {
    return this.http.get(`/api/lecture/finishLecture/${finishedLectureCourseId}`);
  }
}
