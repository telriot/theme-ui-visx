import { format } from 'date-fns';
import { GenericDateTime } from 'types';

export const formatToMD = (date: GenericDateTime): string =>
  format(new Date(date), 'MMM dd');
export const formatToMDY = (date: GenericDateTime): string =>
  format(new Date(date), 'MMM dd yy');
