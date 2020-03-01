
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class VerifyEmailResolverService implements Resolve<any> {

  constructor(private authService: AuthenticationService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.authService.verifyEmail(route.params.token).then((res: any) => res.status);
  }

}
