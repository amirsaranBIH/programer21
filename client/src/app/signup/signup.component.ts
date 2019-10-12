import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../validator.service';

@Component({
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: any;

  constructor(private authService: AuthenticationService, private router: Router, private fb: FormBuilder, private validators: ValidatorService) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ], [this.validators.IsUsernameTakenValidator.bind(this)]],
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenValidator.bind(this)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validators.PasswordValidator
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
        validator: this.validators.ConfirmPasswordValidator
      });
  }

  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  onSubmit(credentials: TokenPayload) {
    this.authService.signup(credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });
  }
}
