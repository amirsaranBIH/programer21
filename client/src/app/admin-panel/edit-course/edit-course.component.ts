import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';
import { LectureService } from 'src/app/services/lecture.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {
  public course;
  public courseLectures = [];
  public unfilteredCourseLectures = [];
  public editCourseForm: FormGroup;
  public supportedLanguage;
  public supportedLanguages = [];
  public supportedLanguageSubmitted = false;
  public searchInput = '';
  public statusFilter = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private titleToSlug: TitleToSlugPipe,
    private lectureService: LectureService,
    private toastr: ToastrService,
    private loading: LoadingService
    ) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;
    this.courseLectures = this.route.snapshot.data.courseLectures;
    this.supportedLanguages = this.course.supportedLanguages;

    this.editCourseForm = this.fb.group({
      title: [this.course.title, [Validators.required]],
      difficulty: [this.course.difficulty, [Validators.required]],
      description: [this.course.description, [
        Validators.required,
        Validators.maxLength(200)
      ]],
      price: [this.course.price, [Validators.required]],
      shortName: [this.course.shortName, [Validators.required]],
      status: [this.course.status, [Validators.required]],
      color: [this.course.color, [Validators.required]],
      image: [this.course.image, [Validators.required]]
    });

    this.unfilteredCourseLectures = JSON.parse(JSON.stringify(this.courseLectures));
  }

  get title() {
    return this.editCourseForm.get('title');
  }

  get difficulty() {
    return this.editCourseForm.get('difficulty');
  }

  get description() {
    return this.editCourseForm.get('description');
  }

  get price() {
    return this.editCourseForm.get('price');
  }

  get shortName() {
    return this.editCourseForm.get('shortName');
  }

  get status() {
    return this.editCourseForm.get('status');
  }

  get color() {
    return this.editCourseForm.get('color');
  }

  get image() {
    return this.editCourseForm.get('image');
  }

  onSubmit() {
    if (this.editCourseForm.invalid || this.loading.isLoading) {
      return false;
    }

    this.loading.setLoadingStatus = true;

    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image.value);
    }
    // tslint:disable-next-line: forin
    for (const key in this.editCourseForm.value) {
      if (key !== 'image') {
        fd.append(key, this.editCourseForm.value[key]);
      }
    }

    fd.append('slug', this.titleToSlug.transform(this.editCourseForm.value.title));
    fd.append('supportedLanguages', JSON.stringify(this.supportedLanguages));

    this.courseService.updateCourse(this.route.snapshot.params.course_id, fd).subscribe({
      error: (err) => console.log(err),
      complete: () => {
        this.toastr.success('Successfully updated course', 'Success');
        this.loading.setLoadingStatus = false;
      }
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

  filterLectures() {
    this.courseLectures = this.unfilteredCourseLectures.filter(lecture => {
      if (this.searchInput !== '' && !lecture.title.match(new RegExp(this.searchInput, 'i'))) {
        return false;
      }

      if (this.statusFilter !== '' && lecture.status !== this.statusFilter) {
        return false;
      }

      return true;
    });
  }

  removeSupportedLanguage(supportedLanguageIndex) {
    this.supportedLanguages.splice(supportedLanguageIndex, 1);
  }

  deleteCourse() {
    if (confirm('Are you sure?')) {
      this.courseService.deleteCourse(this.route.snapshot.params.course_id).subscribe({
        error: (err) => console.log(err),
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Successfully deleted course and all it\'s lectures', 'Success');
            this.router.navigate(['admin-panel']);
          }
        }
      });
    }
  }

  deleteLecture(lectureId, lectureIndex) {
    if (confirm('Are you sure?')) {
      this.lectureService.deleteLecture(lectureId).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.toastr.success('Successfully deleted lecture', 'Success');
          this.courseLectures.splice(lectureIndex, 1);
        }
      });
    }
  }

  toggleLectureStatus(lectureIndex) {
    const selectedLecture = this.courseLectures[lectureIndex];

    if (selectedLecture.status === 'public') {
      selectedLecture.status = 'private';
    } else {
      selectedLecture.status = 'public';
    }

    this.lectureService.toggleLectureStatus(selectedLecture.id, selectedLecture.status).then((res: any) => {
      if (res.status) {
        this.toastr.success('Successfully changed lecture status to: ' + selectedLecture.status, 'Success');
      }
    });
  }
}
