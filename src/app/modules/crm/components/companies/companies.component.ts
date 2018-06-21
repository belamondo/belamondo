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
  public isStarted: boolean;
  public paramsToTableData: any;
  public userData: any;

  public userCompanies: any;

  constructor(
    private _crud: CrudService,
    private _dialog: MatDialog,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
  ) {}

  ngOnInit() {
    this.isStarted = false;

    if (!this._strategicData.userData$) {
      this._strategicData.setUserData()
      .then(userData => {
        this.userData = userData;

        this._crud.readWithObservable({
          collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userCompanies'],
        }).subscribe(userCompanies => {
          this.userCompanies = userCompanies;

          this.makeList();
        });
      });
    } else {
      this.userData = this._strategicData.userData$;

      this._crud.readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userCompanies'],
      }).subscribe(userCompanies => {
        this.userCompanies = userCompanies;

        this.makeList();
      });
    }

  }

  makeList = () => {
    this.paramsToTableData = {
      header: {
        actionIcon: [{
          icon: 'add',
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

    console.log(97);
    this.isStarted = true;
  }

  onOutputFromTableData = (e) => {
    if (e.icon === 'add') {
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
