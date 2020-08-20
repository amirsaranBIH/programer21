import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  public signupForm: FormGroup;

  @Input() buttonText = 'Create Account';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private validators: ValidatorService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
        this.validators.NameValidator
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
        this.validators.NameValidator
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
        this.validators.UsernameValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(100),
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenValidator]],
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

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
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

  onSubmit(data) {
    if (this.signupForm.valid) {
      this.authService.signup(data).then((res: any) => {
        if (res.status) {
          this.toastr.success('Successfully created account', 'Success');
          this.authService.fetchUserData().then(() => {
            this.router.navigate(['/dashboard']);
          });
        }
      });
    }
  }
}
