import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialog,
} from '@angular/material';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

/**
 * Components
 */
import { DialogCompanyComponent } from './../../../shared/components/dialog-company/dialog-company.component';

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
    /* Get products types from database */
    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['userType'], this.userData[0]['_id'], 'userCompanies'],
    }).subscribe(res => {

      this.paramsToTableData = {
        header: {
          actionIcon: [
            {
              icon: 'add',
              description: 'Adicionar',
              tooltip: 'Adicionar novo cliente'
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
          show: [
            {
              field: 'business_name',
              header: 'Nome Fantasia',
              sort: 'sort'
            }, {
              field: 'company_name',
              header: 'Razão Social',
              sort: 'sort'
            }, {
              field: 'cnpj',
              header: 'CNPJ',
              sort: 'sort'
            }
          ],
          actionIcon: [{
            icon: 'edit',
            tooltip: 'Editar produto'
          }]
        },
        checkBox: true,
        footer: {  }
      };

      this.isStarted = true;
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

  openCompanyDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogCompanyComponent, {
      data: {
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
