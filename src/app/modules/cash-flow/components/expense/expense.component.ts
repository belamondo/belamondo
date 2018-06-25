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
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

/**
 * Components
 */
import { DialogExpenseComponent } from '../../../shared/components/dialog-expense/dialog-expense.component';

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  // Common properties: start
  public isStarted: boolean;
  public userData: any;
  public paramsToTableData: any;
  // Common properties: end

  constructor(
    private _dialog: MatDialog,
    private _crud: CrudService,
    private _route: ActivatedRoute,
    public _strategicData: StrategicDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.userData = this._strategicData.userData$;
    this.makeList();
  }

  makeList = () => {
    /* Get expenses types from database */
    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'expensesTypes'],
    }).subscribe(expenseTypes => {
      this.paramsToTableData = {
        header: {
          actionIcon: [
            {
              icon: 'add',
              description: 'Adicionar',
              tooltip: 'Adicionar nova despesa'
            },
            {
              icon: 'delete',
              description: 'Excluir',
              tooltip: 'Excluir selecionados'
            },
          ]
        },
        list: {
          dataSource: expenseTypes,
          show: [{
            field: 'name',
            header: 'Despesa',
          }],
          actionIcon: [{
            icon: 'edit',
            tooltip: 'Editar despesa'
          }]
        },
        footer: {  }
      };

      this.isStarted = true;
    });
  }

  onOutputFromTableData = (e) => {
    if (e.icon === 'add' || e.icon === 'Adicionar') {
      this.openExpenseDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openExpenseDialog(e.data['_id']);
    }
  }

  openExpenseDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogExpenseComponent, {
      data: {
        isExpense: true,
        id: idIfUpdate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

}
