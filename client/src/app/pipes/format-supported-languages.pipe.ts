import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSupportedLanguages'
})
export class FormatSupportedLanguagesPipe implements PipeTransform {

  transform(value: any): any {
    return value.map(lang => lang[0].toUpperCase() + lang.toLowerCase().substring(1)).join(', ');
  }

}
