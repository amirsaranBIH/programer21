import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getSummary'
})
export class GetSummaryPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.substr(0, args[0] || 50).trim() + '...';
  }

}
