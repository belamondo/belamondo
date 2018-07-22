import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
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

  public clientType: string;
  public company: any;
  public modules: any;
  public person: any;
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
    this.isStarted = false;
    this.modules = ['Almoxarifado', 'CRM', 'Fluxo de caixa', 'Sistema'];
    this.title = 'Cadastrar módulo de cliente';
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
      company: new FormControl(this.company),
      modules: new FormControl(null, ValidateRequired)
    });

    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };

    this.clientModuleFormInit();
  }

  clientModuleFormInit = () => {
    if (this.data && this.data.id) {
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar módulo de cliente';
      this.submitButton = 'Atualizar';

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            'modulesPermissions',
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

    if (!this.companiesForm.get('cnpj').errors && cnpj.length === 14) {
      console.log(156);
      this._crud.readWithPromise({
        collectionsAndDocs: ['companies'],
        where: [['cnpj', '==', this.companiesForm.value.cnpj]]
      }).then(res => {
        if (res[0] && res[0]['business_name']) {
          this.company = res[0];
        }
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

  onCompaniesFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userCompanies',
            this.data.id
          ],
          objectToUpdate: this.companiesForm.value
        });
    }

    if (this.submitToCreate) {
      this.companiesForm.value.company = this.company;

      this._crud
        .update({
          collectionsAndDocs: [
            'modulesPermissions',
            this.company._id
          ],
          objectToUpdate: this.companiesForm.value,
        }).then(res => {
          this._dialog.closeAll();

          this._snackbar.open('Cadastro feito com sucesso', '', {
            duration: 4000
          });
        });
    }
  }

  // onCompaniesFormSubmit = () => {
  //   this._crud.update({
  //     collectionsAndDocs: ['modulesPermissions', this.company._id, this.clientModuleForm.get('description').value],
  //     objectToUpdate: this.companiesForm.value
  //   }).catch(err => {
  //     console.log(err);
  //     return false;
  //   }).then(res => {
  //     console.log(this.company._id);
  //     this._snackbar.open('Cadastro feito com sucesso.', '', {
  //       duration: 4000
  //     });

  //     this._dialog.closeAll();
  //   });
  // }
}
