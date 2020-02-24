import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;
  }

  lectureShowMore(lecture) {
    lecture.showMore = !lecture.showMore;
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

  getLectureButtonText(lecture) {
    return lecture.isCurrentLecture
            && lecture.isUnlocked
            && this.course.userCourseStatus === 'learning' ? 'Start Lecture' : (lecture.isUnlocked ? 'View Lecture' : 'Not Unlocked');
  }

  getLectureSkipButtonText(lecture) {
    return lecture.skipped ? 'Skipped' : (lecture.skippable ? 'Skip Lecture' : 'Not Skippable');
  }
}
