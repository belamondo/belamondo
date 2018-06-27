import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomingComponent } from './outcoming.component';

describe('OutcomingComponent', () => {
  let component: OutcomingComponent;
  let fixture: ComponentFixture<OutcomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
