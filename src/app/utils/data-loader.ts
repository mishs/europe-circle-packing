import europeData from '../../assets/europe_population_enriched.json';
import { Country, Region } from '../models/country.model';

export function parseEuropeData(): Region[] {
  const regions: Region[] = [];
  Object.entries((europeData as any).Europe).forEach(([region, countries]) => {
    regions.push({
      name: region,
      countries: (countries as any[]).map(c => ({ ...c, region }))
    });
  });
  return regions;
}
