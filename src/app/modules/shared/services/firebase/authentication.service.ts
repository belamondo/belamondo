/**
 * @description Deals with authentication properties and methods based on firebase authentication service
 *
 * @method login() - validates or not the authentication of user and its password
 *    @param {Object} params - required
 *    @param {string} params.loginMode - required - possible values: emailAndPassword
 *    @param {string} params.user -required - possible values: will depend on loginMode
 *    @param {string} params.password - required
 *    @param {string} params.navigateTo - required - e.g.: '/main'
 *        @returns default data from firebase authentication method (according to loginMode)
 *
 * @method logout - destroys loggedin user session using firebase method
 *    @param {string} params.navigateTo - required - e.g.: '/login'
 *    @returns code and message according to succesful or failed logout
 *
 * @method setUser - returns user data if there is one loggedin
 *    @returns user id and firebase object related to loggedin user if there is one, and false if there is no user loggedin
 */

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './crud.service';

/**
 * Third party class
 */
import { initializeApp } from 'firebase';
import { StrategicDataService } from '../strategic-data.service';

const _authentication = initializeApp({
  apiKey: 'AIzaSyBGXN1FkZjubMRWJ-KuAaAnpCTXlHFl9zw',
  authDomain: 'quickstart-belamondo.firebaseapp.com',
  databaseURL: 'https://quickstart-belamondo.firebaseio.com',
  projectId: 'quickstart-belamondo',
  storageBucket: 'quickstart-belamondo.appspot.com',
  messagingSenderId: '506374782568'
}, 'auth').auth();

@Injectable()
export class AuthenticationService {
  public companiesDocuments: any;
  public contacts: any;
  public peopleDocuments: any;
  public user: any;
  public userAnimals: any;
  public userCompanies: any;
  public userData: any;
  public userEntities: any;
  public userPeople: any;

  constructor(
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
  ) {}

