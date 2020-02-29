import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoggedOutGuardService implements CanActivate {

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate() {
    if (this.auth.userData) {
      this.toastr.error('You must not be logged in to access that page', 'Error');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
