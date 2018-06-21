import { Component, OnInit } from '@angular/core';

/**
 * Services
 */
import { CrudService } from '../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public isStarted: boolean;
  public userData: any;

  constructor(
    private _crud: CrudService
  ) { }

  ngOnInit() {
    this.isStarted = false;
  }
}
