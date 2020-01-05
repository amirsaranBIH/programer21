import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { LectureService } from '../services/lecture.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user: UserDetails;
  public activeCoursePicked = 0;
  public activeModule = -1;
  public activeLecture = -1;
  public selectedCourse = 0;

  constructor(private route: ActivatedRoute, private lectureService: LectureService) {}

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    console.log(this.user.coursesEnrolledIn)
  }

  nextCoursePicked() {
    if (this.activeCoursePicked === this.user.coursesEnrolledIn.length - 1) {
      this.activeCoursePicked = 0;
    } else {
      this.activeCoursePicked++;
    }
  }

  previousCoursePicked() {
    if (this.activeCoursePicked === 0) {
      this.activeCoursePicked = this.user.coursesEnrolledIn.length - 1;
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

  skipLecture() {
    const course = this.user.coursesEnrolledIn[this.activeCoursePicked];
    const _module = course.course.modules[this.activeModule];

    let nextModuleIndex = 0;
    let nextLectureIndex = 0;

    if (course.currentLectureIndex === _module.lectures.length - 1) {
      if (course.currentModuleIndex === course.course.modules.length - 1) {
        // course finished
        return;
      } else {
        nextModuleIndex = course.currentModuleIndex + 1;
        nextLectureIndex = 0;
      }
    } else {
      nextModuleIndex = course.currentModuleIndex;
      nextLectureIndex = course.currentLectureIndex + 1;
    }

    this.lectureService.skipLecture(this.activeCoursePicked, nextModuleIndex, nextLectureIndex).subscribe({
      error: (err) => console.log(err),
      complete: () => {
        this.activeModule = nextModuleIndex;
        this.activeLecture = nextLectureIndex;
        this.user.coursesEnrolledIn[this.activeCoursePicked].currentModuleIndex = nextModuleIndex;
        this.user.coursesEnrolledIn[this.activeCoursePicked].currentLectureIndex = nextLectureIndex;
        this.user.coursesEnrolledIn[this.activeCoursePicked].lecturesSkipped.push(_module.lectures[this.activeLecture]._id);
      }
    });
  }
}
