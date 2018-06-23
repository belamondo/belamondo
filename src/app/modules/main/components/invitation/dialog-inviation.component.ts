import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

/**
 * Services
 */
import { CrudService } from '../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-dialog-inviation',
  templateUrl: './dialog-inviation.component.html',
  styleUrls: ['./dialog-inviation.component.css']
})
export class DialogInviationComponent implements OnInit {
  public invitationForm: FormGroup;
  public invitations: any;
  public mask: any;
  public userData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
  ) {
    console.log(this.data)
  }

  ngOnInit() {
    this.invitationForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    })
    this.invitations = this.data.invitations;
  }

  onInvitationFormSubmit = (formDirective: FormGroupDirective) => {
    if(this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;
      })
    }

    if(this.userData) {
      this._crud
        .create({
          collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userInvitations'],
          objectToCreate: this.invitationForm.value
        }).then(res => {
          formDirective.resetForm();
  
          this._snackbar.open('Convite feito com sucesso', '', {
            duration: 4000
          });
        });
    }
  }
}
