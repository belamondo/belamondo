import { Injectable, OnInit } from '@angular/core';

/**
 * Rxjs
 */
import { Observable } from 'rxjs';
import { CrudService } from './firebase/crud.service';

@Injectable({
  providedIn: 'root'
})

export class StrategicDataService implements OnInit {
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
  ) {}

  ngOnInit() {
    if (!this.userData$ || this.userData$.length < 1) {      
    }
  }

  userChosen = () => new Promise((resolve, reject) => { console.log(33)
    this.user = JSON.parse(sessionStorage.getItem('user'));
      
    this._crud.readWithObservable({
      collectionsAndDocs: ['people', this.user['uid']]
    }).subscribe(resPeople => {
      if(resPeople[0]) {
        this.userData$ = resPeople;
      } else {        
        this._crud.readWithObservable({
          collectionsAndDocs: ['companies', this.user['uid']]
        }).subscribe(resCompanies => {
          if(resCompanies[0]) {
            this.userData$ = resCompanies;
          } else {
            this._crud.readWithObservable({
              collectionsAndDocs: ['animals', this.user['uid']]
            }).subscribe(resAnimals => {
              if(resAnimals[0]) {
                this.userData$ = resAnimals;
              } else {
                this._crud.readWithObservable({
                  collectionsAndDocs: ['entities', this.user['uid']]
                }).subscribe(resEntities => {
                  if(resEntities[0]) {
                    this.userData$ = resEntities;
                  } else {
                    this.userData$ = {};
                  }
                }, err => {
                  return err;
                });
              }
            }, err => {
              return err;
            });
          }
        }, err => {
          return err;
        });
      }
    }, err => {
      return err;
    });

    return true;
  })
}
