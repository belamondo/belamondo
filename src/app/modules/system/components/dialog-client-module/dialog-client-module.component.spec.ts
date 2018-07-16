import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClientModuleComponent } from './dialog-client-module.component';

describe('DialogClientModuleComponent', () => {
  let component: DialogClientModuleComponent;
  let fixture: ComponentFixture<DialogClientModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogClientModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogClientModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
