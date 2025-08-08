import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController } from '@angular/common/http/testing';

import { CirclePackingComponent } from './circle-packing.component';

describe('CirclePackingComponent', () => {
  let fixture: ComponentFixture<CirclePackingComponent>;
  let component: CirclePackingComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CirclePackingComponent,
        NoopAnimationsModule
      ],
      // providers: [provideStore({ visualization: visualizationReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(CirclePackingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // (404 avoiding) 
    const req = httpMock.expectOne('assets/europe_population_enriched.json');
    req.flush({
      Europe: {
        'Northern Europe': [
          {
            country: 'Testland',
            population: 1000000,
            land_area_km2: 12345,
            wikipedia: '#',
            flag: '',
            region: 'Northern Europe'
          }
        ]
      }
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
