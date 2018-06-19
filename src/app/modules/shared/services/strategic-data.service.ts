import { Injectable, OnInit } from '@angular/core';

/**
 * Rxjs
 */
import { Observable } from 'rxjs';
import { CrudService } from './firebase/crud.service';

@Injectable({
  providedIn: 'root'
})

export class StrategicDataService {
  public companiesDocuments$: any;
  public contacts$: any;
  public peopleDocuments$: any;
  public user: any;
  public userAnimals: any;
  public userCompanies: any;
  public userData$: any;
  public userEntities: any;
  public userPeople: any;

  constructor(
    private _crud: CrudService,
  ) {
    if (!this.userData$ || this.userData$.length < 1) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this._crud.readWithObservable({
        collectionsAndDocs: ['animals', this.user['uid']]
      }).subscribe(resAnimals => {
        this.userAnimals = resAnimals;
      }, err => {
        return err;
      });

      this._crud.readWithObservable({
        collectionsAndDocs: ['companies', this.user['uid']]
      }).subscribe(resCompanies => {
        this.userCompanies = resCompanies;
      }, err => {
        return err;
      });

      this._crud.readWithObservable({
        collectionsAndDocs: ['entities', this.user['uid']]
      }).subscribe(resEntities => {
        this.userEntities = resEntities;
      }, err => {
        return err;
      });

      this._crud.readWithObservable({
        collectionsAndDocs: ['people', this.user['uid']]
      }).subscribe(resPeople => {
        this.userPeople = resPeople;
      }, err => {
        return err;
      });
    }
  }

  userChosen = () => new Promise((resolve, reject) => {
    if (this.userAnimals) {
      this.userData$ = this.userAnimals;
    } else if (this.userCompanies) {
      this.userData$ = this.userCompanies;
    } else if (this.userEntities) {
      this.userData$ = this.userEntities;
    } else if (this.userPeople) {
      this.userData$ = this.userPeople;
    } else {
      this.userData$ = undefined;
    }

    console.log(this.userData$);

    return true;
  })
}
