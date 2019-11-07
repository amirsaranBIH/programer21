
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LectureService } from '../services/lecture.service';

@Injectable()
export class OneLectureResolverService implements Resolve<any> {

  constructor(private lectureService: LectureService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.lectureService.getLectureById(route.paramMap.get('lecture_id'));
  }

}
