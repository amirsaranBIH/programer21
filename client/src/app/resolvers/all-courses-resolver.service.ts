
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CourseService } from '../services/course.service';

@Injectable()
export class AllCoursesResolverService implements Resolve<any> {

  constructor(private courseService: CourseService) { }

  resolve() {
    return this.courseService.getAllCourses();
  }

}
