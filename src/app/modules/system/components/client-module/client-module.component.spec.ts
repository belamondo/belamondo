import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientModuleComponent } from './client-module.component';

describe('ClientModuleComponent', () => {
  let component: ClientModuleComponent;
  let fixture: ComponentFixture<ClientModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
