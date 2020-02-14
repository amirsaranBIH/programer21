
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LectureService } from '../services/lecture.service';

@Injectable()
export class LectureHTMLContentResolverService implements Resolve<any> {

  constructor(private lectureService: LectureService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.lectureService.getLectureHtmlBySlug(route.paramMap.get('slug')).then((res: any) => res.data);
  }

}
