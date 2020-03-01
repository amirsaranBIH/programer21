import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../services/course.service';

@Injectable()
export class UserCourseGuardService implements CanActivate {

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private courseService: CourseService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    const res = await this.courseService.getCourseIdBySlug(route.params.course_slug);
    if (!this.auth.userData.coursesEnrolledIn.includes(res.data)) {
      this.toastr.error('You must enroll in that course to visit that page', 'Error');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
