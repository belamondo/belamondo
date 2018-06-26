import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CashFlowComponent } from './cash-flow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseComponent } from './components/expense/expense.component';
import {
  IncomingOutcomingComponent
} from './components/incoming-outcoming/incoming-outcoming.component';
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
  ],
  entryComponents: [
    DialogFormReportComponent,
  ]
})
export class CashFlowModule { }
