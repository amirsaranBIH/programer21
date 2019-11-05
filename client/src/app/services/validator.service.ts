import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor(private authService: AuthenticationService) { }

  async IsEmailTakenValidator(control: AbstractControl) {
    const email = control.value;
    const isEmailTaken = await this.authService.checkIfEmailIsTaken(email);

    return isEmailTaken ? { emailTaken: true } : null;
  }

  async IsEmailInUseValidator(control: AbstractControl) {
    const email = control.value;
    const isEmailInUse = await this.authService.checkIfEmailIsTaken(email);

    return !isEmailInUse ? { emailNotInUse: true } : null;
  }

  NameValidator(control: AbstractControl) {
    const VALID_NAME_REGEX = /^[a-zA-Z]+$/;

    const isValidName = VALID_NAME_REGEX.test(control.value);

    if (!isValidName) {
      return { nameNotValid: true };
    } else {
      return null;
    }
  }

  EmailValidator(control: AbstractControl) {
    // tslint:disable-next-line: max-line-length
    const VALID_EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = VALID_EMAIL_REGEX.test(control.value);

    return isValid ? null : { notValidEmail: true };
  }

  PasswordValidator(control: AbstractControl) {
    const VALID_PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}/;
    const isValid = VALID_PASSWORD_REGEX.test(control.value);

    return isValid ? null : { notValidPassword: true };
  }

  ConfirmPasswordValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password.pristine || confirmPassword.pristine) {
      return null;
    }

    if (password && confirmPassword && (password.value !== confirmPassword.value)) {
      return { passwordsNotMatching: true };
    }
  }
}
