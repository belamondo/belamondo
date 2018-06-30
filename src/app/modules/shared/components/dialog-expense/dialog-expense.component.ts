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
import { ActivatedRoute } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../services/strategic-data.service';

@Component({
  selector: 'app-dialog-expense',
  templateUrl: './dialog-expense.component.html',
  styleUrls: ['./dialog-expense.component.css']
})
export class DialogExpenseComponent implements OnInit {

  // Common properties: start
  public expenseForm: FormGroup;
  public isStarted: boolean;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public fields: any = [];
  public userData: any;
  public paramsToAdditionalField: any;
  // Common properties: end

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.userData = this._strategicData.userData$;

    this.expenseForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required)
    });

    this.expenseFormInit();

    /* Create a list of additional fields */
    this.paramsToAdditionalField = {
      fields: ['teste', 'testando']
    };
  }

  expenseFormInit = () => {
    if (this.data.id) {
      this.paramToSearch = this.data.id;
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar tipo de despesa';
      this.submitButton = 'Atualizar';

      const param = this.paramToSearch.replace(':', '');

      this._crud.readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'expensesTypes', param],
      }).subscribe(expensesTypes => {
        this.expenseForm.patchValue(expensesTypes[0]);

        /* Check if has additionals fields */
        if (Object.keys(expensesTypes[0]).length > 2) {
          // tslint:disable-next-line:forin
          for (const key in expensesTypes[0]) {
            /* Create form control if it is a additional field */
            if (key !== 'name' && key !== 'type' && key !== '_id') {
              this.expenseForm.addControl(key, new FormControl(expensesTypes[0][key]));
              this.fields.push(key);
            }
          }
        }

        this.isStarted = true;
      });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar tipo de despesa';
      this.submitButton = 'Cadastrar';

      this.isStarted = true;
    }
  }

  onExpenseFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'expensesTypes', this.paramToSearch.replace(':', '')],
          objectToUpdate: this.expenseForm.value
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
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'expensesTypes'],
        objectToCreate: this.expenseForm.value
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
    const dialogRef = this.dialog.open(SubDialogExpenseComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.expenseForm.removeControl(this.fields[index]);
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
export class SubDialogExpenseComponent {

  constructor(
    public dialogRef: MatDialogRef<SubDialogExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
