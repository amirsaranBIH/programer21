import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public course;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
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
    if (this.authService.userData) {
      return this.authService.userData.coursesEnrolledIn.includes(this.course.id);
    } else {
      return false;
    }
  }

  enrollUserInCourse() {
    if (this.authService.userData) {
      if (!this.userIsEnrolledInCourse()) {
        this.userService.enrollUserInCourse(this.authService.userData.id, this.course.id);
      }
    } else {
      this.toastr.error('You must be logged in to enroll in course', 'Error');
      this.router.navigate(['/login']);
    }
  }
}
