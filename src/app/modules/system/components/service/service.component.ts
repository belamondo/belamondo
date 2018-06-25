import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  // Common properties: start
  public serviceForm: FormGroup;
  public isStarted: boolean;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public fields: any = [];
  public userData: any;
  // Common properties: end

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    this.serviceForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.serviceFormInit();
  }

  serviceFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar serviço';
        this.submitButton = 'Atualizar';

        let param;
        param = this.paramToSearch.replace(':', '');

        this._crud.readWithObservable({
          collectionsAndDocs: [this.userData[0]['_data']['_userType'], this.userData[0]['_id'], 'services', param],
        }).subscribe(res => {
          this.serviceForm.patchValue(res[0]['_data']);

          /* Check if has additionals fields */
          if (Object.keys(res[0]['_data']).length > 1) {
            for (const key in res[0]['_data']) {
              /* Create form control if it is a additional field */
              if (key !== 'name') {
                this.serviceForm.addControl(key, new FormControl(res[0]['_data'][key]));
                this.fields.push(key);
              }
            }
          }

          this.isStarted = true;
        });

      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = 'Cadastrar cliente';
        this.submitButton = 'Cadastrar';

        this.isStarted = true;
      }
    });
  }

  onServiceFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [
            this.userData[0]['_data']['_userType'],
            this.userData[0]['_id'], 'services',
            this.paramToSearch.replace(':', '')
          ],
          objectToUpdate: this.serviceForm.value
        }).then(res => {
          formDirective.resetForm();
          this.fields = [];

          this._snackbar.open('Atualização feita com sucesso', '', {
            duration: 4000
          });
        });
    }

    if (this.submitToCreate) {
      this._crud
      .create({
        collectionsAndDocs: [
          this.userData[0]['_data']['_userType'],
          this.userData[0]['_id'],
          'services'
        ],
        objectToCreate: this.serviceForm.value
      }).then(res => {
        formDirective.resetForm();
        this.fields = [];

        this._snackbar.open('Cadastro feito com sucesso', '', {
          duration: 4000
        });
      });
    }
  }

  addField = () => {
    let dialogRef;
    dialogRef = this.dialog.open(DialogFormServiceComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.serviceForm.removeControl(this.fields[index]);
    this.fields.splice(index, 1);
  }

}

/**
 * Dialog
 */
@Component({
  selector: 'dialog-form',
  templateUrl: './dialog-form.html',
})
export class DialogFormServiceComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFormServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
