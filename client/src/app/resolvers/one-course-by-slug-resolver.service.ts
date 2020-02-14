
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CourseService } from '../services/course.service';

@Injectable()
export class OneCourseBySlugResolverService implements Resolve<any> {

  constructor(private courseService: CourseService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.courseService.getCourseBySlug(route.paramMap.get('course_slug')).then((res: any) => res.data);
  }

}
