import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  FormArray
} from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

/**
 * Rxjs
 */
import {
  Observable
} from 'rxjs';
import {
  startWith,
  map
} from 'rxjs/operators';

/**
 * Services
 */
import {
  CrudService
} from './../../../shared/services/firebase/crud.service';
import {
  StrategicDataService
} from './../../../shared/services/strategic-data.service';

/**
 * Third party
 */

import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

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

  public autoCorrectedDatePipe: any;
  public date: string;
  public mask: any;
  public quotas: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _dialog: MatDialog,
    public _snackbar: MatSnackBar,
    private _strategicData: StrategicDataService,
  ) {}

  ngOnInit() {
    let tempDate;

    tempDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/').split('/');
    this.date = tempDate[2] + '/' + tempDate[1] + '/' + tempDate[0];

    this.paymentForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      amount: new FormControl(this.data.lastPrice, Validators.required),
      date: new FormControl(null),
      quota_number: new FormControl(null),
      is_equal_quota: new FormControl(null),
      quotas: new FormArray([
       new FormControl(null), // value
       new FormControl(null), // date
       new FormControl(null) // quota index
      ])
    });

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
    this.isDisabled = false;
    this.mask = {
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };

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

  onClose = () => {
    this._dialog.closeAll();
  }

  paymentFormInit = () => {
    this.paramToSearch = this.data.id;

    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings', this.data.id],
    }).subscribe(res => {
      this.isStarted = true;
      if (res[0]['payment']) {
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = 'Atualizar pagamento';
        this.submitButton = 'Atualizar';
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = 'Cadastrar pagamento';
        this.submitButton = 'Salvar';
      }
    });
  }

  setQuotasArray = (e) => {
    let quotas;
    this.quotas = [];

    quotas = this.paymentForm.value.quota_number;

    if (!isNaN(e.key)) {
      if (this.paymentForm.value.quota_number) {
        for (let i = 0; i < quotas; i++) {
          let date;
          date = new Date();
          date.setMonth(date.getMonth() + i);
          this.quotas.push({
            value: this.paymentForm.value.amount / quotas,
            quota: i + 1,
            date: date
          });
        }
      }
    }
    // this.quotas = Array(this.paymentForm.value.quota_number).fill(0).map((x, i) => i);
  }
}
