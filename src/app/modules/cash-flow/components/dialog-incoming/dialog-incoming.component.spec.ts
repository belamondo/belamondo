import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncomingComponent } from './dialog-incoming.component';

describe('DialogIncomingComponent', () => {
  let component: DialogIncomingComponent;
  let fixture: ComponentFixture<DialogIncomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogIncomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
