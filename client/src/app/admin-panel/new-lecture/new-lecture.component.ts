import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LectureService } from 'src/app/services/lecture.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-lecture',
  templateUrl: './new-lecture.component.html',
  styleUrls: ['./new-lecture.component.scss']
})
export class NewLectureComponent implements OnInit {
  public lectureForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private lectureService: LectureService) { }

  ngOnInit() {
    this.lectureForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      difficulty: ['', [Validators.required]],
      thumbnail: [''],
      body: ['<p>Start writing...</p>'],
      skippable: [false]
    });
  }

  get title() {
    return this.lectureForm.get('title');
  }

  get description() {
    return this.lectureForm.get('description');
  }

  get difficulty() {
    return this.lectureForm.get('difficulty');
  }

  onSubmit(value) {
    this.lectureService.createLecture(this.route.snapshot.params.module_id, value).subscribe({
      next: (res: any) => this.router.navigate(['/admin-panel/edit-lecture', res.createdLectureId]),
      error: (err) => console.log(err),
    });
  }
}
