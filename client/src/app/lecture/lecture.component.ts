import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private lectureService: LectureService
  ) { }

  ngOnInit() {
    this.lecture = this.route.snapshot.data.lecture;
    this.htmlContent = this.route.snapshot.data.html_content;
  }

  finishLecture() {
    this.lectureService.finishLecture(this.lecture.id, this.lecture.course).then(async (res: any) => {
      if (res.status && res.data === -1) {
        this.router.navigate(['/dashboard']);
      } else if (res.status) {
        this.router.navigate(['/lecture', res.data]);
        this.lecture = await this.lectureService.getLectureBySlug(res.data).then((lectureRes: any) => lectureRes.data);
        this.htmlContent = await this.lectureService.getLectureHtmlBySlug(res.data).then((htmlRes: any) => htmlRes.data);
      } else {

      }
    });
  }
}
