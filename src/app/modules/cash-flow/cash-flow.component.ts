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
      title: 'PDV'
    };
  }
}
