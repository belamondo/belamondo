import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { CashFlowComponent } from './cash-flow.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DashboardComponent } from './../cash-flow/components/dashboard/dashboard.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomingOutcomingComponent } from './components/incoming-outcoming/incoming-outcoming.component';
import { PayableReceivableComponent } from './components/payable-receivable/payable-receivable.component';
import { PeopleComponent } from './components/people/people.component';
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
    path: 'companies',
    component: CompaniesComponent
  }, {
    path: 'companies/:id',
    component: CompaniesComponent
  }, {
    path: 'people',
    component: PeopleComponent
  }, {
    path: 'people/:id',
    component: PeopleComponent
  }, {
    path: 'incoming-outcoming',
    component: IncomingOutcomingComponent
  }, {
    path: 'incoming-outcoming/:id',
    component: IncomingOutcomingComponent
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
