
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LectureService } from '../services/lecture.service';

@Injectable()
export class QuizQuestionsResolverService implements Resolve<any> {

  constructor(private lectureService: LectureService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.lectureService.getLectureQuizQuestionById(route.paramMap.get('lecture_id')).then((res: any) => res.data);
  }

}
