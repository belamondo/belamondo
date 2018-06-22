import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**
 * Services
 */
import { AuthenticationService } from './../shared/services/firebase/authentication.service';
import { CrudService } from './../shared/services/firebase/crud.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public paramsToTopbarMenu: any;

  constructor() {}

  ngOnInit() {
    this.paramsToTopbarMenu = {
      title: 'BelaMondo',
      views: [{
        name: 'Painel inicial',
        icon: 'home',
        link: ['dashboard']
      }, {
        name: 'Fazer convite',
        icon: 'email',
        link: ['invitation']
      }]
    };
  }
}
