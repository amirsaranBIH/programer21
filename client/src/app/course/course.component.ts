import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public course;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private userService: UserService
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

  userIsEnrolledInCourse() {
    return this.authService.userData.coursesEnrolledIn.includes(this.course.id);
  }

  enrollUserInCourse() {
    if (!this.userIsEnrolledInCourse()) {
      this.userService.enrollUserInCourse(this.authService.userData.id, this.course.id);
    }
  }
}
