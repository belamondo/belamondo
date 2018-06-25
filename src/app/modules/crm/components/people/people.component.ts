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
import { DialogPersonComponent } from '../../../shared/components/dialog-person/dialog-person.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  public isStarted: boolean;
  public userData: any;

  constructor(
    private _crud: CrudService,
    private _dialog: MatDialog,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
  ) {}

  ngOnInit() {
    this.userData = this._strategicData.userData$;

    this.isStarted = false;

    this._crud.readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userPeople'],
    }).subscribe(userPeople => {
      this.isStarted = true;
    });
  }

  openPersonDialog = () => {
    let dialogRef;

    dialogRef = this._dialog.open(DialogPersonComponent, {
      width: '99%',
      height: '99%',
      data: {
        isCRM: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}