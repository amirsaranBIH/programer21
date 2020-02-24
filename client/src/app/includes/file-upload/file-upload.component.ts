import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFileUpload: EventEmitter<any> = new EventEmitter();

  @Input() uploadText = 'Upload Image';
  @Input() imagePreview = '';

  constructor() { }

  ngOnInit() {
  }

  uploadFile(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };

      reader.readAsDataURL(e.target.files[0]);
    }

    this.onFileUpload.emit(e.target.files[0]);
  }

  drag(e) {
    e.preventDefault();
  }

  drop(e) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };

    reader.readAsDataURL(e.dataTransfer.files[0]);

    this.onFileUpload.emit(e.dataTransfer.files[0]);
    e.preventDefault();
  }

}
