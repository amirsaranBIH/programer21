import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'formatSupportedLanguages'
})
export class FormatSupportedLanguagesPipe implements PipeTransform {

  constructor(private translate: TranslateService) {

  }

  transform(value: any): any {
    return value.map(lang => this.translate.instant(lang[0].toUpperCase() + lang.toLowerCase().substring(1))).join(', ');
  }

}
