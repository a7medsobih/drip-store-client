import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egpCurrency',
  standalone: true,
})
export class EgpCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return `${value ?? 0} EGP`;
  }
}
