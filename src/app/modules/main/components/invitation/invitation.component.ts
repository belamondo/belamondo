import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  MatSnackBar
} from '@angular/material';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

/**
 * Services
 */
import {
  CrudService
} from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

import {
  Observable
} from 'rxjs';
import {
  map,
  startWith
} from 'rxjs/operators';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {

  // Common properties: start
  public invitationForm: FormGroup;
  public isStarted: boolean;
  public submitButton: string;
  public title: string;
  public userData: any;
  // Common properties: end

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService,
  ) {}

  ngOnInit() {
    this.userData = this._strategicData.userData$;

    this.invitationForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      type: new FormControl(this.userData[0]['_id'], Validators.required)
    });

    this.invitationFormInit();
  }

  invitationFormInit = () => {
    this.title = 'Convidar novo usuário';
    this.submitButton = 'Convidar';

    this.isStarted = true;
  }

  onInvitationFormSubmit = (formDirective: FormGroupDirective) => {
    this._crud
    .create({
      collectionsAndDocs: [this.userData[0]['userType'], this.userData[0]['_id'], 'invitationsTypes'],
      objectToCreate: this.invitationForm.value
    }).then(res => {
      formDirective.resetForm();

      this._snackbar.open('Cadastro feito com sucesso', '', {
        duration: 4000
      });
    });
  }
}
