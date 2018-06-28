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
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

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
  public sourceToTableData: any;
  // Common properties: end

  constructor(
    private _dialog: MatDialog,
    private _crud: CrudService,
    private _strategicData: StrategicDataService
  ) { }

  ngOnInit() {
    if (this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;

      this.setSourceToTableData();
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;

        this.setSourceToTableData();
      });
    }
  }

  setSourceToTableData = () => {
    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'expensesTypes']
    }).subscribe(res => {
      this.sourceToTableData = res;

      this.makeList();
    });
  }

  makeList = () => {
    this.paramsToTableData = {
      header: {
        actionIcon: [
          {
            icon: 'add',
            description: 'Adicionar',
            tooltip: 'Adicionar nova despesa',
          },
          {
            icon: 'delete',
            description: 'Excluir',
            tooltip: 'Excluir selecionados',
            disabled: true,
          },
        ]
      },
      list: {
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
  }

  openExpenseDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogExpenseComponent, {
      data: {
        id: idIfUpdate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isStarted = false;
      this.setSourceToTableData();
    });
  }

  onOutputFromTableData = (e) => {
    if (e.icon === 'add' || e.icon === 'Adicionar') {
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
}
