import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { ModuleService } from '../services/module.service';
import { LectureService } from '../services/lecture.service';

@Component({
  selector: 'app-admin-panel',
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

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private moduleService: ModuleService,
    private lectureService: LectureService
  ) {}

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

  deleteCourse(courseId, courseIndex) {
    if (confirm('Are you sure?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.courses.splice(courseIndex, 1);
          this.activeCourse = -1;
        }
      });
    }
  }

  deleteModule(moduleId, courseIndex, moduleIndex) {
    if (confirm('Are you sure?')) {
      this.moduleService.deleteModule(moduleId).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.courses[courseIndex].modules.splice(moduleIndex, 1);
          this.activeModule = -1;
        }
      });
    }
  }

  deleteLecture(lectureId, courseIndex, moduleIndex, lectureIndex) {
    if (confirm('Are you sure?')) {
      this.lectureService.deleteLecture(lectureId).subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.courses[courseIndex].modules[moduleIndex].lectures.splice(lectureIndex, 1);
          this.activeLecture = -1;
        }
      });
    }
  }
}
