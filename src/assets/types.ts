export interface Carriers {
  names: string;
  total: number;
}
export interface Airport {
  code: string;
  name: string;
}
export interface Time {
  label: string;
  month: number;
  monthName: string;
  year: number;
}

export interface Flights {
  cancelled: number;
  delayed: number;
  diverted: number;
  onTime: number;
  total: number;
}

export interface NumberOfDelays {
  carrier: number;
  lateAircraft: number;
  nationalAviationSystem: number;
  security: number;
  weather: number;
}
export interface MinutesDelayed {
  carrier: number;
  lateAircraft: number;
  nationalAviationSystem: number;
  security: number;
  total: number;
  weather: number;
}

export interface Statistics {
  delays: NumberOfDelays;
  carriers: Carriers;
  flights: Flights;
  minutesDelayed: MinutesDelayed;
}

export interface Delays {
  airport: Airport;
  time: Time;
  statistics: Statistics;
}
