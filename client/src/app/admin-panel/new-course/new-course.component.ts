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
  public createCourseForm: FormGroup;
  public supportedLanguage;
  public supportedLanguages = [];
  public supportedLanguageSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private titleToSlug: TitleToSlugPipe
    ) { }

  ngOnInit() {
    this.createCourseForm = this.fb.group({
      title: ['', [Validators.required]],
      difficulty: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required]],
      shortName: ['', [Validators.required]],
      color: ['', [Validators.required]],
      image: ['', [Validators.required]]
    });
  }

  get title() {
    return this.createCourseForm.get('title');
  }

  get difficulty() {
    return this.createCourseForm.get('difficulty');
  }

  get description() {
    return this.createCourseForm.get('description');
  }

  get price() {
    return this.createCourseForm.get('price');
  }

  get shortName() {
    return this.createCourseForm.get('shortName');
  }

  get color() {
    return this.createCourseForm.get('color');
  }

  get image() {
    return this.createCourseForm.get('image');
  }

  onSubmit() {
    if (this.createCourseForm.invalid) {
      return false;
    }

    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image.value);
    }
    // tslint:disable-next-line: forin
    for (const key in this.createCourseForm.value) {
      fd.append(key, this.createCourseForm.value[key]);
    }

    fd.append('slug', this.titleToSlug.transform(this.createCourseForm.value.title));
    fd.append('supportedLanguages', JSON.stringify(this.supportedLanguages));

    this.courseService.createCourse(fd).subscribe({
      error: (err) => console.error(err),
      next: (res: any) => this.router.navigate(['/admin-panel/edit-course', res.data])
    });
  }

  onFileUpload(file) {
    this.image.patchValue(file);
  }

  colorChanged(newColor) {
    this.color.patchValue(newColor);
  }

  addSupportedLanguage() {
    this.supportedLanguageSubmitted = true;

    if (this.supportedLanguage.trim() !== '') {
      this.supportedLanguages.push(this.supportedLanguage.trim());
      this.supportedLanguageSubmitted = false;
    }

    this.supportedLanguage = '';
  }
}
