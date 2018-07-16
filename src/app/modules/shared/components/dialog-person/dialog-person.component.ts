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
  ValidateCpf
} from '../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-dialog-person',
  templateUrl: './dialog-person.component.html',
  styleUrls: ['./dialog-person.component.css']
})
export class DialogPersonComponent implements OnInit {
  // Common properties: start
  public personForm: FormGroup;
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
  private cpfToSearch: any;
  private cpfToSearchCheck: any;
  public contactsObject: any;
  public contacts: any;
  public documentsObject: any;
  public documents: any;
  public formEnabled: boolean;
  public formMessage: string;
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
    public dialogRef: MatDialogRef<DialogPersonComponent>,
  ) {}

  ngOnInit() {
    this.personForm = new FormGroup({
      cpf: new FormControl(null, [Validators.required, ValidateCpf]),
      name: new FormControl(null, Validators.required),
      gender: new FormControl(null),
      birthday: new FormControl(null),
    });

    this.cpfToSearchCheck = null;

    if (!this._strategicData.userData$) {
      this._strategicData.setUserData()
      .then(userData => {
        this.userData = userData;
      });
    } else {
      this.userData = this._strategicData.userData$;
    }

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.addressesObject = [];
    this.contactsObject = [];
    this.documentsObject = [];
    this.relationshipsObject = [];

    this.formEnabled = false;
    this.formMessage = null;

    this.isStarted = false;
    this.isDisabled = false;

    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };

    this.clientFormInit();
  }

  clientFormInit = () => {
    console.log(this.data);
    if (this.data.id) {
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar pessoa';
      this.submitButton = 'Atualizar';

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id
          ]
        }).subscribe(res => {
          this.personForm.patchValue(res[0]);

          this.isStarted = true;
        });

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id,
            'userPeopleDocuments',
            0
          ]
        }).subscribe(res => {
          if (res[0] && res[0]['documentsToParse']) {
            this.documentsObject = JSON.parse(res[0]['documentsToParse']);
          }
        });

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id,
            'userPeopleContacts',
            0
          ]
        }).subscribe(res => {
          if (res[0] && res[0]['contactsToParse']) {
            this.contactsObject = JSON.parse(res[0]['contactsToParse']);
          }
        });

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id,
            'userPeopleAddresses',
            0
          ]
        }).subscribe(res => {
          if (res[0] && res[0]['addressesToParse']) {
            this.addressesObject = JSON.parse(res[0]['addressesToParse']);
          }
        });

      this._crud
        .readWithObservable({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id,
            'userPeopleRelationships',
            0
          ]
        }).subscribe(res => {
          if (res[0] && res[0]['relationshipsToParse']) {
            this.relationshipsObject = JSON.parse(res[0]['relationshipsToParse']);
          }
        });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar pessoa';
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
      height: '320px',
      width: '800px',
      data: {
        mask: this.mask
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactsObject.forEach(element => {
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
        autoCorrectedDatePipe: this.autoCorrectedDatePipe,
        _userType: 'people'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentsObject.forEach(element => {
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
        relationships: this.relationships
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.relationshipsObject.forEach(element => {
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

  checkPersonExistence = (cpf) => {
    if (!this.personForm.get('cpf').errors) {
      this.cpfToSearch =  cpf.replace(/.-/, '');

      if ((this.cpfToSearch.length > 10) && (this.cpfToSearch !== this.cpfToSearchCheck)) {
        this._crud
        .readWithPromise({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople'
          ],
          where: [
            ['cpf', '==', cpf]
          ]
        })
        .then(cpfRes => {
          // IF non existent person THEN enable form
          if (!cpfRes[0]) {
            this.formEnabled = true;
            this.formMessage = null;
          } else {
            this.formEnabled = false;
            this.formMessage = 'Já existe uma pessoa cadastrada com este CPF';
          }

          this.cpfToSearchCheck = this.cpfToSearch;
        });
      }
      // Check existence of peopleRelated by cpf, first on sessionStorage, then,
      // if there are at least 400 peopleRelated in the sesionStorage (populated on crm.guard || cash-flow.guard)
      // and none of then are related to the cpf, look on firestore peopleRelated collection
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onPersonFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id
          ],
          objectToUpdate: this.personForm.value
        });

      this._crud
        .update({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople',
            this.data.id,
            'userPeopleDocuments',
            0
          ],
          objectToUpdate: {
            documentsToParse: JSON.stringify(this.documentsObject)
          }
        });

        this._crud
          .update({
            collectionsAndDocs: [
              this.userData[0]['_userType'],
              this.userData[0]['_id'],
              'userPeople',
              this.data.id,
              'userPeopleContacts',
              0
            ],
            objectToUpdate: {
              contactsToParse: JSON.stringify(this.contactsObject)
            }
          });

          this._crud
          .update({
            collectionsAndDocs: [
              this.userData[0]['_userType'],
              this.userData[0]['_id'],
              'userPeople',
              this.data.id,
              'userPeopleAddresses',
              0
            ],
            objectToUpdate: {
              addressesToParse: JSON.stringify(this.addressesObject)
            }
          });

          this._crud
          .update({
            collectionsAndDocs: [
              this.userData[0]['_userType'],
              this.userData[0]['_id'],
              'userPeople',
              this.data.id,
              'userPeopleRelationships',
              0
            ],
            objectToUpdate: {
              relationshipsToParse: JSON.stringify(this.relationshipsObject)
            }
          });
    }

    if (this.submitToCreate) {
      this._crud
        .create({
          collectionsAndDocs: [
            this.userData[0]['_userType'],
            this.userData[0]['_id'],
            'userPeople'
          ],
          objectToCreate: this.personForm.value
        }).then(res => {
          this._crud
            .update({
              collectionsAndDocs: [
                this.userData[0]['_userType'],
                this.userData[0]['_id'],
                'userPeople',
                res['id'],
                'userPeopleAddresses',
                0
              ],
              objectToUpdate: {
                documentsToParse: JSON.stringify(this.addressesObject)
              }
            });

          this._crud
            .update({
              collectionsAndDocs: [
                this.userData[0]['_userType'],
                this.userData[0]['_id'],
                'userPeople',
                res['id'],
                'userPeopleDocuments',
                0
              ],
              objectToUpdate: {
                documentsToParse: JSON.stringify(this.documentsObject)
              }
            });

          this._crud
            .update({
              collectionsAndDocs: [
                this.userData[0]['_userType'],
                this.userData[0]['_id'],
                'userPeople',
                res['id'],
                'userPeopleContacts',
                0
              ],
              objectToUpdate: {
                contactsToParse: JSON.stringify(this.contactsObject)
              }
            });

            this._crud
            .update({
              collectionsAndDocs: [
                this.userData[0]['_userType'],
                this.userData[0]['_id'],
                'userPeople',
                res['id'],
                'userPeopleContacts',
                0
              ],
              objectToUpdate: {
                contactsToParse: JSON.stringify(this.contactsObject)
              }
            });

            this._crud
            .update({
              collectionsAndDocs: [
                this.userData[0]['_userType'],
                this.userData[0]['_id'],
                'userPeople',
                res['id'],
                'userPeopleRelationships',
                0
              ],
              objectToUpdate: {
                relationshipsToParse: JSON.stringify(this.relationshipsObject)
              }
            });

          formDirective.resetForm();

          this._snackbar.open('Cadastro feito com sucesso', '', {
            duration: 4000
          });
        });
    }
  }
}

