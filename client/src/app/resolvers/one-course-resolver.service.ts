
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CourseService } from '../services/course.service';

@Injectable()
export class OneCourseResolverService implements Resolve<any> {

  constructor(private courseService: CourseService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.courseService.getCourseById(route.paramMap.get('course_id'));
  }

}
