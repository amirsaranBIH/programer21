import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public editUserForm: FormGroup;
  public user;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorService,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;

    this.editUserForm = this.fb.group({
      id: this.user.id,
      firstName: [this.user.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
        this.validators.NameValidator
      ]],
      lastName: [this.user.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
        this.validators.NameValidator
      ]],
      username: [this.user.username, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]],
      role: [this.user.role, [
        Validators.required,
        Validators.pattern('(user|administrator|moderator)')
      ]],
      emailVerified: [this.user.verified, [
        Validators.required,
        Validators.pattern('(1|0)')
      ]],
      email: [this.user.email, [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenWhileEditing.bind(this)]],
      description: [this.user.description, [
        Validators.maxLength(200),
      ]],
      city: [this.user.city, [
        Validators.maxLength(50),
      ]],
      gender: [this.user.gender, [
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

  onSubmit(value) {
    this.userService.updateUser(this.route.snapshot.params.user_id, value).subscribe({
      error: (err) => console.log(err)
    });
  }

  suspendUser() {
    this.userService.suspendUser(this.route.snapshot.params.user_id).subscribe({
      error: (err) => console.log(err),
      complete: () => this.user.suspended = this.user.suspended === 1 ? 0 : 1
    });
  }
}
