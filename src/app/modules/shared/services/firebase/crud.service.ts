import {
  Injectable
} from '@angular/core';
import {
  Router
} from '@angular/router';

/**
 * Third party class
 */
import {
  Observable
} from 'rxjs';

import {
  initializeApp
} from 'firebase';

const _firestore = initializeApp({
  apiKey: 'AIzaSyBGXN1FkZjubMRWJ-KuAaAnpCTXlHFl9zw',
  authDomain: 'quickstart-belamondo.firebaseapp.com',
  databaseURL: 'https://quickstart-belamondo.firebaseio.com',
  projectId: 'quickstart-belamondo',
  storageBucket: 'quickstart-belamondo.appspot.com',
  messagingSenderId: '506374782568'
}, 'database').firestore();

@Injectable()
export class CrudService {

  constructor() { }

  create = (params) => new Promise((resolve, reject) => {
    if (!params) {
      resolve({
        code: 'c-error-01',
        message: 'Minimum params required'
      });

      return false;
    }

    if (!params.collectionsAndDocs) {
      resolve({
        code: 'c-error-02',
        message: 'Required param: collection'
      });

      return false;
    }

    if (!params.objectToCreate) {
      resolve({
        code: 'c-error-03',
        message: 'Required param: objectToCreate'
      });

      return false;
    }

    let stringToFilter, stringCreatingFilter, functionToFilter;

    stringToFilter = '_firestore';
    stringCreatingFilter = '';

    for (let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
      if ((i === 0) || (i % 2 === 0)) {
        stringCreatingFilter += '.collection("' + params.collectionsAndDocs[i] + '")';
      } else {
        stringCreatingFilter += '.doc("' + params.collectionsAndDocs[i] + '")';
      }
    }

    if (params.where) {
      for (let lim = params.where.length, i = 0; i < lim; i++) {
        stringCreatingFilter += '.where("' + params.where[i][0] + '", "' + params.where[i][1] + '", "' + params.where[i][2] + '")';
      }
    }

    stringToFilter += stringCreatingFilter;
    functionToFilter = eval(stringToFilter);

    functionToFilter
      .add(params.objectToCreate)
      .catch(err => {
        return err;
      })
      .then(res => {
        resolve(res);
      });
  })

  delete = (params) => new Promise((resolve, reject) => {

  })

  readWithObservable = (params) => new Observable(observer => {
    // Check params: start
    if (!params) {
      observer.next({
        code: 'r-error-01',
        message: 'Minimum params required'
      });

      return false;
    }

    if (!params.collectionsAndDocs) {
      observer.next({
        code: 'r-error-02',
        message: 'Required param: collectionsAndDocs'
      });

      return false;
    }
    // Check params: end

    let stringToFilter, stringCreatingFilter, functionToFilter;

    stringToFilter = '_firestore';
    stringCreatingFilter = '';

    for (let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
      if ((i === 0) || (i % 2 === 0)) {
        stringCreatingFilter += '.collection("' + params.collectionsAndDocs[i] + '")';
      } else {
        stringCreatingFilter += '.doc("' + params.collectionsAndDocs[i] + '")';
      }
    }

    if (params.where) {
      for (let lim = params.where.length, i = 0; i < lim; i++) {
        stringCreatingFilter += '.where("' + params.where[i][0] + '", "' + params.where[i][1] + '", "' + params.where[i][2] + '")';
      }
    }

    stringToFilter += stringCreatingFilter;
    functionToFilter = eval(stringToFilter);

    functionToFilter
    .onSnapshot(querySnapshot => {
      let snapshot;
      snapshot = [];
      if (querySnapshot.docs) {
        querySnapshot.forEach((doc) => {
          let object;
          object = doc.data();
          object['_id'] = doc.id;

          snapshot.push(object);
        });
      } else {
        let object;
        object = querySnapshot.data();

        if (object) {
          object['_id'] = querySnapshot.id;
        }

        snapshot.push(object);
      }

      observer.next(snapshot);
    });
  })

