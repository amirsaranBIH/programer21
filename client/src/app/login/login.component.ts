import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../validator.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public loginForm: any;
  public submitted = false;

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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(credentials: TokenPayload) {
    this.submitted = true;
    this.authService.login(credentials).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      console.error(err);
    });
  }
}
