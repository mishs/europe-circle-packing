export interface Country {
  country: string;
  population: number;
  wikipedia: string;
  flag: string;
  land_area_km2: number;
  region: string; 
}

export interface Region {
  name: string;
  countries: Country[];
}

export interface EuropeData {
  Europe: {
    [region: string]: Country[];
  };
}
