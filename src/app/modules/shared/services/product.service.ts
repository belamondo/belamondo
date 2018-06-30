import { Injectable } from '@angular/core';

/**
 * Services
 */
import { CrudService } from './firebase/crud.service';
import { StrategicDataService } from './strategic-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public userData: any;

  constructor(
    private _crud: CrudService,
    private _strategicData: StrategicDataService
  ) {
    if (this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;
      });
    }
  }

  findProduct = (search) => new Promise ((resolve, reject) => {
    let productSearch;
    productSearch = setTimeout(
      this._crud.readWithObservable({
        collectionsAndDocs: ['products'],
        where: [
          ['name', '==', search],
          ['codebar', '==', search]
        ]
      }).subscribe(res => {
        console.log(res)
      })
      , 1000
    );
  })
}
