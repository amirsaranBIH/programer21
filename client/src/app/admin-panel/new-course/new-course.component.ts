import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {
  public courseForm: FormGroup;
  public image: File;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private titleToSlug: TitleToSlugPipe
    ) { }

  ngOnInit() {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      difficulty: ['beginner', [Validators.required]],
      status: ['private', [Validators.required]]
    });
  }

  get title() {
    return this.courseForm.get('title');
  }

  get description() {
    return this.courseForm.get('description');
  }

  get difficulty() {
    return this.courseForm.get('difficulty');
  }

  get status() {
    return this.courseForm.get('status');
  }

  onSubmit() {
    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image);
    }
    // tslint:disable-next-line: forin
    for (const key in this.courseForm.value) {
      fd.append(key, this.courseForm.value[key]);
    }

    fd.append('slug', this.titleToSlug.transform(this.courseForm.value.title));

    this.courseService.createCourse(fd).subscribe({
      error: (err) => console.log(err),
      complete: () => this.router.navigate(['/admin-panel'])
    });
  }

  onFileUpload(file) {
    this.image = file;
  }
}
