import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryDrawer } from './country-drawer';

describe('CountryDrawer', () => {
  let component: CountryDrawer;
  let fixture: ComponentFixture<CountryDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
