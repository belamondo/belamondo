import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CashFlowComponent } from './cash-flow.component';
import { CompaniesComponent } from '../crm/components/companies/companies.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomingOutcomingComponent, DialogFormIncomingOutcomingComponent } from './components/incoming-outcoming/incoming-outcoming.component';
import { PayableReceivableComponent } from './components/payable-receivable/payable-receivable.component';
import { ProductComponent } from '../system/components/product/product.component';
import { ReportComponent, DialogFormReportComponent } from './components/report/report.component';

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
    CompaniesComponent,
    DashboardComponent,
    DialogFormIncomingOutcomingComponent,
    DialogFormReportComponent,
    ExpenseComponent,
    IncomingOutcomingComponent,
    PayableReceivableComponent,
    ProductComponent,
    ReportComponent
  ],
  entryComponents: [
    DialogFormIncomingOutcomingComponent,
    DialogFormReportComponent,
  ]
})
export class CashFlowModule { }
