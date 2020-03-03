import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureService } from 'src/app/services/lecture.service';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.scss']
})
export class EditLectureComponent implements OnInit {
  public editLectureForm: FormGroup;
  public lecture;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lectureService: LectureService,
    private titleToSlug: TitleToSlugPipe,
    private toastr: ToastrService
    ) { }

    ngOnInit() {
      this.lecture = this.route.snapshot.data.lecture;

      this.editLectureForm = this.fb.group({
        title: [this.lecture.title, [Validators.required]],
        description: [this.lecture.description, [Validators.required]],
        status: [this.lecture.status, [Validators.required]],
        difficulty: [this.lecture.difficulty, [Validators.required]],
        skippable: [this.lecture.skippable]
      });
    }

    get title() {
      return this.editLectureForm.get('title');
    }

    get description() {
      return this.editLectureForm.get('description');
    }

    get difficulty() {
      return this.editLectureForm.get('difficulty');
    }

    get status() {
      return this.editLectureForm.get('status');
    }

  onSubmit(value) {
    value.slug = this.titleToSlug.transform(this.editLectureForm.value.title);

    this.lectureService.editLecture(this.route.snapshot.params.lecture_id, value).subscribe({
      error: (err) => console.log(err),
      complete: () => this.toastr.success('Successfully updated lecture', 'Success')
    });
  }

  deleteLecture() {
    if (confirm('Are you sure?')) {
      this.lectureService.deleteLecture(this.route.snapshot.params.lecture_id).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.toastr.success('Successfully deleted lecture', 'Success');
          this.router.navigate(['admin-panel', 'edit-course', this.lecture.course]);
        }
      });
    }
  }
}
