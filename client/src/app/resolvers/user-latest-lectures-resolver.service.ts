
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Injectable()
export class UserLatestLecturesResolverService implements Resolve<any> {

  constructor(private userService: UserService, private authService: AuthenticationService) { }

  resolve() {
    return this.userService.getAllLatestLecturesByUserId(this.authService.userData.id).then((res: any) => res.data);
  }

}
