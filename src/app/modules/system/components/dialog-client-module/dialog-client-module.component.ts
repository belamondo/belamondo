import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDatepickerIntl, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

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
import { ValidateRequired } from '../../../shared/validators/required.validator';

@Component({
  selector: 'app-dialog-client-module',
  templateUrl: './dialog-client-module.component.html',
  styleUrls: ['./dialog-client-module.component.css']
})
export class DialogClientModuleComponent implements OnInit {
  // Common properties: start
  public companiesForm: FormGroup;
  public clientModuleForm: FormGroup;
  public peopleForm: FormGroup;
  public isDisabled: boolean;
  public isStarted: boolean;
  public mask: any;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public userData: any;
  // Common properties: end

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
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      cnpj: new FormControl(null, [ValidateRequired, ValidateCnpj]),
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

  clientModuleFormInit = () => {
    if (this.data.id) {
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar módulo de cliente';
      this.submitButton = 'Atualizar';

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            'modulesPermissions',
            this.userData[0]['_id'],
            this.data.id
          ]
        }).subscribe(res => {
          this.clientModuleForm.patchValue(res[0]);

          this.isStarted = true;
        });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar módulo de cliente';
      this.submitButton = 'Cadastrar';

      this.isStarted = true;
    }
  }

  cnpjExistence = () => {
    let cnpj;

    cnpj = this.companiesForm.value.cnpj.replace(/[^\d]+/g, '');

    if (!this.companiesForm.get('cnpj').errors && cnpj.length === 14) { console.log(156);
      this._crud.readWithPromise({
        collectionsAndDocs: ['companies'],
        where: [['cnpj', '==', this.companiesForm.value.cnpj]]
      }).then(res => {
        console.log(res[0]);
      });
    }
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
