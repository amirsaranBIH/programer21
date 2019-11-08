import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModuleService } from 'src/app/services/module.service';

@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.scss']
})
export class EditModuleComponent implements OnInit {
  public module;
  public editModuleForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private moduleService: ModuleService, private router: Router) { }

  ngOnInit() {
    this.module = this.route.snapshot.data.module;

    this.editModuleForm = this.fb.group({
      title: [this.module.title, [Validators.required]],
      description: [this.module.description, [Validators.required]],
      difficulty: [this.module.difficulty, [Validators.required]],
      status: [this.module.status, [Validators.required]],
      thumbnail: [this.module.thumbnail],
      skippable: [this.module.skippable]
    });
  }

  get title() {
    return this.editModuleForm.get('title');
  }

  get description() {
    return this.editModuleForm.get('description');
  }

  get difficulty() {
    return this.editModuleForm.get('difficulty');
  }

  get status() {
    return this.editModuleForm.get('status');
  }

  onSubmit(value) {
    this.moduleService.editModule(this.route.snapshot.params.module_id, value).subscribe({
      error: (err) => console.log(err),
      complete: () => this.router.navigate(['/admin-panel'])
    });
  }
}
