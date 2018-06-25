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
  // Common properties: end

  constructor(
    private _dialog: MatDialog,
    private _crud: CrudService,
    public _strategicData: StrategicDataService,
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
        this.makeList();
      })
    }
  }

  makeList = () => {
    /* Get products types from database */
    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products'],
    }).subscribe(res => {
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
              tooltip: 'Excluir selecionados'
            },
          ]
        },
        list: {
          dataSource: res,
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
      e.data.forEach(element => {
        if (element['checked']) {
          console.log(element);
        }
      });
    }
  }

  openProductDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogProductComponent, {
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
