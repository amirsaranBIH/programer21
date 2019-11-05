import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public details: UserDetails;
  public activeCoursePicked = 0;
  public courses = [];
  public activeModule = -1;
  public activeLecture = -1;
  public selectedCourse = 0;

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.dashboard().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });

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

  nextCoursePicked() {
    if (this.activeCoursePicked === this.courses.length - 1) {
      this.activeCoursePicked = 0;
    } else {
      this.activeCoursePicked++;
    }
  }

  previousCoursePicked() {
    if (this.activeCoursePicked === 0) {
      this.activeCoursePicked = this.courses.length - 1;
    } else {
      this.activeCoursePicked--;
    }
  }

  changeActiveModulePicked(newIndex) {
    this.activeModule = this.activeModule === newIndex ? -1 : newIndex;
  }

  changeActiveLecturePicked(newIndex) {
    this.activeLecture = this.activeLecture === newIndex ? -1 : newIndex;
  }
}
