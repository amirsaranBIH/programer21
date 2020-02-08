import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private validators: ValidatorService) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailInUseValidator.bind(this)]],
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

}
