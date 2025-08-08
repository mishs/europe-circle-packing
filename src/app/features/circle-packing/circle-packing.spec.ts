import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclePacking } from './circle-packing';

describe('CirclePacking', () => {
  let component: CirclePacking;
  let fixture: ComponentFixture<CirclePacking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclePacking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclePacking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
