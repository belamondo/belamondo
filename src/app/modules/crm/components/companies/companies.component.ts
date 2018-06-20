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

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  public isStarted: boolean;
  public paramsToTableData: any;
  public userData: any;

  public userCompanies: any;

  constructor(
    private _crud: CrudService,
    private _dialog: MatDialog,
    public _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    this.isStarted = false;

    this._crud.read({
      collectionsAndDocs: [this.userData[0]['userType'], this.userData[0]['_id'], 'userCompanies'],
    }).then(res => {
      this.userCompanies = res;

      this.makeList();
    });
  }

  makeList = () => {
    this.paramsToTableData = {
      header: {
        actionIcon: [{
          icon: 'add',
          description: 'Adicionar',
          tooltip: 'Adicionar nova empresa'
        }]
      },
      list: {
        dataSource: this.userCompanies,
        show: [{
          field: 'cnpj',
          header: 'CNPJ'
        }, {
          field: 'business_name',
          header: 'Nome',
          sort: 'sort'
        }],
        actionIcon: [{
          icon: 'edit',
          tooltip: 'Editar empresa'
        }]
      },
      footer: {
      }
    };

    this.isStarted = true;
  }

  onOutputFromTableData = (e) => {
    if (e.icon === 'add' || e.icon === 'Adicionar') {
      this.openCompanyDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openCompanyDialog(e.data['_id']);
    }
  }

  openCompanyDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogCompanyComponent, {
      data: {
        isCRM: true,
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
