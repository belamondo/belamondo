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

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../services/strategic-data.service';

@Component({
  selector: 'app-dialog-product',
  templateUrl: './dialog-product.component.html',
  styleUrls: ['./dialog-product.component.css']
})
export class DialogProductComponent implements OnInit {

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
  public paramsToTableData: any;
  // Common properties: end

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _snackbar: MatSnackBar,
    private _strategicData: StrategicDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if(this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;
      })
    }

    this.productForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      barcode: new FormControl(null),
      unit: new FormControl(null),
    });

    this.productFormInit();
  }

  productFormInit = () => {
    if (this.data.id) {
      this.paramToSearch = this.data.id;
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar produto';
      this.submitButton = 'Atualizar';

      const param = this.paramToSearch.replace(':', '');

      this._crud.readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products', param],
      }).subscribe(res => {
        this.productForm.patchValue(res[0]);

        /* Check if has additionals fields */
        if (Object.keys(res[0]).length > 2) {
          // tslint:disable-next-line:forin
          for (const key in res[0]) {
            /* Create form control if it is a additional field */
            if (key !== 'name' && key !== 'barcode' && key !== 'unit' && key !== '_id') {
              this.productForm.addControl(key, new FormControl(res[0][key]));
              this.fields.push(key);
            }
          }
        }

        this.isStarted = true;
      });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar produto';
      this.submitButton = 'Cadastrar';

      this.isStarted = true;
    }
  }

  onProductFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products', this.paramToSearch.replace(':', '')],
          objectToUpdate: this.productForm.value
        }).then(() => {
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
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products'],
        objectToCreate: this.productForm.value
      }).then(() => {
        formDirective.resetForm();
        this.fields = [];

        this._snackbar.open('Cadastro feito com sucesso', '', {
          duration: 4000
        });
      });
    }
  }

  addField = () => {
    const dialogRef = this.dialog.open(SubDialogProductComponent, {
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
 * Sub Dialog
 */
@Component({
  selector: 'app-subdialog',
  templateUrl: './subdialog.html',
})
export class SubDialogProductComponent {

  constructor(
    public dialogRef: MatDialogRef<SubDialogProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
