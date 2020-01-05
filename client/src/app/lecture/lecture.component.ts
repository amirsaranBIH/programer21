import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ModuleService } from '../services/module.service';
import { LectureService } from '../services/lecture.service';
import { CourseService } from '../services/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {
  public lecture;
  public htmlContent;

  constructor(
      private route: ActivatedRoute,
      private auth: AuthenticationService,
      private courseService: CourseService,
      private moduleService: ModuleService,
      private lectureService: LectureService,
      private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.lecture = this.route.snapshot.data.lecture;
    this.htmlContent = this.route.snapshot.data.html_content.data;

    
    this.auth.dashboard().subscribe({
      error: (err) => console.log(err),
      next: (user: any) => {
        
        this.moduleService.getModuleById(this.lecture.module).subscribe({
          error: (err) => console.log(err),
          next: (_module: any) => {
            const courseIndex = user.coursesEnrolledIn.findIndex(course => course.course._id === _module.course);
            const course = user.coursesEnrolledIn[courseIndex];

            if (course.lecturesFinished.some(finishedLectureId => finishedLectureId === this.lecture._id) ||
            course.lecturesSkipped.some(skippedLectureId => skippedLectureId === this.lecture._id)) {
              return;
            }

            let nextModuleIndex = course.currentModuleIndex;
            let nextLectureIndex = course.currentLectureIndex;

            if (course.currentLectureIndex === _module.lectures.length - 1) {
              if (course.currentModuleIndex === course.course.modules.length - 1) {
                // course finished
                this.courseService.finishCourse(courseIndex).subscribe({
                  error: (err) => console.log(err),
                  complete: () => {
                    this.toastr.success('You successfully finished course!', 'Success');
                  }
                });
              } else {
                nextModuleIndex = course.currentModuleIndex + 1;
                nextLectureIndex = 0;
                this.moduleService.finishModule(courseIndex, nextModuleIndex).subscribe({
                  error: (err) => console.log(err),
                  complete: () => {}
                });
              }
            } else {
              nextModuleIndex = course.currentModuleIndex;
              nextLectureIndex = course.currentLectureIndex + 1;
            }

            this.lectureService.finishLecture(courseIndex, nextModuleIndex, nextLectureIndex).subscribe({
              error: (err) => console.log(err),
              complete: () => {}
            });
          }
        });
      }
    });
  }
}
