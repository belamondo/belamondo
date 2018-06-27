import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { CashFlowComponent } from './cash-flow.component';
import { DashboardComponent } from './../cash-flow/components/dashboard/dashboard.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomingOutcomingComponent } from './components/incoming-outcoming/incoming-outcoming.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { OutcomingComponent } from './components/outcoming/outcoming.component';
import { PayableReceivableComponent } from './components/payable-receivable/payable-receivable.component';
import { ProductComponent } from './components/product/product.component';
import { ReportComponent } from './components/report/report.component';
import { ServiceComponent } from './components/service/service.component';

const routes: Routes = [{
  path: '', component: CashFlowComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'expense',
    component: ExpenseComponent
  }, {
    path: 'expense/:id',
    component: ExpenseComponent
  }, {
    path: 'products',
    component: ProductComponent
  }, {
    path: 'products/:id',
    component: ProductComponent
  }, {
    path: 'services',
    component: ServiceComponent
  }, {
    path: 'services/:id',
    component: ServiceComponent
  }, {
    path: 'incoming-outcoming',
    component: IncomingOutcomingComponent
  }, {
    path: 'incoming-outcoming/:id',
    component: IncomingOutcomingComponent
  }, {
    path: 'incoming',
    component: IncomingComponent
  }, {
    path: 'outcoming',
    component: OutcomingComponent
  }, {
    path: 'payable-receivable',
    component: PayableReceivableComponent
  }, {
    path: 'report',
    component: ReportComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule { }
