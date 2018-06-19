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
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Common properties: start
  public productForm: FormGroup;
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
    public _strategicData: StrategicDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = this._strategicData.userData$;

    this.productForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      barcode: new FormControl(null),
      unit: new FormControl(null),
    });

    this.productFormInit();
  }

  productFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar produto';
        this.submitButton = 'Atualizar';

        let param;
        param = this.paramToSearch.replace(':', '');

        this._crud.readWithObservable({
          collectionsAndDocs: [this.userData[0]['_data']['userType'], this.userData[0]['_id'], 'products', param],
        }).subscribe(res => {
          this.productForm.patchValue(res[0]['_data']);

          /* Check if has additionals fields */
          if (Object.keys(res[0]['_data']).length > 2) {
            for (const key in res[0]['_data']) {
              /* Create form control if it is a additional field */
              if (key !== 'name' && key !== 'barcode' && key !== 'unit') {
                this.productForm.addControl(key, new FormControl(res[0]['_data'][key]));
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

  onProductFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [
            this.userData[0]['_data']['userType'],
            this.userData[0]['_id'],
            'products', this.paramToSearch.replace(':', '')
          ],
          objectToUpdate: this.productForm.value
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
        collectionsAndDocs: [this.userData[0]['_data']['userType'], this.userData[0]['_id'], 'products'],
        objectToCreate: this.productForm.value
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
    dialogRef = this.dialog.open(DialogFormComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.productForm.removeControl(this.fields[index]);
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
export class DialogFormComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
