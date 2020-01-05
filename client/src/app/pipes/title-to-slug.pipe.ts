import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleToSlug'
})
export class TitleToSlugPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return value.toLowerCase().trim().replace(/\s+/g, '-');
  }

}
