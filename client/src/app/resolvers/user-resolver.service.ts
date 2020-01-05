
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class UserResolverService implements Resolve<any> {

  constructor(private auth: AuthenticationService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.auth.dashboard();
  }

}
