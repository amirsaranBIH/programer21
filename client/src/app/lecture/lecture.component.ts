import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureService } from '../services/lecture.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {
  public lecture;
  public quizQuestions = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lectureService: LectureService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.lecture = this.route.snapshot.data.lecture;

    this.titleService.setTitle('Programer21 | ' + this.lecture.title);

    this.lectureService.getLectureQuizQuestionBySlug(this.lecture.slug).then((res: any) => {
      if (res.status) {
        this.quizQuestions = res.data;
      }
    });
  }

  verifyQuizQuestions() {
    this.lectureService.verifyQuizAnswers(this.lecture.slug, this.quizQuestions).then((res: any) => {
      if (res.status) {
        this.quizQuestions = res.data;
      }
    });
  }

  finishLecture() {
    this.lectureService.finishLecture(this.lecture.id, this.lecture.course).then(async (res: any) => {
      if (res.status && res.data === -1) {
        this.router.navigate(['/dashboard']);
      } else if (res.status) {
        this.router.navigate(['/lecture', res.data]);
        this.lecture = await this.lectureService.getLectureBySlug(res.data).then((lectureRes: any) => lectureRes.data);
        this.quizQuestions = await this.lectureService.getLectureQuizQuestionBySlug(res.data).then((questionRes: any) => questionRes.data);
      } else {

      }
    });
  }

  answeredQuestion(question) {
    delete question.wrongAnswer;
  }
}
