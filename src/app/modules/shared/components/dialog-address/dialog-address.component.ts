import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
  selector: 'app-dialog-address',
  templateUrl: './dialog-address.component.html',
  styleUrls: ['./dialog-address.component.css']
})
export class DialogAddressComponent implements OnInit {
  public addressForm: FormGroup;
  public mask: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.addressForm = new FormGroup({
      zip: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      district: new FormControl(null, Validators.required),
      number: new FormControl(null),
      complement: new FormControl(null),
      state: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
    });

    this.mask = {
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
    };
  }
}
