import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-lecture',
  templateUrl: './new-lecture.component.html',
  styleUrls: ['./new-lecture.component.scss']
})
export class NewLectureComponent implements OnInit {
  public lectureForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.lectureForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      body: ['', [Validators.required]],
      thumbnail: ['']
    });
  }

  get title() {
    return this.lectureForm.get('title');
  }

  get description() {
    return this.lectureForm.get('description');
  }

  onSubmit(value) {
    console.log(value);
  }
}
