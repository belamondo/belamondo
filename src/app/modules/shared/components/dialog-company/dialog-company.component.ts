import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

/**
 * Components
 */
import {
  DialogAddressComponent
} from '../../../shared/components/dialog-address/dialog-address.component';
import {
  DialogContactComponent
} from '../../../shared/components/dialog-contact/dialog-contact.component';
import {
  DialogDocumentComponent
} from '../../../shared/components/dialog-document/dialog-document.component';
import {
  DialogRelationshipComponent
} from '../../../shared/components/dialog-relationship/dialog-relationship.component';

/**
 * Services
 */
import {
  CrudService
} from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../services/strategic-data.service';

/**
 * Third party
 */
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import {
  Observable
} from 'rxjs';
import {
  map,
  startWith
} from 'rxjs/operators';

/**
 * Validators
 */
import {
  ValidateCnpj
} from '../../../shared/validators/cnpj.validator';
import {
  ValidateCpf
} from '../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-dialog-company',
  templateUrl: './dialog-company.component.html',
  styleUrls: ['./dialog-company.component.css']
})
export class DialogCompanyComponent implements OnInit {
  // Common properties: start
  public companyForm: FormGroup;
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
  public relationships: any;
  public relationshipsObject: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
    public dialogRef: MatDialogRef<DialogCompanyComponent>,
  ) {}

  ngOnInit() {
    this.companyForm = new FormGroup({
      cnpj: new FormControl(null, [Validators.required, ValidateCnpj]),
      business_name: new FormControl(null, Validators.required),
      company_name: new FormControl(null)
    });

    this.userData = this._strategicData.userData$;

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.addressesObject = [];

    this.documentsObject = [];

    this.contactsObject = [];

    this.relationshipsObject = [];

    this.isStarted = false;
    this.isDisabled = false;

    this.mask = {
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };

    this.clientFormInit();
  }

  clientFormInit = () => {
    if (this.data.id) {
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar empresa';
      this.submitButton = 'Atualizar';

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            this.userData[0]['userType'],
            this.userData[0]['_id'],
            'userCompanies',
            this.data.id
          ]
        }).subscribe(res => {
          this.companyForm.patchValue(res[0]);

          this.isStarted = true;
        });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar empresa';
      this.submitButton = 'Cadastrar';

      this.isStarted = true;
    }
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

  addRelationship = () => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogRelationshipComponent, {
      height: '320px',
      width: '800px',
      data: {
        relationships: this.relationships,
        mask: this.mask,
        autoCorrectedDatePipe: this.autoCorrectedDatePipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.relationships.forEach(element => {
          if (element.mask === result.type) {
            result.type = element.name;
          }
        });

        this.relationshipsObject.push(result);
      }
    });
  }

  deleteRelationship = (i) => {
    this.relationshipsObject.splice(i, 1);
  }

  checkCompanyExistence = (cnpj) => {
    if (!this.companyForm.get('cnpj').errors) {
      // Check existence of peopleRelated by cpf, first on sessionStorage, then,
      // if there are at least 400 peopleRelated in the sesionStorage (populated on crm.guard || cash-flow.guard)
      // and none of then are related to the cpf, look on firestore peopleRelated collection
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCompanyFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: ['clientsPeople', this.paramToSearch.replace(':', '')],
          objectToUpdate: this.companyForm.value
        });

      if (this.documentsObject.length > 0) {
        this._crud
          .update({
            collectionsAndDocs: ['clientsPeople', this.paramToSearch.replace(':', '')],
            objectToUpdate: JSON.stringify(this.documentsObject)
          });
      }

      if (this.contactsObject.length > 0) {
        this._crud
          .update({
            collectionsAndDocs: ['clientsPeopleContacts', this.paramToSearch.replace(':', '')],
            objectToUpdate: JSON.stringify(this.contactsObject)
          });
      }

      if (this.addressesObject.length > 0) {
        this._crud
          .update({
            collectionsAndDocs: 'clientsPeopleAddresses',
            whereId: this.paramToSearch.id,
            objectToUpdate: {
              addressesToParse: JSON.stringify(this.addressesObject)
            }
          });
      }
    }

    if (this.submitToCreate) {
      this._crud
        .create({
          collectionsAndDocs: [
            this.userData[0]['userType'],
            this.userData[0]['_id'],
            'userCompanies'
          ],
          objectToCreate: this.companyForm.value
        }).then(res => {
          if (this.documentsObject.length > 0) {
            this._crud
              .create({
                collectionsAndDocs: [
                  this.userData[0]['userType'],
                  this.userData[0]['_id'],
                  'userCompanies',
                  res['id'],
                  'userCompaniesDocuments'
                ],
                objectToCreate: {
                  documentsToParse: JSON.stringify(this.documentsObject)
                }
              });
          }

          if (this.contactsObject.length > 0) {
            this._crud
              .create({
                collectionsAndDocs: [
                  this.userData[0]['userType'],
                  this.userData[0]['_id'],
                  'userCompanies',
                  res['id'],
                  'userCompaniesContacts'
                ],
                objectToCreate: {
                  contactsToParse: JSON.stringify(this.contactsObject)
                }
              });
          }

          if (this.addressesObject.length > 0) {
            this._crud
              .create({
                collectionsAndDocs: [
                  this.userData[0]['userType'],
                  this.userData[0]['_id'],
                  'userCompanies',
                  res['id'],
                  'userCompaniesAddresses'
                ],
                objectToCreate: {
                  addressesToParse: JSON.stringify(this.addressesObject)
                }
              });
          }

          formDirective.resetForm();

          this._snackbar.open('Cadastro feito com sucesso', '', {
            duration: 4000
          });
        });
    }
  }
}
