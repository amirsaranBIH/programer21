import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {
  public course;
  public image: File;
  public editCourseForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private titleToSlug: TitleToSlugPipe
    ) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;

    this.editCourseForm = this.fb.group({
      title: [this.course.title, [Validators.required]],
      description: [this.course.description, [Validators.required]],
      difficulty: [this.course.difficulty, [Validators.required]],
      status: [this.course.status, [Validators.required]],
      image: [this.course.image]
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

  onSubmit() {
    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image);
    }
    // tslint:disable-next-line: forin
    for (const key in this.editCourseForm.value) {
      if (key !== 'image') {
        fd.append(key, this.editCourseForm.value[key]);
      }
    }

    fd.append('slug', this.titleToSlug.transform(this.editCourseForm.value.title));

    this.courseService.editCourse(this.route.snapshot.params.course_id, fd).subscribe({
      error: (err) => console.log(err),
      complete: () => this.router.navigate(['/admin-panel'])
    });
  }

  onFileUpload(file) {
    this.image = file;
  }
}
