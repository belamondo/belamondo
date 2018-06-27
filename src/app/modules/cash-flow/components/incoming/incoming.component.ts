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
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

/**
 * Components
 */
import { DialogIncomingComponent } from './../dialog-incoming/dialog-incoming.component';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.css']
})
export class IncomingComponent implements OnInit {
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
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userIncoming']
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
            tooltip: 'Adicionar entrada'
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
          field: 'date',
          header: 'Data',
          sort: 'sort'
        }, {
          field: 'receiver',
          header: 'Cliente',
          sort: 'sort'
        }],
        actionIcon: [{
          icon: 'edit',
          tooltip: 'Editar entrada'
        }]
      },
      checkBox: true,
      footer: {  }
    };

    this.isStarted = true;
  }

  openIncomingDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogIncomingComponent, {
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
      this.openIncomingDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openIncomingDialog(e.data['_id']);
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
