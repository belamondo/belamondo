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
import { DialogServiceComponent } from './../../../shared/components/dialog-service/dialog-service.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  // Common properties: start
  public isStarted: boolean;
  public userData: any;
  public paramsToTableData: any;
  // Common properties: end

  constructor(
    private _dialog: MatDialog,
    private _crud: CrudService,
    private _strategicData: StrategicDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if(this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;
      this.makeList();
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;
      })
      this.makeList();
    }
  }

  makeList = () => {
    /* Get products types from database */
    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'services'],
    }).subscribe(res => {
      this.paramsToTableData = {
        header: {
          actionIcon: [
            {
              icon: 'add',
              description: 'Adicionar',
              tooltip: 'Adicionar novo serviço'
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
            header: 'Serviço',
            sort: 'sort'
          }],
          actionIcon: [{
            icon: 'edit',
            tooltip: 'Editar serviço'
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
      this.openServiceDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openServiceDialog(e.data['_id']);
    }

    if (e.icon === 'delete' || e.icon === 'Excluir') {
      e.data.forEach(element => {
        if (element['checked']) {
          console.log(element);
        }
      });
    }
  }

  openServiceDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogServiceComponent, {
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
