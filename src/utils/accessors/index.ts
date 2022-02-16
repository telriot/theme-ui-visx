import { IBaseDataPoint } from 'types';

export const getValue = (d: IBaseDataPoint) => d.value;
export const getLabel = (d: IBaseDataPoint) => d.label;
