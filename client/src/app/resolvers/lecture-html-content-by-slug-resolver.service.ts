
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LectureService } from '../services/lecture.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LectureHTMLContentResolverService implements Resolve<any> {

  constructor(private lectureService: LectureService, private translate: TranslateService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.lectureService.getLectureHtmlBySlug(route.paramMap.get('slug')).then((res: any) => {
      let html = res.data;
      const regex = /%% ?(.*?) ?%%/g;
      let result = regex.exec(html);

      while (result !== null) {
        html = html.replace(result[0], this.translate.instant(result[1]));
        result = regex.exec(html);
      }

      return html;
    });
  }

}