  readWithPromise = (params) => new Promise((resolve, reject) => {
    // Check params: start
    if (!params) {
      resolve({
        code: 'r-error-01',
        message: 'Minimum params required'
      });

      return false;
    }

    if (!params.collectionsAndDocs) {
      resolve({
        code: 'r-error-02',
        message: 'Required param: collectionsAndDocs'
      });

      return false;
    }
    // Check params: end

    let stringToFilter, stringCreatingFilter, functionToFilter;


    // IF no ssObject on the flow OR nothing found on ssObject, read firestore
    stringToFilter = '_firestore';
    stringCreatingFilter = '';

    for (let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
      if ((i === 0) || (i % 2 === 0)) {
        stringCreatingFilter += '.collection("' + params.collectionsAndDocs[i] + '")';
      } else {
        stringCreatingFilter += '.doc("' + params.collectionsAndDocs[i] + '")';
      }
    }

    if (params.where) {
      for (let lim = params.where.length, i = 0; i < lim; i++) {
        stringCreatingFilter += '.where("' + params.where[i][0] + '", "' + params.where[i][1] + '", "' + params.where[i][2] + '")';
      }
    }

    stringToFilter += stringCreatingFilter;
    functionToFilter = eval(stringToFilter);

    functionToFilter
    .get()
    .then((querySnapshot) => {
      let result;
      result = [];
      if (querySnapshot.docs) {
        querySnapshot.forEach((doc) => {
          let object;
          object = doc.data();
          object['_id'] = doc.id;

          result.push(object);
        });
      } else {
        let object;
        object = querySnapshot.data();

        if (object) {
          object['_id'] = querySnapshot.id;
        }

        result.push(object);
      }

      // IF sessionStorage flow AND something found on firestore AND sessionStorage length is lower than 401
      // after calculating new responses) PUSH results to sessionStorage
      if (sessionStorage.getItem(params.collectionsAndDocs[params.collectionsAndDocs.length - 1])) {
        let ssObject;
        ssObject = JSON.parse(sessionStorage.getItem(params.collectionsAndDocs[params.collectionsAndDocs.length - 1]));

        if ((ssObject.length + result.length) < 401) {
          for (let lim = result.length, i = 0; i < lim; i++) {
            ssObject.push(result[i]);
          }

          sessionStorage.setItem(params.collectionsAndDocs[params.collectionsAndDocs.length - 1], JSON.stringify(ssObject));
        }
      }

      // Response to reading
      resolve(result);
    });
  })

  update = (params) => new Promise((resolve, reject) => {
    if (!params) {
      resolve({
        code: 'u-error-01',
        message: 'Minimum params required'
      });
    }
    let stringToFilter, stringCreatingFilter, functionToFilter;

    if (!params.collectionsAndDocs) {
      resolve({
        code: 'u-error-02',
        message: 'Required param: collection'
      });
    }

    if (!params.objectToUpdate) {
      resolve({
        code: 'u-error-03',
        message: 'Required param: objectToUpdate'
      });
    }

    stringToFilter = '_firestore';
    stringCreatingFilter = '';

    for (let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
      if ((i === 0) || (i % 2 === 0)) {
        stringCreatingFilter += '.collection("' + params.collectionsAndDocs[i] + '")';
      } else {
        stringCreatingFilter += '.doc("' + params.collectionsAndDocs[i] + '")';
      }
    }

    if (params.where) {
      for (let lim = params.where.length, i = 0; i < lim; i++) {
        stringCreatingFilter += '.where("' + params.where[i][0] + '", "' + params.where[i][1] + '", "' + params.where[i][2] + '")';
      }
    }

    stringToFilter += stringCreatingFilter;
    functionToFilter = eval(stringToFilter);

    functionToFilter
      .set(params.objectToUpdate)
      .then(res => {
        // Check sessionStorage flow over update: start
        if (sessionStorage.getItem(params.collectionsAndDocs[params.collectionsAndDocs.length - 2])) {
          // Collection will be on length - 2 because length - 1 is the doc identifies to be updated
          let ssObject;
          ssObject = JSON.parse(sessionStorage.getItem(params.collectionsAndDocs[params.collectionsAndDocs.length - 2]));

          for (let limSs = ssObject.length, ss = 0; ss < limSs; ss++) {
            if (ssObject[ss]['_id'] === params.collectionsAndDocs[params.collectionsAndDocs.length - 1]) {
              ssObject[ss] = params.objectToUpdate;
            }
          }

          sessionStorage.setItem(params.collectionsAndDocs[params.collectionsAndDocs.length - 1], JSON.stringify(ssObject));

        }
        // Check sessionStorage flow over update: end
        resolve(res);
      });
  })
}
