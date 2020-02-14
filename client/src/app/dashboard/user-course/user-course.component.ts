import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-user-course',
  templateUrl: './user-course.component.html',
  styleUrls: ['./user-course.component.scss']
})
export class UserCourseComponent implements OnInit {
  public courseLectures = [];
  public course;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;
    console.log(this.course);
  }

  lectureShowMore(lecture) {
    lecture.showMore = !lecture.showMore;
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  startNextLecture() {
    this.router.navigate(['/lecture', this.course.currentLectureSlug]);
  }

  getLectureButtonText(lecture) {
    return lecture.isCurrentLecture && lecture.isUnlocked ? 'Start Lecture' : (lecture.isUnlocked ? 'View Lecture' : 'Not Unlocked');
  }

  getLectureSkipButtonText(lecture) {
    return lecture.skipped ? 'Skipped' : (lecture.skippable ? 'Skip Lecture' : 'Not Skippable');
  }
}
