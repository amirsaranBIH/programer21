import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {
  @Input() backRoute;

  constructor() { }

  ngOnInit() {
  }

}
