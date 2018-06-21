import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInviationComponent } from './dialog-inviation.component';

describe('DialogInviationComponent', () => {
  let component: DialogInviationComponent;
  let fixture: ComponentFixture<DialogInviationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogInviationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
