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
import { DialogClientModuleComponent } from './../dialog-client-module/dialog-client-module.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-client-module',
  templateUrl: './client-module.component.html',
  styleUrls: ['./client-module.component.css']
})
export class ClientModuleComponent implements OnInit {
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
      collectionsAndDocs: ['modulesPermissions']
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
            tooltip: 'Adicionar módulo a cliente'
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
          field: '_id',
          header: 'ID',
          sort: 'sort'
        }, {
          field: 'modules',
          header: 'Módulos'
        }, {
          field: 'status',
          header: 'Status'
        }],
        actionIcon: [{
          icon: 'edit',
          tooltip: 'Editar módulo de cliente'
        }]
      },
      checkBox: true,
      footer: {  }
    };

    this.isStarted = true;
  }

  openClientModuleDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogClientModuleComponent, {
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
      this.openClientModuleDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openClientModuleDialog(e.data['_id']);
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
