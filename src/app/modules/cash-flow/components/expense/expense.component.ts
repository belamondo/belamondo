import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialog,
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

/**
 * Components
 */
import { DialogExpenseComponent } from '../../../shared/components/dialog-expense/dialog-expense.component';

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
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.makeList();
  }

  makeList = () => {
    /* Get expenses types from database */
    this._crud.read({
      collectionsAndDocs: [this.userData[0]['userType'], this.userData[0]['_id'], 'expensesTypes'],
    }).then(res => {

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
          dataSource: res,
          show: [{
            field: 'name',
            header: 'Despesa',
            sort: 'sort'
          }],
          actionIcon: [{
            icon: 'edit',
            tooltip: 'Editar despesa'
          }]
        },
        checkBox: true,
        footer: {  }
      };

      this.isStarted = true;
    });
  }

  onOutputFromTableData = (e) => {
    if (e.icon.substr(0, 3) === 'add' || e.icon === 'Adicionar') {
      this.openExpenseDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openExpenseDialog(e.data['_id']);
    }

    if (e.icon === 'delete' || e.icon === 'Excluir') {
      e.data.forEach(element => {
        if (element['checked']) {
          console.log(element);
        }
      });
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
