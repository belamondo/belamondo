import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

/**
 * Services
 */
import { StrategicDataService } from './../../services/strategic-data.service';

@Component({
  selector: 'app-dialog-contact',
  templateUrl: './dialog-contact.component.html',
  styleUrls: ['./dialog-contact.component.css']
})
export class DialogContactComponent implements OnInit {
  public contactForm: FormGroup;
  public contactMask: string;
  public contacts: any;
  public mask: any;
  public maskValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _strategicData: StrategicDataService
  ) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required)
    });

    this.mask = {
      phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
      cell_phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    };

    if (!this._strategicData.contacts$) {
      this._strategicData
      .setContacts()
      .then(contacts => {
        this.contacts = contacts;
        console.log(this.contacts)
      });
    } else {
      this.contacts = this._strategicData.contacts$;
    }
  }

  contactNameToMask = () => {
    switch (this.contactForm.value.type) {
      case 'Telefone residencial':
        this.contactMask = 'phone';
        break;

      case 'Telefone comercial':
        this.contactMask = 'phone';
        break;

      case 'Celular residencial':
        this.contactMask = 'cell_phone';
        break;

      case 'Celular comercial':
        this.contactMask = 'cell_phone';
        break;

      default:
        console.log('Nenhuma máscara para este contato');
        break;
    }
  }
}
