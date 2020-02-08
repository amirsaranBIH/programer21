import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  public accountInfoForm: FormGroup;
  public additionalInfoForm: FormGroup;
  public changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private validators: ValidatorService) { }

  ngOnInit() {
    this.accountInfoForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]],
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenValidator]],
      image: ['', [Validators.required]]
    });

    this.additionalInfoForm = this.fb.group({
      description: ['', [
        Validators.maxLength(200),
      ]],
      city: ['', [
        Validators.maxLength(50),
      ]],
      gender: ['', [
        Validators.pattern('(male|female|other)')
      ]]
    });

    this.changePasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validators.PasswordValidator
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
      validator: this.validators.ConfirmPasswordValidator
    });
  }

  get firstName() {
    return this.accountInfoForm.get('firstName');
  }

  get lastName() {
    return this.accountInfoForm.get('lastName');
  }

  get username() {
    return this.accountInfoForm.get('username');
  }

  get email() {
    return this.accountInfoForm.get('email');
  }

  get image() {
    return this.accountInfoForm.get('image');
  }

  get description() {
    return this.additionalInfoForm.get('description');
  }

  get city() {
    return this.additionalInfoForm.get('city');
  }

  get gender() {
    return this.additionalInfoForm.get('gender');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  uploadFile(e) {
    this.image.patchValue(e.target.files[0]);
  }
}
