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
          { name: 'Produtos', link: 'products' },
          { name: 'Serviços', link: 'services' },
        ]
      }, {
        name: 'Lançamentos',
        icon: 'compare_arrows',
        expansionMenu: true,
        subMenus: [
          { name: 'Entrada', link: 'incoming' },
          { name: 'Saída', link: 'outcoming' },
          { name: 'Funcionando por enquanto', link: 'incoming-outcoming' },
        ]
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
