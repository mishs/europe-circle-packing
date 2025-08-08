import { parseEuropeData } from './data-loader';

describe('parseEuropeData', () => {
  it('should parse data into regions and countries with region assigned', () => {
    const regions = parseEuropeData();
    expect(regions.length).toBeGreaterThan(0);
    for (const region of regions) {
      for (const country of region.countries) {
        expect(country.region).toBe(region.name);
      }
    }
  });
});
