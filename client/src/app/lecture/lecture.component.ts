import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ModuleService } from '../services/module.service';
import { LectureService } from '../services/lecture.service';

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
      private moduleService: ModuleService,
      private lectureService: LectureService
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

            this.lectureService.finishLecture(courseIndex, nextModuleIndex, nextLectureIndex).subscribe({
              error: (err) => console.log(err),
              complete: () => {
                console.log('worked');
              }
            });
          }
        });
      }
    });
  }
}
