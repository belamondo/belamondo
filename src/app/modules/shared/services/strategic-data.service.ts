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
  public user: any;
  public userData$: any;

  constructor(
    private _crud: CrudService,
  ) {}

  ngOnInit() {}

  userChosen = () => Observable.create(observer => {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this._crud.readWithPromise({
      collectionsAndDocs: ['people', this.user['uid']]
    }).then(resPeople => {
      if (resPeople[0]) {
        resPeople[0]['_userType'] = 'people';

        observer.next(resPeople);
      } else {
        this._crud.readWithPromise({
          collectionsAndDocs: ['companies', this.user['uid']]
        }).then(resCompanies => {
          if (resCompanies[0]) {
            resCompanies[0]['_userType'] = 'companies';
            observer.next(resCompanies);
          } else {
            this._crud.readWithPromise({
              collectionsAndDocs: ['animals', this.user['uid']]
            }).then(resAnimals => {
              if (resAnimals[0]) {
                resAnimals[0]['_userType'] = 'animals';
                observer.next(resAnimals);
              } else {
                this._crud.readWithPromise({
                  collectionsAndDocs: ['entities', this.user['uid']]
                }).then(resEntities => {
                  if (resEntities[0]) {
                    resEntities[0]['_userType'] = 'entities';
                    observer.next(resEntities);
                  } else {
                    observer.next([undefined]);
                  }
                }, err => {
                  observer.next(err);
                });
              }
            }, err => {
              observer.next(err);
            });
          }
        }, err => {
          observer.next(err);
        });
      }
    }, err => {
      observer.next(err);
    });
  })

  setUserData = () => new Promise((resolve, reject) => {
    this.userChosen()
    .subscribe(userData => {
      this.userData$ = userData;

      resolve(this.userData$);
    });
  })

  emptyAllData = () => {
    this.userData$ = undefined;
  }
}
