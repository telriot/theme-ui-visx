import { IBaseDataPoint } from 'types';
import { largeIntToAbbr } from 'src/utils/format';

export class BaseDataPoint implements IBaseDataPoint {
  value;

  label;

  constructor(value: number, label: string) {
    this.value = value;
    this.label = label;
  }

  public getAbbrValue(precision?: number): string {
    return largeIntToAbbr(this.value, precision);
  }
}
