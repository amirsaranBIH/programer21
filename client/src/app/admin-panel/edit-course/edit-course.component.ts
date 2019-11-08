import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {
  public course;
  public editCourseForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private courseService: CourseService, private router: Router) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;

    this.editCourseForm = this.fb.group({
      title: [this.course.title, [Validators.required]],
      description: [this.course.description, [Validators.required]],
      difficulty: [this.course.difficulty, [Validators.required]],
      status: [this.course.status, [Validators.required]],
      thumbnail: [this.course.thumbnail]
    });
  }

  get title() {
    return this.editCourseForm.get('title');
  }

  get description() {
    return this.editCourseForm.get('description');
  }

  get difficulty() {
    return this.editCourseForm.get('difficulty');
  }

  get status() {
    return this.editCourseForm.get('status');
  }

  onSubmit(value) {
    this.courseService.editCourse(this.route.snapshot.params.course_id, value).subscribe({
      error: (err) => console.log(err),
      complete: () => this.router.navigate(['/admin-panel'])
    });
  }

}
