import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LectureService } from '../services/lecture.service';

@Injectable()
export class LectureGuardService implements CanActivate {

  constructor(
    private lectureService: LectureService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.lectureService.getLectureById(route.params.lecture_id).then((res: any) => {
      if (!res.status) {
        this.router.navigate(['/admin-panel']);
        return false;
      }

      return true;
    });
  }
}