  login = (params) => new Promise((res, rej) => {
    // Set params errors: start
    if (!params) {
      res({
        code: 'l-error-01',
        message: 'Defina parâmetros mínimos'
      });
    } else {
      if (!params.user) {
        res({
          code: 'l-error-02',
          message: 'Parâmetro obrigatório: user'
        });
      }

      if (!params.password) {
        res({
          code: 'l-error-03',
          message: 'Parâmetro obrigatório: password'
        });
      }

      if (!params.loginMode) {
        res({
          code: 'l-error-04',
          message: 'Parâmetro obrigatório: loginMode'
        });
      }

      if (!params.navigateTo) {
        res({
          code: 'l-error-05',
          message: 'Parâmetro obrigatório: navigateTo'
        });
      }
    }
    // Set params errors: end

    if (params.loginMode === 'emailAndPassword') {
      _authentication.signInWithEmailAndPassword(params.user, params.password)
      .catch(fbErr => {
        if (fbErr) {
          this._snackbar.open(fbErr['message'], '', {
            duration: 4000
          });
        }
      })
      .then(fbRes => {
        if (fbRes && fbRes['user']['uid']) {
          fbRes['code'] = 'l-success-01';
          fbRes['message'] = 'Welcome';

          sessionStorage.clear();

          this._snackbar.open(fbRes['message'], '', {
            duration: 4000
          });

          sessionStorage.setItem('user', JSON.stringify(fbRes['user']));
          // Check if user loggedin is assigned and on what type of user
          // Case not assigned, sending to profile choice
          console.log(JSON.parse(sessionStorage.getItem('user')));
          this._strategicData.userChosen()
          .then(user => {
            console.log(user);
          });

          return false;
          // this._crud.readWithObservable({
          //   collectionsAndDocs: ['people', fbRes['user']['uid']]
          // }).then(resPeople => {
          //   if (!resPeople[0]) {
          //     this._crud.readWithObservable({
          //       collectionsAndDocs: ['companies', fbRes['user']['uid']]
          //     }).then(resCompanies => {
          //       if (!resCompanies[0]) {
          //         this._crud.readWithObservable({
          //           collectionsAndDocs: ['animals', fbRes['user']['uid']]
          //         }).then(resAnimals => {
          //           if (!resAnimals[0]) {
          //             this._crud.readWithObservable({
          //               collectionsAndDocs: ['entities', fbRes['user']['uid']]
          //             }).then(resEntities => {
          //               if (!resEntities[0]) {
          //                 this._router.navigate(['/main/profile_choice']);
          //               } else {
          //                 this.userData = resEntities;

          //                 if (!this.userCompanies) {
          //                   this._crud.readWithObservable({
          //                     collectionsAndDocs: ['entities', fbRes['user']['uid'], 'userCompanies']
          //                   }).then(resUserCompanies => {
          //                     this.userCompanies = resUserCompanies;
          //                   });
          //                 }

          //                 if (!this.userPeople) {
          //                   this._crud.readWithObservable({
          //                     collectionsAndDocs: ['entities', fbRes['user']['uid'], 'userPeople']
          //                   }).then(resUserPeople => {
          //                     this.userPeople = resUserPeople;
          //                   });
          //                 }

          //                 this._router.navigate([params.navigateTo]);
          //               }
          //             });
          //           } else {
          //             if (!this.userData) {
          //               resAnimals[0]['userType'] = 'animals';
          //               this.userData = resAnimals;
          //             }

          //             if (!this.userCompanies) {
          //               this._crud.readWithObservable({
          //                 collectionsAndDocs: ['animals', fbRes['user']['uid'], 'userCompanies']
          //               }).then(resUserCompanies => {
          //                 this.userCompanies = resUserCompanies;
          //               });
          //             }

          //             if (!this.userPeople) {
          //               this._crud.readWithObservable({
          //                 collectionsAndDocs: ['animals', fbRes['user']['uid'], 'userPeople']
          //               }).then(resUserPeople => {
          //                 this.userPeople = resUserPeople;
          //               });
          //             }

          //             this._router.navigate([params.navigateTo]);
          //           }
          //         });
          //       } else {
          //         if (!this.userData) {
          //           resCompanies[0]['userType'] = 'companies';
          //           this.userData = resCompanies;
          //         }

          //         if (!this.userCompanies) {
          //           this._crud.readWithObservable({
          //             collectionsAndDocs: ['companies', fbRes['user']['uid'], 'userCompanies']
          //           }).then(resUserCompanies => {
          //             this.userCompanies = resUserCompanies;
          //           });
          //         }

          //         if (!this.userPeople) {
          //           this._crud.readWithObservable({
          //             collectionsAndDocs: ['companies', fbRes['user']['uid'], 'userPeople']
          //           }).then(resUserPeople => {
          //             this.userPeople = resUserPeople;
          //           });
          //         }

          //         this._router.navigate([params.navigateTo]);
          //       }
          //     });
          //   } else {
          //     if (!this.userData) {
          //       resPeople[0]['userType'] = 'people';
          //       this.userData = resPeople;
          //     }

          //     if (!this.userCompanies) {
          //       this._crud.readWithObservable({
          //         collectionsAndDocs: ['people', fbRes['user']['uid'], 'userCompanies']
          //       }).then(resUserCompanies => {
          //         this.userCompanies = resUserCompanies;
          //       });
          //     }

          //     if (!this.userPeople) {
          //       this._crud.readWithObservable({
          //         collectionsAndDocs: ['people', fbRes['user']['uid'], 'userPeople']
          //       }).then(resUserPeople => {
          //         this.userPeople = resUserPeople;
          //       });
          //     }

          //     this._router.navigate([params.navigateTo]);
          //   }
          // });

          // if (!this.companiesDocuments) {
          //   this._crud.readWithObservable({
          //     collectionsAndDocs: ['documents'],
          //     where: [
          //       ['type', '==', 'companies']
          //     ]
          //   }).then(companyDocs => {
          //     let documents;
          //     documents = companyDocs['filter'](el => el.name !== 'CNPJ');

          //     this.companiesDocuments = documents;
          //   });
          // }

          // if (!this.peopleDocuments) {
          //   this._crud.readWithObservable({
          //     collectionsAndDocs: ['documents'],
          //     where: [
          //       ['type', '==', 'people']
          //     ]
          //   }).then(peopleDocs => {
          //     let documents;
          //     documents = peopleDocs['filter'](el => el.name !== 'CPF');

          //     this.peopleDocuments = documents;
          //   });
          // }

          // if (!this.contacts) {
          //   this._crud.readWithObservable({
          //     collectionsAndDocs: ['contacts'],
          //   }).then(contacts => {
          //     this.contacts = contacts;
          //   });
          // }

          // res(fbRes);
        } else {
          res(fbRes);
          if (fbRes) {
            this._snackbar.open(fbRes['message'], '', {
              duration: 4000
            });
          }
        }
      });
    }
  })

  logout = (params) => new Promise((res, rej) => {
    if (!params) {
      res({
        code: 'lg-error-01',
        message: 'Defina parâmetros mínimos'
      });
    } else {
      if (!params.navigateTo) {
        res({
          code: 'lg-error-02',
          message: 'Parâmetro obrigatório: navigateTo'
        });
      }

      _authentication.signOut();

      this._router.navigate([params.navigateTo]);
    }
  })

  setUser = () => new Promise((res, rej) => {
    _authentication.onAuthStateChanged(resAuth => {
      if (resAuth) {
        let user;
        user = {
          id: resAuth.uid,
          fbObject: resAuth
        };

        res(user);
      } else {
        res(false);
      }
    });
  })
}
