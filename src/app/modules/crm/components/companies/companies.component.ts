import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';

/**
 * Components
 */
import { DialogCompanyComponent } from '../../../shared/components/dialog-company/dialog-company.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
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
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userCompanies']
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
            tooltip: 'Adicionar nova empresa'
          },
          {
            icon: 'delete',
            description: 'Excluir',
            tooltip: 'Excluir selecionados'
          },
        ]
      },
      list: {
        show: [{
          field: 'cnpj',
          header: 'CNPJ'
        }, {
          field: 'business_name',
          header: 'Empresa',
          sort: 'sort'
        }],
        actionIcon: [{
          icon: 'edit',
          tooltip: 'Editar empresa'
        }]
      },
      checkBox: true,
      footer: {  }
    };

    this.isStarted = true;
  }

  openCompanyDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogCompanyComponent, {
      width: '90%',
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
      this.openCompanyDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openCompanyDialog(e.data['_id']);
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
