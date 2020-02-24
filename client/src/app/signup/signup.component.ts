import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService) {}

  ngOnInit() {
    if (this.authService.userData !== null) {
      this.router.navigate(['/']);
    }
  }

}
