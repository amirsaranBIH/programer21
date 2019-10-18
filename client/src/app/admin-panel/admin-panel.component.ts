import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  public courses = [];
  public selectedCourse = 0;
  public selectedModule = 0;
  public selectedLecture = 0;

  public activeCourse = -1;
  public activeModule = -1;
  public activeLecture = -1;

  constructor() {}

  ngOnInit() {
    this.courses = [
      {
        title: 'Course 1',
        modules: [
          {
            title: 'Module 1',
            lectures: [
              {
                title: 'Lecture 1'
              },
              {
                title: 'Lecture 2'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 3'
              },
            ]
          },
          {
            title: 'Module 2',
            lectures: []
          },
          {
            title: 'Module 3',
            lectures: [
              {
                title: 'Lecture 2'
              },
              {
                title: 'Lecture 3'
              },
              {
                title: 'Lecture 4'
              },
            ]
          },
        ]
      },
      {
        title: 'Course 2',
        modules: []
      },
      {
        title: 'Course 3',
        modules: [
          {
            title: 'Module 1',
            lectures: [
              {
                title: 'Lecture 1'
              },
              {
                title: 'Lecture 2'
              }
            ]
          },
          {
            title: 'Module 2',
            lectures: [
              {
                title: 'Lecture 1'
              },
              {
                title: 'Lecture 2'
              },
              {
                title: 'Lecture 4'
              },
            ]
          },
        ]
      },
    ]
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
