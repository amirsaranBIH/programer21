import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(
    private auth: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (!route.data.rolesAccepted.includes(this.auth.userData.role)) {
      this.toastr.error('You must have administrative permissions to visit that page', 'Error');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
