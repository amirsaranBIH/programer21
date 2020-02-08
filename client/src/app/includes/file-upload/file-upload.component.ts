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

  constructor() { }

  ngOnInit() {
  }

  uploadFile(e) {
    this.onFileUpload.emit(e.target.files[0]);
  }

}
