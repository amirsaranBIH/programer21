import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { LectureService } from '../services/lecture.service';
import { CourseService } from '../services/course.service';
import { ModuleService } from '../services/module.service';
import { ToastrService } from 'ngx-toastr';


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
  public percentCompleted = 0;

  constructor(
      private route: ActivatedRoute,
      private courseService: CourseService,
      private moduleService: ModuleService,
      private lectureService: LectureService,
      private auth: AuthenticationService,
      private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    if (this.user.coursesEnrolledIn.length > 0) {
      this.updateCourseCompletedPercent(this.user.coursesEnrolledIn[this.activeCoursePicked]);
    }
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

    let nextModuleIndex = course.currentModuleIndex;
    let nextLectureIndex = course.currentLectureIndex;

    if (course.currentLectureIndex === _module.lectures.length - 1) {
      if (course.currentModuleIndex === course.course.modules.length - 1) {
        // course finished
        this.courseService.finishCourse(this.activeCoursePicked).subscribe({
          error: (err) => console.log(err),
          complete: () => {
            this.toastr.success('You successfully finished course!', 'Success');
          }
        });
      } else {
        nextModuleIndex = course.currentModuleIndex + 1;
        nextLectureIndex = 0;
        this.moduleService.finishModule(this.activeCoursePicked, nextModuleIndex).subscribe({
          error: (err) => console.log(err),
          complete: () => {}
        });
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
        this.updateCourseCompletedPercent(this.user.coursesEnrolledIn[this.activeCoursePicked]);
      }
    });
  }

  skipModule() {
    const course = this.user.coursesEnrolledIn[this.activeCoursePicked];

    let nextModuleIndex = course.currentModuleIndex;

    if (course.currentModuleIndex === course.course.modules.length - 1) {
      // course finished
      this.courseService.finishCourse(this.activeCoursePicked).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.toastr.success('You successfully finished course!', 'Success');
        }
      });
    } else {
      nextModuleIndex = course.currentModuleIndex + 1;
    }

    this.moduleService.skipModule(this.activeCoursePicked, nextModuleIndex).subscribe({
      error: (err) => console.log(err),
      complete: () => {
        this.auth.dashboard().subscribe({
          error: (err) => console.log(err),
          next: (user) => {
            this.user = user;
            this.activeModule = nextModuleIndex;
            this.activeLecture = 0;
            this.updateCourseCompletedPercent(this.user.coursesEnrolledIn[this.activeCoursePicked]);
          }
        });
      }
    });
  }

  updateCourseCompletedPercent(course) {
    let allLectures = 0;
    const finishedAndSkippedLectures = course.lecturesFinished.length + course.lecturesSkipped.length;

    for (let i = 0, n = course.course.modules.length; i < n; i++) {
      allLectures += course.course.modules[i].lectures.length;
    }

    this.percentCompleted = (finishedAndSkippedLectures / allLectures) * 100;
  }
}
