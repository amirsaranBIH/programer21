import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-lecture',
  templateUrl: './edit-lecture.component.html',
  styleUrls: ['./edit-lecture.component.scss']
})
export class EditLectureComponent implements OnInit {
  public editLectureForm: FormGroup;
  public lecture;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.lecture = this.route.snapshot.data.lecture;
    console.log(this.lecture);

    this.editLectureForm = this.fb.group({
      title: [this.lecture.title, [Validators.required]],
      description: [this.lecture.description, [Validators.required]],
      difficulty: [this.lecture.difficulty, [Validators.required]],
      thumbnail: [this.lecture.thumbnail],
      body: [this.lecture.body],
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

  onSubmit(value) {
    console.log(value);
  }

}
