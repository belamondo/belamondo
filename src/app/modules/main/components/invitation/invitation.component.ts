import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  AUTOCOMPLETE_OPTION_HEIGHT
} from '@angular/material';

/**
 * Components
 */
import { DialogInviationComponent } from './dialog-inviation.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {
  public isStarted: boolean;
  public paramsToTableData: any;
  public userData: any;

  public userInvitations: any;

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

        this.setInvitations();
      });
    } else {
      this.userData = this._strategicData.userData$;

      this.setInvitations();
    }
  }

  makeList = () => {
    this.paramsToTableData = {
      header: {
        actionIcon: [{
          icon: 'add',
          description: 'Adicionar',
          tooltip: 'Fazer novo convite'
        }]
      },
      list: {
        dataSource: this.userInvitations,
        show: [{
          field: 'email',
          header: 'E-mail',
          sort: 'sort'
        }]
      },
      footer: {
      }
    };

    this.isStarted = true;
  }

  setInvitations = () => {
    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userInvitations'],
    }).subscribe(userInvitations => {
      this.userInvitations = userInvitations;

      this.makeList();
    });
  }

  onOutputFromTableData = (e) => { console.log(e)
    if (e.icon === 'add' || e.icon === 'Adicionar') {
      this.openInvitationDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openInvitationDialog(e.data['_id']);
    }
  }

  openInvitationDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogInviationComponent, {
      width: '90%',
      maxHeight: '90%',
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
