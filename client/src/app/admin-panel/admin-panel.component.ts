import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  public courses = [];
  public selectedCourse = 0;
  public selectedModule = 0;
  public selectedLecture = 0;

  public activeCourse = -1;
  public activeModule = -1;
  public activeLecture = -1;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courses = this.route.snapshot.data.courses;
    console.log(this.courses);
  }

  changeSelectedCourse(newIndex) {
    this.selectedCourse = newIndex;
    this.selectedModule = 0;
    this.selectedLecture = 0;
    this.activeCourse = this.activeCourse === newIndex ? -1 : newIndex;
    this.activeModule = -1;
    this.activeLecture = -1;
  }

  changeSelectedModule(newIndex) {
    this.selectedModule = newIndex;
    this.selectedLecture = 0;
    this.activeModule = this.activeModule === newIndex ? -1 : newIndex;
    this.activeLecture = -1;
  }

  changeSelectedLecture(newIndex) {
    this.selectedLecture = newIndex;
    this.activeLecture = this.activeLecture === newIndex ? -1 : newIndex;
  }
}
