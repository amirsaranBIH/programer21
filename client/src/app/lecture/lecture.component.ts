import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LectureService } from '../services/lecture.service';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {
  public lecture;
  public htmlContent;

  constructor(
    private route: ActivatedRoute,
    private lectureService: LectureService
  ) { }

  ngOnInit() {
    this.lecture = this.route.snapshot.data.lecture;
    this.htmlContent = this.route.snapshot.data.html_content;
    console.log(this.lecture);
    console.log(this.htmlContent);
  }

  finishLecture() {
    this.lectureService.finishLecture(this.lecture.course);
  }
}
