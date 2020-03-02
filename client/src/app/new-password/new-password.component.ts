import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  public newPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private validators: ValidatorService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.newPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validators.PasswordValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      token: [this.route.snapshot.params.token]
    }, {
      validator: this.validators.ConfirmPasswordValidator
    });
  }

  get password() {
    return this.newPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.newPasswordForm.valid) {
      this.authService.newPassword(this.newPasswordForm.value.password, this.newPasswordForm.value.token).then((res: any) => {
        if (res.status) {
          this.toastr.success('Password successfully reset', 'Success');
          this.router.navigate(['login']);
        }
      });
    }
  }
}
