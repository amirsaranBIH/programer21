import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

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
    private validators: ValidatorService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailInUseValidator.bind(this)]],
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
      this.authService.login(credentials).subscribe({
        error: error => console.error(error),
        next: (res: any) => {
          if (res.status) {
            if (res.data) {
              this.authService.fetchUserSessionData().then(() => {
                this.router.navigate(['dashboard']);
              });
            } else {
              if (!this.email.hasError('required') &&
                  !this.email.hasError('notValidEmail') &&
                  !this.email.hasError('emailNotInUse')) {
                this.password.setErrors({ wrongPassword: true });
              }
            }
          }
        }
      });
    }
  }
}
