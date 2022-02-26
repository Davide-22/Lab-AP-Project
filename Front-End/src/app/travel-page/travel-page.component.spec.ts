import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPageComponent } from './travel-page.component';

describe('TravelPageComponent', () => {
  let component: TravelPageComponent;
  let fixture: ComponentFixture<TravelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
