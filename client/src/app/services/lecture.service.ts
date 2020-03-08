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

  finishLecture(lectureId, finishedLectureCourseId) {
    return this.http.get(`/api/lecture/finishLecture/${lectureId}/${finishedLectureCourseId}`).toPromise();
  }

  getLectureQuizQuestionById(lectureId) {
    return this.http.get(`/api/lecture/getLectureQuizQuestionById/${lectureId}`).toPromise();
  }

  getLectureQuizQuestionBySlug(lectureSlug) {
    return this.http.get(`/api/lecture/getLectureQuizQuestionBySlug/${lectureSlug}`).toPromise();
  }

  verifyQuizAnswers(lectureSlug, quizAnswers) {
    return this.http.post(`/api/lecture/verifyQuizAnswers/${lectureSlug}`, quizAnswers).toPromise();
  }
}
