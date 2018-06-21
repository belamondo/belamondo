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
          this._strategicData.emptyAllData();

          this._snackbar.open(fbRes['message'], '', {
            duration: 4000
          });

          sessionStorage.setItem('user', JSON.stringify(fbRes['user']));

          // Check if user loggedin is assigned and on what type of user
          // Case not assigned, sending to profile choice

          this._strategicData.setUserData()
          .then(user => {
            if (user[0]) {
              this._router.navigate([params.navigateTo]);
            }
          });
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
      console.log(this._strategicData.userData$);
      _authentication.signOut();
      this._strategicData.emptyAllData();
      sessionStorage.clear();

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
