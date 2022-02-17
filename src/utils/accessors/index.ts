import { IBaseDataPoint } from 'types';

export const getValue = (d: IBaseDataPoint): number => d.value;
export const getLabel = (d: IBaseDataPoint): string => d.label;
