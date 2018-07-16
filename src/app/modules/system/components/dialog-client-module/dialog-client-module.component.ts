import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDatepickerIntl, MatSnackBar, MatDialog } from '@angular/material';

/**
 * Components
 */
import { DialogAddressComponent } from './../../../shared/components/dialog-address/dialog-address.component';
import { DialogContactComponent } from './../../../shared/components/dialog-contact/dialog-contact.component';
import { DialogDocumentComponent } from './../../../shared/components/dialog-document/dialog-document.component';

/**
 * Services
 */
import { AuthenticationService } from './../../../shared/services/firebase/authentication.service';
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { Router } from '@angular/router';
import { StrategicDataService } from './../../../shared/services/strategic-data.service';

/**
 * Third party
 */
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

/**
 * Validators
 */
import {
  ValidateCnpj
} from './../../../shared/validators/cnpj.validator';
import {
  ValidateCpf
} from './../../../shared/validators/cpf.validator';
import { ValidateUniqueValue } from './../../../shared/validators/unique-value.validator';

@Component({
  selector: 'app-dialog-client-module',
  templateUrl: './dialog-client-module.component.html',
  styleUrls: ['./dialog-client-module.component.css']
})
export class DialogClientModuleComponent implements OnInit {
  public companiesForm: FormGroup;
  public clientModuleForm: FormGroup;
  public isStarted: boolean;
  public peopleForm: FormGroup;
  public title: string;

  public mask: any;

  public autoCorrectedDatePipe: any;
  public addressesObject: any;
  public addresses: any;
  public clientType: string;
  public contactsObject: any;
  public contacts: any;
  public documentsObject: any;
  public documents: any;
  public user: any;

  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _dialog: MatDialog,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
  ) {
  }

  ngOnInit() {
    this.title = 'Cadastrar módulo de cliente';
    this.isStarted = false;
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.clientModuleForm = new FormGroup({
      description: new FormControl(null)
    });

    this.peopleForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required)
    });

    this.companiesForm = new FormGroup({
      cnpj: new FormControl(null, [Validators.required, ValidateCnpj, ValidateUniqueValue(null, [['companies'], 'cnpj'], this._crud)]),
      business_name: new FormControl(null, Validators.required),
      company_name: new FormControl(null)
    });
    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cell_phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.addressesObject = [];

    this.documentsObject = [];

    this.contactsObject = [];

    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };
  }

  checkUserExistence = () => {
    this._crud.readWithObservable({
      collectionsAndDocs: [this.clientModuleForm.get('description').value, this.user['uid']]
    }).subscribe(resCompanies => { console.log(resCompanies);
      if (resCompanies['length'] > 0) {
        this._router.navigate(['/main/dashboard']);

        this._snackbar.open('Você já escolheu seu tipo de perfil e não pode alterá-lo.', '', {
          duration: 4000
        });

        return false;
      } else {
      }
      this.isStarted = true;
    });
  }

  addAddress = () => {
    let dialogRef;

    dialogRef = this._dialog.open(DialogAddressComponent, {
      height: '500px',
      width: '800px',
      data: {
        mask: this.mask,
        autoCorrectedDatePipe: this.autoCorrectedDatePipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addressesObject.push(result);
      }
    });
  }

  deleteAddress = (i) => {
    this.addressesObject.splice(i, 1);
  }

  addContact = () => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogContactComponent, {
      height: '250px',
      width: '800px',
      data: {
        contacts: this.contacts,
        mask: this.mask
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contacts.forEach(element => {
          if (element.mask === result.type) {
            result.type = element.name;
          }
        });

        this.contactsObject.push(result);
      }
    });
  }

  deleteContact = (i) => {
    this.contactsObject.splice(i, 1);
  }

  addDocument = () => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogDocumentComponent, {
      height: '320px',
      width: '800px',
      data: {
        documents: this.documents,
        mask: this.mask,
        autoCorrectedDatePipe: this.autoCorrectedDatePipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documents.forEach(element => {
          if (element.mask === result.type) {
            result.type = element.name;
          }
        });

        this.documentsObject.push(result);
      }
    });
  }

  deleteDocument = (i) => {
    this.documentsObject.splice(i, 1);
  }

  onBirthdayChange = (event) => {
    this.peopleForm.get('birthday').setValue(event.targetElement.value);
  }

  onPeopleFormSubmit = () => {
    this._crud.readWithObservable({
      collectionsAndDocs: [this.clientModuleForm.get('description').value, this.user['uid']]
    }).subscribe(resPeople => {
      if (resPeople['length'] > 0) {
        this._router.navigate(['/main/dashboard']);

        this._snackbar.open('Você já escolheu seu tipo de perfil e não pode alterá-lo.', '', {
          duration: 4000
        });

        return false;
      } else {
        this._crud.update({
          collectionsAndDocs: [this.clientModuleForm.get('description').value, this.user['uid']],
          objectToUpdate: this.peopleForm.value
        }).then(res => {
          window.location.replace('http://localhost:4200/main/dashboard');

          this._snackbar.open('Perfil cadastrado. Bem vindo.', '', {
            duration: 4000
          });

          return true;
        });
      }
    });
  }

  onCompaniesFormSubmit = () => {
    console.log(this.clientModuleForm.get('description').value, this.user['uid']);
    console.log(this.companiesForm.value);

    this._crud.update({
      collectionsAndDocs: [this.clientModuleForm.get('description').value, this.user['uid']],
      objectToUpdate: this.companiesForm.value
    }).catch(err => {
      console.log(err);
      return false;
    }).then(res => {
      this._snackbar.open('Perfil cadastrado. Bem vindo.', '', {
        duration: 4000
      });

      this._router.navigate(['/main']);
    });
  }
}
