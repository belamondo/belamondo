import {
    AbstractControl
} from '@angular/forms';

export function ValidatePasswordForce(control: AbstractControl) {
    let string,
        checkLowerLetter,
        checkNumber,
        checkSpecialCharacter,
        checkUpperLetter;

    const specialChar = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    string = control.value;
    checkLowerLetter = false;
    checkNumber = false;
    checkSpecialCharacter = false;
    checkUpperLetter = false;

    string.map(check => {
        if (check === check.toLowerCase()) {
            checkLowerLetter = true;
        }

        if (check === check.toUpperCase()) {
            checkUpperLetter = true;
        }

        if (check === Number(check)) {
            checkNumber = true;
        }

        if (specialChar.test(check)) {
            checkSpecialCharacter = true;
        }
    });

    if (!checkLowerLetter) {
        return {
            validate: false,
            message: 'A senha precisa ter ao menos uma letra minúscula'
        };
    }

    if (!checkNumber) {
        return {
            validate: false,
            message: 'A senha precisa ter ao menos um número'
        };
    }

    if (!checkSpecialCharacter) {
        return {
            validate: false,
            message: 'A senha precisa ter ao menos um caractere especial'
        };
    }

    if (!checkUpperLetter) {
        return {
            validate: false,
            message: 'A senha precisa ter ao menos uma letra maiúscula'
        };
    }

    if (string.length < 8) {
      return {
        validate: false,
        message: 'A senha precisa ter ao menos 8 caracteres'
      };
    }

    return null;
}
