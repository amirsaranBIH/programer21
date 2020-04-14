import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

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
    private userService: UserService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;

    this.titleService.setTitle('Programer21 | ' + this.course.title);
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
        this.userService.enrollUserInCourse(this.authService.userData.id, this.course.id).then((res: any) => {
          if (res.status) {
            this.toastr.success('Successfully enroll in course: ' + this.course.title);
            this.authService.fetchUserData();
            this.router.navigate(['dashboard', 'course', this.course.slug]);
          }
        });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
