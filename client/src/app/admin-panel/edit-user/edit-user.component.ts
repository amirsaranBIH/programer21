import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public editUserForm: FormGroup;

  constructor(private fb: FormBuilder, private validators: ValidatorService) { }

  ngOnInit() {
    this.editUserForm = this.fb.group({
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
      role: ['user', [
        Validators.required,
        Validators.pattern('(user|administrator|moderator)')
      ]],
      emailVerified: [false, [
        Validators.required,
        Validators.pattern('(true|false)')
      ]],
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenValidator.bind(this)]],
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
  }

  get firstName() {
    return this.editUserForm.get('firstName');
  }

  get lastName() {
    return this.editUserForm.get('lastName');
  }

  get username() {
    return this.editUserForm.get('username');
  }

  get email() {
    return this.editUserForm.get('email');
  }

  get role() {
    return this.editUserForm.get('role');
  }

  get emailVerified() {
    return this.editUserForm.get('emailVerified');
  }

  get description() {
    return this.editUserForm.get('description');
  }

  get city() {
    return this.editUserForm.get('city');
  }

  get gender() {
    return this.editUserForm.get('gender');
  }

}
