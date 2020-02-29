import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate() {
    if (!this.auth.userData) {
      this.toastr.error('You need to be logged in to access that page', 'Error');
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
