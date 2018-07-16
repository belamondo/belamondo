import { Component, OnInit } from '@angular/core';

/**
 * Components
 */

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  public paramsToTopbarMenu: any;

  constructor() { }

  ngOnInit() {
    this.paramsToTopbarMenu = {
      title: 'BelaMondo Área de Administração',
      views: [{
        name: 'Painel inicial',
        icon: 'home',
        link: ['dashboard']
      }, {
        name: 'Cadastro de produto',
        icon: 'build',
        link: ['product']
      }, {
        name: 'Cadastro de serviço',
        icon: 'shopping_cart',
        link: ['service']
      }, {
        name: 'Módulos para clientes',
        icon: 'view_module',
        link: ['client-module']
      }]
    };
  }

}
