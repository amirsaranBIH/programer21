import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private validators: ValidatorService,
    private toastr: ToastrService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Programer21 | Log into your account');

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.maxLength(100),
        this.validators.EmailValidator
      ]],
      password: ['', [Validators.required]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(credentials) {
    if (this.loginForm.valid) {
      this.authService.login(credentials).then((res: any) => {
        if (res.status) {
          this.toastr.success('Successfully logged in into your account', 'Success');
          this.router.navigate(['dashboard']);
        } else {
          if (!this.email.hasError('required') &&
              !this.email.hasError('notValidEmail') &&
              !this.email.hasError('emailNotInUse')) {
            this.password.setErrors({ wrongPassword: true });
          }
        }
      });
    }
  }
}
