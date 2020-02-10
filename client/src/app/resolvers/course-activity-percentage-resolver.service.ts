
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CourseActivityPercentageResolverService implements Resolve<any> {

  constructor(private userService: UserService, private auth: AuthenticationService) { }

  resolve() {
    return this.userService.getCourseActivityPercentages(this.auth.userData.id).then((res: any) => res.data);
  }

}
