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
 * Rxjs
 */
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from './../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-dialog-payment',
  templateUrl: './dialog-payment.component.html',
  styleUrls: ['./dialog-payment.component.css']
})
export class DialogPaymentComponent implements OnInit {
  // Common properties: start
  public paymentForm: FormGroup;
  public isDisabled: boolean;
  public isStarted: boolean;
  public objectToSubmit: any;
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
    public _dialog: MatDialog,
    public _snackbar: MatSnackBar,
    private _strategicData: StrategicDataService,
  ) { }


  ngOnInit() {
    this.paymentForm = new FormGroup({
      clientType: new FormControl(null, Validators.required),
      sellingType: new FormControl(null),
      company: new FormControl(null),
      person: new FormControl(null),
      product: new FormControl(null),
      service: new FormControl(null),
    });

    this.isDisabled = false;

    if (this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;

      this.paymentFormInit();
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;

        this.paymentFormInit();
      });
    }
  }

  paymentFormInit = () => {
    if (this.data.id) {
      this.paramToSearch = this.data.id;
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar venda';
      this.submitButton = 'Atualizar';

      this._crud.readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'payments', this.data.id],
      }).subscribe(res => {
      });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar pagamento';
      this.submitButton = 'Salvar';
    }
  }
}
