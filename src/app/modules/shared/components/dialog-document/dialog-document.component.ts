import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

/**
 * Services
 */
import { CrudService } from './../../services/firebase/crud.service';

/**
 * Third party
 */
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { StrategicDataService } from '../../services/strategic-data.service';

@Component({
  selector: 'app-dialog-document',
  templateUrl: './dialog-document.component.html',
  styleUrls: ['./dialog-document.component.css']
})
export class DialogDocumentComponent implements OnInit {
  public autoCorrectedDatePipe: any;
  public documentForm: FormGroup;
  public documentMask: string;
  public documents: any;
  public isStarted: boolean;
  public mask: any;
  private userData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _strategicData: StrategicDataService,
  ) {
  }

  ngOnInit() {
    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
    this.isStarted = false;

    this._crud
    .readWithObservable({
      collectionsAndDocs: [
        'documents'
      ],
      where: [
        ['type', '==', this.data['_userType']]
      ]
    }).subscribe(documents => {
      this.documents = documents;

      this.isStarted = true;
    });

    this.documentForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required),
      makingDate: new FormControl(null),
      validityDate: new FormControl(null),
    });

    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    };
  }

  documentNameToMask = () => {
    switch (this.documentForm.value.type) {
      case 'CNPJ (Cadastro Nacional da Pessoa Jurídica)':
        this.documentMask = 'cnpj';
        break;

      default:
        console.log('Nenhuma máscara para este documento');
        break;
    }
  }
}
