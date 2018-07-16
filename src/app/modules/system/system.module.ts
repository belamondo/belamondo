import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DialogClientModuleComponent } from './components/dialog-client-module/dialog-client-module.component';
import { ProductComponent, DialogFormComponent } from './components/product/product.component';
import { ServiceComponent, DialogFormServiceComponent } from './components/service/service.component';
import { SystemComponent } from './system.component';

/**
 * Modules
 */
import { SharedModule } from './../shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';
import { ClientModuleComponent } from './components/client-module/client-module.component';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    DialogClientModuleComponent,
    DialogFormComponent,
    DialogFormServiceComponent,
    SystemComponent,
    ProductComponent,
    ServiceComponent,
    ClientModuleComponent,
  ],
  entryComponents: [
    DialogClientModuleComponent,
    DialogFormComponent,
    DialogFormServiceComponent,
  ]
})
export class SystemModule { }
