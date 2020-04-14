import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ertMinutesToHours'
})
export class ErtMinutesToHoursPipe implements PipeTransform {

  transform(value: number): string {
    if (value < 60) {
      return `less than 1 hour`;
    } else {
      const hours = Math.round(value / 60);
      const word = hours > 1 ? 'hours' : 'hour';
      return `${hours} ${word}`;
    }
  }

}
