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
import { StrategicDataService } from '../strategic-data.service';

const _firestore = initializeApp({
  apiKey: 'AIzaSyBGXN1FkZjubMRWJ-KuAaAnpCTXlHFl9zw',
  authDomain: 'quickstart-belamondo.firebaseapp.com',
  databaseURL: 'https://quickstart-belamondo.firebaseio.com',
  projectId: 'quickstart-belamondo',
  storageBucket: 'quickstart-belamondo.appspot.com',
  messagingSenderId: '506374782568',
  timestampsInSnapshots: true
}, 'database').firestore();

@Injectable()
export class CrudService {
  private user: any;
  constructor() {
  }

  create = (params) => new Promise((resolve, reject) => {
    if (!params) {
      resolve({
        code: 'c-error-01',
        message: 'Minimum params required'
      });

      return false;
    }

    this.user = JSON.parse(sessionStorage.getItem('user'));

    let stringToFilter, stringCreatingFilter, functionToFilter, objectId, collectionsAndDocs,
    stringCreatingFilterToLog, queryToLog, logId, functionToLog;

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

    objectId = new Date().getTime() + '-' + this.user['uid'];
    stringToFilter = '_firestore.doc("';
    stringCreatingFilter = '';

    for (let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
      stringCreatingFilter += params.collectionsAndDocs[i] + '/';
    }


    stringCreatingFilter =  stringCreatingFilter + objectId;

    collectionsAndDocs =  stringCreatingFilter;

    stringCreatingFilter =  stringCreatingFilter + '")';

    if (params.where) {
      for (let lim = params.where.length, i = 0; i < lim; i++) {
        stringCreatingFilter += '.where("' + params.where[i][0] + '", "' + params.where[i][1] + '", "' + params.where[i][2] + '")';
      }
    }

    stringToFilter += stringCreatingFilter;

    functionToFilter = eval(stringToFilter);

    queryToLog = stringToFilter;

    params.objectToCreate['_deleted_at'] = 0;

    functionToFilter
      .set(params.objectToCreate)
      .catch(err => {
        return err;
      })
      .then(res => {
        logId = new Date().getTime() + '-' + this.user['uid'];

        stringCreatingFilterToLog = '_firestore.doc("' + collectionsAndDocs + '/_log/' + logId + '")';

        functionToLog = eval(stringCreatingFilterToLog);

        functionToLog
        .set({
          _objectSet: params.objectToCreate
        });

        resolve({
          _id: objectId,
          _data: params.objectToCreate
        });
      });
  })

  delete = (params) => new Promise((resolve, reject) => {
    if (!params) {
      resolve({
        code: 'd-error-01',
        message: 'Minimum params required'
      });
    }

    if (!params.collectionsAndDocs) {
      resolve({
        code: 'd-error-02',
        message: 'Required param: collection'
      });
    }

    this.user = JSON.parse(sessionStorage.getItem('user'));

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
      .update({
        _deleted_at: new Date().getTime(),
        _user: this.user['uid']
      })
      .then(res => {
        resolve(res);
      });
  })

  readWithObservable = (params) => Observable.create(observer => {
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

          if (object && object['_deleted_at'] === 0) {
            snapshot.push(object);
          }
        });
      } else {
        let object;
        object = querySnapshot.data();

        if (object) {
          object['_id'] = querySnapshot.id;
        }

        if (object && object['_deleted_at'] === 0) {
          snapshot.push(object);
        }
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
          if (object && object['_deleted_at'] === 0) {
            result.push(object);
          }
        });
      } else {
        let object;
        object = querySnapshot.data();

        if (object) {
          object['_id'] = querySnapshot.id;
        }

        if (object && object['_deleted_at'] === 0) {
          result.push(object);
        }
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
    this.user = JSON.parse(sessionStorage.getItem('user'));

    let stringToFilter, stringCreatingFilter, functionToFilter, collectionsAndDocs,
    stringCreatingFilterToLog, queryToLog, logId, functionToLog;

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

    stringToFilter = '_firestore.doc("';
    stringCreatingFilter = '';

    for (let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
      stringCreatingFilter += params.collectionsAndDocs[i] + '/';
    }

    collectionsAndDocs =  stringCreatingFilter;

    stringCreatingFilter +=  stringCreatingFilter.slice(stringCreatingFilter.length - 1, 1) + '")';

    if (params.where) {
      for (let lim = params.where.length, i = 0; i < lim; i++) {
        stringCreatingFilter += '.where("' + params.where[i][0] + '", "' + params.where[i][1] + '", "' + params.where[i][2] + '")';
      }
    }

    stringToFilter += stringCreatingFilter;
    functionToFilter = eval(stringToFilter);

    queryToLog = stringToFilter;

    params.objectToUpdate['_deleted_at'] = 0;

    functionToFilter
      .set(params.objectToUpdate)
      .then(res => {
        logId = new Date().getTime() + '-' + this.user['uid'];

        stringCreatingFilterToLog = '_firestore.doc("' + collectionsAndDocs + '_log/' + logId + '")';

        functionToLog = eval(stringCreatingFilterToLog);

        functionToLog
        .set({
          _objectSet: params.objectToUpdate
        });

        resolve(res);
      });
  })
}
