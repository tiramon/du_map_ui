import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fuzzy' })
export class FuzzyPipe implements PipeTransform {

  transform(value: number): string {
    const now = Date.now();
    let diff = now - value;
    //console.log(now, value, diff);
    const ms = diff % 1000;
    diff = (diff - ms) / 1000;
    const s = diff % 60;
    diff = (diff - s) / 60;
    const m = diff % 60;
    diff = (diff - m) / 60;
    const h = diff % 24;
    diff = (diff - h) / 24;
    const d = diff;

    const y = diff % 365;
    //console.log(y,d,h,m,s,ms);
    let result = '';
    if (d < 365) {
        result = (s < 10 ? '0' : '') + s + 's';
        result = (m < 10 ? '0' : '') + m + 'm ' + result;
        result = (h < 10 ? '0' : '') + h + 'h ' + result;
        if (d > 0) {
            result = d + 'd ' + result;
        }
    } else {
        result = y + 'y';
    }

    return result;
  }
}
