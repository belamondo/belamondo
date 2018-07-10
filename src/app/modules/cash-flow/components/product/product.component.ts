import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialog,
  MatSnackBar
} from '@angular/material';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

/**
 * Components
 */
import { DialogProductComponent } from './../../../shared/components/dialog-product/dialog-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  // Common properties: start
  public isStarted: boolean;
  public userData: any;
  public paramsToTableData: any;
  public sourceToTableData: any;
  // Common properties: end

  constructor(
    private _dialog: MatDialog,
    private _crud: CrudService,
    public _snackbar: MatSnackBar,
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
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products']
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
            tooltip: 'Adicionar novo produto'
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
          header: 'Produto',
          sort: 'sort'
        }],
        actionIcon: [{
          icon: 'edit',
          tooltip: 'Editar produto'
        }]
      },
      checkBox: true,
      footer: {  }
    };

    this.isStarted = true;
  }

  openProductDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogProductComponent, {
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
      this.openProductDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openProductDialog(e.data['_id']);
    }

    if (e.icon === 'delete' || e.icon === 'Excluir') {
      let countDeletions, item;
      countDeletions = 0;

      e.data.forEach(element => {
        if (element['checked']) {
          this._crud
          .delete({
            collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products', element['_id']]
          }).then(() => {
            countDeletions ++;
            (countDeletions > 1) ? item = ' ítens apagados' : item = ' item apagado';

            this._snackbar.open(countDeletions + item + ' com sucesso', '', {
              duration: 4000
            });
          });
        }
      });
    }
  }
}
