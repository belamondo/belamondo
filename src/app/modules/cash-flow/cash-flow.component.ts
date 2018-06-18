import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent implements OnInit {

  public paramsToTopbarMenu: any;

  constructor() { }

  ngOnInit() {

    /* Options to show in side nav menu */
    this.paramsToTopbarMenu = {
      title: 'Fluxo de Caixa',
      views: [{
        name: 'Painel inicial',
        icon: 'home',
        link: ['dashboard']
      }, {
        name: 'Cadastros',
        icon: 'assignment',
        expansionMenu: true,
        subMenus: [
          { name: 'Despesas', link: 'expense' },
          { name: 'Produtos e Serviços', link: 'products' },
          { name: 'clientes', link: 'companies' }
        ]
      }, {
        name: 'Lançamentos',
        icon: 'compare_arrows',
        link: ['incoming-outcoming']
      }, {
        name: 'Contas a pagar/receber',
        icon: 'attach_money',
        link: ['payable-receivable']
      }, {
        name: 'Relatórios',
        icon: 'assessment',
        link: ['report']
      }]
    };
  }

}
