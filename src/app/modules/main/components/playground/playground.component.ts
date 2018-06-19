import { Component, OnInit } from '@angular/core';

/**
 * Services
 */
import { CrudService } from '../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  constructor(
    private _crud: CrudService
  ) { }

  ngOnInit() {
    this._crud.readWithObservable({
      collectionsAndDocs: ['people', 'kslSSyY3IJ8DCGdNYg4B']
    }).subscribe(res => {
      console.log(res);
    });
  }

}
