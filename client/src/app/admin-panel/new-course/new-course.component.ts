import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {
  public courseForm: FormGroup;

  constructor(private fb: FormBuilder, private courseService: CourseService, private router: Router) { }

  ngOnInit() {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      thumbnail: ['']
    });
  }

  get title() {
    return this.courseForm.get('title');
  }

  get description() {
    return this.courseForm.get('description');
  }

  onSubmit(value) {
    this.courseService.createCourse(value).subscribe({
      error: (err) => console.log(err),
      complete: () => this.router.navigate(['admin-panel'])
    });
  }
}
