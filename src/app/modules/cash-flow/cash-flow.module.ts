import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CashFlowComponent } from './cash-flow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DialogIncomingComponent } from './components/dialog-incoming/dialog-incoming.component';
import { DialogOutcomingComponent } from './components/dialog-outcoming/dialog-outcoming.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import {
  IncomingOutcomingComponent
} from './components/incoming-outcoming/incoming-outcoming.component';
import { OutcomingComponent } from './components/outcoming/outcoming.component';
import { PayableReceivableComponent } from './components/payable-receivable/payable-receivable.component';
import { ProductComponent } from './components/product/product.component';
import {
  ReportComponent,
  DialogFormReportComponent
} from './components/report/report.component';
import { ServiceComponent } from './components/service/service.component';

/**
 * Modules
 */
import { CashFlowRoutingModule } from './cash-flow-routing.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CashFlowRoutingModule,
    SharedModule
  ],
  declarations: [
    CashFlowComponent,
    DashboardComponent,
    DialogFormReportComponent,
    ExpenseComponent,
    IncomingOutcomingComponent,
    PayableReceivableComponent,
    ProductComponent,
    ReportComponent,
    ServiceComponent,
    IncomingComponent,
    OutcomingComponent,
    DialogIncomingComponent,
    DialogOutcomingComponent,
  ],
  entryComponents: [
    DialogFormReportComponent,
    DialogIncomingComponent,
    DialogOutcomingComponent,
  ]
})
export class CashFlowModule { }
