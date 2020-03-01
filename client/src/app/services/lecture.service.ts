import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getAllLectures() {
    return this.http.get('/api/lecture/get-all-lectures', { headers: this.auth.getAuthorizationHeader });
  }

  getLectureById(lectureId) {
    return this.http.get(`/api/lecture/getLectureById/${lectureId}`, { headers: this.auth.getAuthorizationHeader }).toPromise();
  }

  getLectureBySlug(slug) {
    return this.http.get(`/api/lecture/getLectureBySlug/${slug}`, { headers: this.auth.getAuthorizationHeader }).toPromise();
  }

  getLectureHtmlBySlug(slug) {
    return this.http.get(`/api/lecture/getLectureHtmlBySlug/${slug}`, { headers: this.auth.getAuthorizationHeader }).toPromise();
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
    return this.http.get(`/api/lecture/skip/${courseIndex}/${nextModuleIndex}/${nextLectureIndex}`,
    { headers: this.auth.getAuthorizationHeader });
  }

  finishLecture(lectureId, finishedLectureCourseId) {
    return this.http.get(`/api/lecture/finishLecture/${lectureId}/${finishedLectureCourseId}`,
    { headers: this.auth.getAuthorizationHeader }).toPromise();
  }
}
