import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../validator.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(private authService: AuthenticationService, private router: Router, private fb: FormBuilder, private validators: ValidatorService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenValidator.bind(this)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  getControl(control) {
    return this.loginForm.controls[control];
  }

  onSubmit(credentials: TokenPayload) {
    this.authService.login(credentials).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      console.error(err);
    });
  }
}
