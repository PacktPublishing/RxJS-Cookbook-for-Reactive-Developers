import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true
})
export class TimePipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null) return '00:00';
    
    const minutes: number = Math.floor(value / 60);
    const seconds: number = (value - minutes * 60);

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
  }
}