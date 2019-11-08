import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModuleService } from 'src/app/services/module.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-module',
  templateUrl: './new-module.component.html',
  styleUrls: ['./new-module.component.scss']
})
export class NewModuleComponent implements OnInit {
  public moduleForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private moduleService: ModuleService) { }

  ngOnInit() {
    this.moduleForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      difficulty: ['beginner', [Validators.required]],
      status: ['private', [Validators.required]],
      thumbnail: [''],
      skippable: [false]
    });
  }

  get title() {
    return this.moduleForm.get('title');
  }

  get description() {
    return this.moduleForm.get('description');
  }

  get difficulty() {
    return this.moduleForm.get('difficulty');
  }

  get status() {
    return this.moduleForm.get('status');
  }

  onSubmit(value) {
    this.moduleService.createModule(this.route.snapshot.params.course_id, value).subscribe(res => {
      this.router.navigate(['/admin-panel']);
    }, err => {
      console.log(err);
    });
  }

}
