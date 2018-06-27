import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOutcomingComponent } from './dialog-outcoming.component';

describe('DialogOutcomingComponent', () => {
  let component: DialogOutcomingComponent;
  let fixture: ComponentFixture<DialogOutcomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOutcomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOutcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
