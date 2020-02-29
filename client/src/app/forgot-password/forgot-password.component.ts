import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorService,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.maxLength(100),
        this.validators.EmailValidator
      ]],
    });
}

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).then((res: any) => {
        this.router.navigate(['/']);
        if (res.status) {
          this.toastr.success('Successfully sent instructions for reseting password', 'Success');
        } else {
          this.toastr.error(res.message, 'Error');
        }
      });
    }
  }
}
