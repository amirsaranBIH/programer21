import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private titleService: Title
    ) {}

  ngOnInit() {
    this.titleService.setTitle('Programer21 | Create an account');

    if (this.authService.userData !== null) {
      this.router.navigate(['/']);
    }
  }

}
