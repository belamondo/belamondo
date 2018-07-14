import {
    AbstractControl
} from '@angular/forms';

import { CrudService } from '../services/firebase/crud.service';


export function ValidateUniqueValue(valueToIgnoreIfUpdate: string, collectionAndField: any, _crud: CrudService) {
    let response;
    return function (control: AbstractControl) {
        clearTimeout(response);

        response = setTimeout(() => {
            _crud.readWithPromise({
                collectionsAndDocs: [collectionAndField[0]],
                where: [[collectionAndField[1], '==', control.value]]
            }).then(res => {
                if (res['length'] > 0) {
                    if (res[0][collectionAndField[1]] !== valueToIgnoreIfUpdate) {
                        control.setErrors({
                            validate: false,
                            message: 'Campo de valor único e o valor "' + control.value + '" já existe'
                        });
                    }
                }
            });
        }, 500);
        return null;
    };
}

