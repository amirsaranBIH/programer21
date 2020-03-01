import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class UserGuardService implements CanActivate {

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.auth.userData.id !== parseInt(route.params.user_id, 10)) {
      this.toastr.error('You don\'t have permission to visit that page', 'Error');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
