import { IBaseDataPoint } from 'types';

export class BaseDataPoint implements IBaseDataPoint {
  value;

  label;

  constructor(value: number, label: string) {
    this.value = value;
    this.label = label;
  }
}
