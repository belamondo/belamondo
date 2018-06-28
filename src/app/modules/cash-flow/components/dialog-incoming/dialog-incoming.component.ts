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
import { StrategicDataService } from './../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-dialog-incoming',
  templateUrl: './dialog-incoming.component.html',
  styleUrls: ['./dialog-incoming.component.css']
})
export class DialogIncomingComponent implements OnInit {
  // Common properties: start
  public incomingForm: FormGroup;
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

  public products: any;
  public services: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _snackbar: MatSnackBar,
    private _strategicData: StrategicDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.incomingForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      receiver: new FormControl(null),
      quantity: new FormControl(null),
      lost_quantity: new FormControl(null),
      price: new FormControl(null),
      payment: new FormControl(null),
      payment_quantity: new FormControl(null),
      product: new FormControl(null),
      service: new FormControl(null),
      date: new FormControl(null),

    });

    this.products = [];
    this.services = [];

    if (this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;

      this.incomingFormInit();
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;

        this.incomingFormInit();
      });
    }
  }

  incomingFormInit = () => {
    if (this.data.id) {
      this.paramToSearch = this.data.id;
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar entrada';
      this.submitButton = 'Atualizar';

      const param = this.paramToSearch.replace(':', '');

      this._crud.readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings', param],
      }).subscribe(res => {
        this.incomingForm.patchValue(res[0]);

        /* Check if has additionals fields */
        if (Object.keys(res[0]).length > 2) {
          // tslint:disable-next-line:forin
          for (const key in res[0]) {
            /* Create form control if it is a additional field */
            if (key !== 'name' && key !== 'barcode' && key !== 'unit' && key !== '_id') {
              this.incomingForm.addControl(key, new FormControl(res[0][key]));
              this.fields.push(key);
            }
          }
        }

        this.isStarted = true;
      });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar entrada';
      this.submitButton = 'Cadastrar';

      this.isStarted = true;
    }
    
    this.setProducts();
    this.setServices();
  }

  onIncomingFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings', this.data.id],
          objectToUpdate: this.incomingForm.value
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
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings'],
        objectToCreate: this.incomingForm.value
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
    const dialogRef = this.dialog.open(SubDialogIncomingComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.incomingForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.incomingForm.removeControl(this.fields[index]);
    this.fields.splice(index, 1);
  }

  setProducts = () => { console.log(180)
    this._crud
    .readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products']
    }).subscribe(products => { console.log(products)
      if (products.length > 0) {
        this.products.push(products);
        console.log(this.products);
      }
    });
  }

  setServices = () => {
    this._crud
    .readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'services']
    }).subscribe(services => { console.log(services)
      if (services.length > 0) {
        this.services.push(services);
        console.log(this.services);
      }
    });
  }
}
