import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { MainComponent } from './main.component';
import { PlaygroundComponent } from './components/playground/playground.component';

const routes: Routes = [{
  path: '', component: MainComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'invitation',
    component: InvitationComponent
  }, {
    path: 'playground',
    component: PlaygroundComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class MainRoutingModule { }
