import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  public accountInfoForm: FormGroup;
  public additionalInfoForm: FormGroup;
  public changePasswordForm: FormGroup;
  public nextUsernameChangeAvailableIn = 0;
  public user;
  public unchangedUsername = '';
  public imagePreview = '';
  public languageFromLocal = localStorage.getItem('language');

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorService,
    private route: ActivatedRoute, // this is binded to email validator
    private authService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Programer21 | Update user settings');

    this.user = this.authService.userData;

    this.unchangedUsername = this.user.username;

    this.userService.nextUsernameChangeAvailableIn(this.user.id).then((res: any) => {
      if (res.status) {
        this.nextUsernameChangeAvailableIn = res.data;
      }
    });

    this.accountInfoForm = this.fb.group({
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
        this.validators.CanChangeUsername.bind(this)
      ]],
      email: [this.user.email, [
        Validators.required,
        this.validators.EmailValidator,
        Validators.maxLength(100),
      ], [this.validators.IsEmailTakenWhileEditing.bind(this)]],
      image: [this.user.image, [Validators.required]]
    });

    this.additionalInfoForm = this.fb.group({
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

    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  }

  onSubmitAccountInfo() {
    if (this.accountInfoForm.invalid) {
      return false;
    }

    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image.value);
    }
    // tslint:disable-next-line: forin
    for (const key in this.accountInfoForm.value) {
      fd.append(key, this.accountInfoForm.value[key]);
    }

    this.userService.updateUserAccountInfo(this.user.id, fd).subscribe({
      error: (err) => console.error(err),
      next: (res: any) => {
        if (res.status) {
          this.authService.fetchUserData();
          this.toastr.success('Successfully updated account information!', 'Success');
        }
      }
    });
  }

  onSubmitAdditionalInfo(value) {
    this.userService.updateUserAdditionalInfo(this.user.id, value).subscribe({
      error: (err) => console.error(err),
      complete: () => {
        this.authService.fetchUserData();
        this.toastr.success('Successfully updated additional information!', 'Success');
      }
    });
  }

  onSubmitChangePassword(value) {
    this.userService.updateUserPassword(this.user.id, value).subscribe({
      error: (err) => console.error(err),
      next: (res: any) => {
        if (res.status) {
          this.authService.fetchUserData();
          this.toastr.success('Successfully changed password!', 'Success');
        } else {
          this.password.setErrors({ wrongPassword: true });
        }
      }
    });
  }

  canChangeUsernameIn() {
    if (this.nextUsernameChangeAvailableIn > 0) {
      if (this.nextUsernameChangeAvailableIn === 1) {
        return '1 day';
      } else {
        return this.nextUsernameChangeAvailableIn + ' days';
      }
    } else {
      return 'NOW!';
    }
  }
}
