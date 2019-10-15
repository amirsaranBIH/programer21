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
      first_name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]],
      last_name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]],
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

  get first_name() {
    return this.signupForm.get('first_name');
  }

  get last_name() {
    return this.signupForm.get('last_name');
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
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      console.error(err);
    });
  }
}
