
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CourseService } from '../services/course.service';

@Injectable()
export class AllPublicCoursesResolverService implements Resolve<any> {

  constructor(private courseService: CourseService) { }

  resolve() {
    return this.courseService.getAllPublicCourses().then((res: any) => res.data);
  }

}
