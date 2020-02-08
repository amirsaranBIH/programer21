
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEnrolledCoursesResolverService implements Resolve<any> {

  constructor(private userService: UserService, private authService: AuthenticationService) { }

  resolve() {
    console.log(this.authService.userData);
    return this.userService.getUserEnrolledCourses(this.authService.userData.id).then((res: any) => res.data);
  }

}
