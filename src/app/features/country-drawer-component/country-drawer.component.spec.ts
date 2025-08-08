import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController } from '@angular/common/http/testing';

import { CountryDrawerComponent } from './country-drawer.component';

describe('CountryDrawerComponent', () => {
	let fixture: ComponentFixture<CountryDrawerComponent>;
	let component: CountryDrawerComponent;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				CountryDrawerComponent,
				NoopAnimationsModule
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CountryDrawerComponent);
		component = fixture.componentInstance;
		httpMock = TestBed.inject(HttpTestingController);

		// Mock data fetch for edge case: empty country list
		const req = httpMock.expectOne('assets/europe_population_enriched.json');
		req.flush({ Europe: {} });

		fixture.detectChanges();
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should handle empty country list gracefully', () => {
		expect(component.countries?.length || 0).toBe(0);
	});

	it('should display country details when data is present', () => {
		// Simulate data fetch with one country
		const req = httpMock.expectOne('assets/europe_population_enriched.json');
		req.flush({
			Europe: {
				'Southern Europe': [
					{
						country: 'Sampleland',
						population: 500000,
						land_area_km2: 5432,
						wikipedia: '#',
						flag: '',
						region: 'Southern Europe'
					}
				]
			}
		});
		fixture.detectChanges();
		expect(component.countries?.[0]?.country).toBe('Sampleland');
	});

	it('should handle missing fields in country data', () => {
		const req = httpMock.expectOne('assets/europe_population_enriched.json');
		req.flush({
			Europe: {
				'Western Europe': [
					{
						country: 'Edgecase',
						// population missing
						// land_area_km2 missing
						wikipedia: '#',
						flag: '',
						region: 'Western Europe'
					}
				]
			}
		});
		fixture.detectChanges();
		expect(component.countries?.[0]?.country).toBe('Edgecase');
		expect(component.countries?.[0]?.population).toBeUndefined();
		expect(component.countries?.[0]?.land_area_km2).toBeUndefined();
	});
});
