import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';
import { TokenPayload, AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public selectedQuestion = 0;
  public questionsAndAnswers = [];
  public quickSignupForm: FormGroup;
  public courses;

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorService,
    private authService: AuthenticationService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courses = this.route.snapshot.data.courses;

    this.questionsAndAnswers = [
      {
        question: 'Question 1',
        answer: 'Answer 1'
      },
      {
        question: 'Question 2',
        answer: 'Answer 2'
      },
      {
        question: 'Question 3',
        answer: 'Answer 3'
      },
      {
        question: 'Question 4',
        answer: 'Answer 4'
      },
      {
        question: 'Question 5',
        answer: 'Answer 5'
      },
      {
        question: 'Question 6',
        answer: 'Answer 6'
      },
      {
        question: 'Question 7',
        answer: 'Answer 7'
      }
    ];

    this.quickSignupForm = this.fb.group({
      first_name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]],
      last_name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]],
      email: ['', [
        Validators.required,
        this.validators.EmailValidator
      ], [this.validators.IsEmailTakenValidator.bind(this)]],
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

  get first_name() {
    return this.quickSignupForm.get('first_name');
  }

  get last_name() {
    return this.quickSignupForm.get('last_name');
  }

  get email() {
    return this.quickSignupForm.get('email');
  }

  get password() {
    return this.quickSignupForm.get('password');
  }

  get confirmPassword() {
    return this.quickSignupForm.get('confirmPassword');
  }

  onSubmit(credentials: TokenPayload) {
    this.authService.signup(credentials).subscribe(() => {
      this.router.navigate(['/dashboard']);
    }, (err) => {
      console.error(err);
    });
  }

  changeSelectedQuestion(index) {
    this.selectedQuestion = index;
  }

  enrollInCourse(courseId) {
    this.courseService.enrollInCourse(courseId).subscribe({
      error: err => console.error(err),
      complete: () => this.router.navigate(['/dashboard'])
    });
  }
}
