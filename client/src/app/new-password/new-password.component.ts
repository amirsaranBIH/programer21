import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  public newPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get password() {
    return this.newPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }
}
