import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * MOdules
 */
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DialogInviationComponent } from './components/invitation/dialog-inviation.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { MainComponent } from './main.component';
import { PlaygroundComponent } from './components/playground/playground.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    InvitationComponent,
    MainComponent,
    PlaygroundComponent,
    DialogInviationComponent,
  ],
  entryComponents: [
    DialogInviationComponent
  ]
})
export class MainModule { }
