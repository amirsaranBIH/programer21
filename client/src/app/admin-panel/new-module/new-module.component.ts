import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModuleService } from 'src/app/services/module.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleToSlugPipe } from 'src/app/pipes/title-to-slug.pipe';

@Component({
  selector: 'app-new-module',
  templateUrl: './new-module.component.html',
  styleUrls: ['./new-module.component.scss']
})
export class NewModuleComponent implements OnInit {
  public moduleForm: FormGroup;
  public image: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private moduleService: ModuleService,
    private titleToSlug: TitleToSlugPipe
    ) { }

  ngOnInit() {
    this.moduleForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      difficulty: ['beginner', [Validators.required]],
      status: ['private', [Validators.required]],
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

  onSubmit() {
    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image);
    }
    // tslint:disable-next-line: forin
    for (const key in this.moduleForm.value) {
      fd.append(key, this.moduleForm.value[key]);
    }

    fd.append('slug', this.titleToSlug.transform(this.moduleForm.value.title));

    this.moduleService.createModule(this.route.snapshot.params.course_id, fd).subscribe(res => {
      this.router.navigate(['/admin-panel']);
    }, err => {
      console.log(err);
    });
  }

  onFileUpload(file) {
    this.image = file;
  }
}
