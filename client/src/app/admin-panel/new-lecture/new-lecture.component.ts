import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LectureService } from 'src/app/services/lecture.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';

@Component({
  selector: 'app-new-lecture',
  templateUrl: './new-lecture.component.html',
  styleUrls: ['./new-lecture.component.scss']
})
export class NewLectureComponent implements OnInit {
  public createLectureForm: FormGroup;
  public course;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lectureService: LectureService,
    private titleToSlug: TitleToSlugPipe
    ) { }

  ngOnInit() {
    this.course = this.route.snapshot.data.course;

    this.createLectureForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      difficulty: ['beginner', [Validators.required]],
      skippable: [false]
    });
  }

  get title() {
    return this.createLectureForm.get('title');
  }

  get description() {
    return this.createLectureForm.get('description');
  }

  get difficulty() {
    return this.createLectureForm.get('difficulty');
  }

  onSubmit(value) {
    value.slug = this.titleToSlug.transform(this.createLectureForm.value.title);

    this.lectureService.createLecture(this.route.snapshot.params.course_id, value).subscribe({
      error: (err) => console.log(err),
      next: (res: any) => this.router.navigate(['/admin-panel/edit-lecture', res.data])
    });
  }
}
