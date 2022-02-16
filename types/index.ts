export type GenericDateTime = string | number | Date;

export interface IBaseDataPoint {
  value: number;
  label: string;
  getAbbrValue: (precision?: number) => string;
}
