import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { ClientModuleComponent } from './components/client-module/client-module.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { ServiceComponent } from './components/service/service.component';
import { SystemComponent } from './system.component';

const routes: Routes = [{
  path: '', component: SystemComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'product',
    component: ProductComponent
  }, {
    path: 'product/:id',
    component: ProductComponent
  }, {
    path: 'service',
    component: ServiceComponent
  }, {
    path: 'service/:id',
    component: ServiceComponent
  }, {
    path: 'client-module',
    component: ClientModuleComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
