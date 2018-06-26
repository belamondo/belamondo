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
//import { DialogCompanyComponent } from '../../../shared/components/dialog-company/dialog-company.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from '../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-incoming-outcoming',
  templateUrl: './incoming-outcoming.component.html',
  styleUrls: ['./incoming-outcoming.component.css']
})
export class IncomingOutcomingComponent implements OnInit {
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
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'inAndOut']
    }).subscribe(res => {
      console.log(res)
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
            tooltip: 'Adicionar nova conta'
          },
          {
            icon: 'delete',
            description: 'Excluir',
            tooltip: 'Excluir selecionados'
          },
        ]
      },
      list: {
        show: [{
          field: 'cnpj',
          header: 'CNPJ'
        }, {
          field: 'business_name',
          header: 'Empresa',
          sort: 'sort'
        }],
        actionIcon: [{
          icon: 'edit',
          tooltip: 'Editar conta'
        }]
      },
      checkBox: true,
      footer: {  }
    };

    this.isStarted = true;
  }

  openCompanyDialog = (idIfUpdate) => {
    let dialogRef;
    dialogRef = this._dialog.open(DialogCompanyComponent, {
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
      this.openCompanyDialog(undefined);
    }

    if (e.icon === 'edit') {
      this.openCompanyDialog(e.data['_id']);
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

// import {
//   Component,
//   OnInit,
//   Inject,
//   ViewChild
// } from '@angular/core';
// import {
//   FormGroup,
//   FormControl,
//   Validators,
//   FormGroupDirective
// } from '@angular/forms';
// import {
//   MatDialog,
//   MatDialogRef,
//   MAT_DIALOG_DATA,
//   MatSnackBar
// } from '@angular/material';
// import { ActivatedRoute, Router } from '@angular/router';

// /**
//  * Services
//  */
// import { CrudService } from './../../../shared/services/firebase/crud.service';
// import { StrategicDataService } from '../../../shared/services/strategic-data.service';

// /**
//  * Third party
//  */
// import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

// import { Observable } from 'rxjs';
// import {map, startWith} from 'rxjs/operators';

// @Component({
//   selector: 'app-incoming-outcoming',
//   templateUrl: './incoming-outcoming.component.html',
//   styleUrls: ['./incoming-outcoming.component.css']
// })
// export class IncomingOutcomingComponent implements OnInit {

//   // Common properties: start
//   public incomingOutcomingForm: FormGroup;
//   public isStarted: boolean;
//   public mask: any;
//   public paramToSearch: any;
//   public submitButton: string;
//   public submitToCreate: boolean;
//   public submitToUpdate: boolean;
//   public title: string;
//   public fields: any = [];
//   public types: any = [];
//   public typesServ: any = [];
//   public receivers: any = [];
//   public userData: any;

//   public outcomingsTypes: any = [];
//   public incomingsTypes01: any = [];
//   public incomingsTypes02: any = [];
//   public inAndOut: any = { arrayOfOutcoming: [], arrayOfIncoming: [] };
//   public monthAndYear: string;
//   public indexOfRegister: number;
//   // Common properties: end

//   public autoCorrectedDatePipe: any;

//   constructor(
//     private _crud: CrudService,
//     private _route: ActivatedRoute,
//     private _router: Router,
//     public _snackbar: MatSnackBar,
//     public _strategicData: StrategicDataService,
//     public dialog: MatDialog
//   ) { }

//   ngOnInit() {
//     if (this._strategicData.userData$) {
//       this.userData = this._strategicData.userData$;
//       this.setData();
//     } else {
//       this._strategicData
//       .setUserData()
//       .then(userData => {
//         this.userData = userData;

//         this.setData();
//       });
//     }

//     /* Mock - start */
//     this.receivers = [
//       { name: 'Papelaria Joarez' },
//       { name: 'IFAL' },
//       { name: 'Cliente balcão' },
//     ];
//     /* Mock - end */

//     this.incomingOutcomingForm = new FormGroup({
//       modality: new FormControl(null, Validators.required),
//       type: new FormControl(null, Validators.required),
//       receiver: new FormControl(null),
//       qtd: new FormControl(null),
//       lostQtd: new FormControl(null),
//       price: new FormControl(null, Validators.required),
//       payment: new FormControl(null, Validators.required),
//       paymentQtd: new FormControl(null),
//       date: new FormControl(null, Validators.required),
//     });

//     this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
//     this.monthAndYear = (this.getMonthAndYear(new Date()).year).toString() + (this.getMonthAndYear(new Date()).month).toString();

//     this.mask = {
//       cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ],
//       date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
//       zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
//       phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
//       cell_phone: ['(', /\d/, /\d/, ')', ' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
//       cnpj: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
//     };
//   }

//   setData = () => {
//     /* Get expenses types from database */
//     this._crud.readWithObservable({
//       collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'expensesTypes'],
//     }).subscribe(expensesTypes => {
//       this.outcomingsTypes = expensesTypes;
//     });

//     /* Get products and services from database */
//     this._crud.readWithObservable({
//       collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products'],
//     }).subscribe(products => {
//       this.incomingsTypes01 = products;
//     });

//     /* Get services from database */
//     this._crud.readWithObservable({
//       collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'services'],
//     }).subscribe(services => {
//       this.incomingsTypes02 = services;
//     });

//     /* Get incomings and outcomings of the actual month from database */
//     this._crud.readWithObservable({
//       collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'inAndOut', '201806']  // TODO: pegar ano e mês atual
//     }).subscribe(inAndOut => {
//       if (inAndOut[0] !== undefined) {
//         this.inAndOut = {
//           arrayOfOutcoming: inAndOut[0]['arrayOfOutcoming'],
//           arrayOfIncoming: inAndOut[0]['arrayOfIncoming']
//         };
//       }
//     });

//     this.incomingOutcomingFormInit();
//   }

//   incomingOutcomingFormInit = () => {
//     this._route.params.subscribe(params => {

//       if (params.id) {
//         this.paramToSearch = params.id;
//         this.submitToCreate = false;
//         this.submitToUpdate = true;
//         this.title = 'Atualizar lançamento';
//         this.submitButton = 'Atualizar';

//         let param, paramId, paramModality, paramArrayIndex;

//         param = this.paramToSearch.replace(':', '');
//         paramId = param.substring(0, param.indexOf('-'));
//         paramModality = param.substring((param.indexOf('-') + 1), (param.indexOf('-') + 2));
//         paramArrayIndex = param.substring((param.indexOf('-') + 2), param.lenght);

//         /* Get index to update if necessary */
//         this.indexOfRegister = paramArrayIndex;

//         this._crud.readWithObservable({
//           collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'inAndOut', paramId],
//         }).subscribe(inAndOut => {

//           let modality;
//           if (paramModality === 'i') {
//             modality = 'arrayOfIncoming';
//             this.getListOfTypes('incoming');
//           } else {
//             modality = 'arrayOfOutcoming';
//             this.getListOfTypes('outcoming');
//           }

//           this.incomingOutcomingForm.patchValue(inAndOut[0]['_data'][modality][paramArrayIndex]);

//           /* Check if has additionals fields */
//           if (Object.keys(inAndOut[0]['_data'][modality][paramArrayIndex]).length > 9) {
//             for (const key in inAndOut[0]['_data'][modality][paramArrayIndex]) {
//               /* Create form control if it is a additional field */
//               if (key !== 'modality' && key !== 'type' &&
//               key !== 'receiver' &&
//               key !== 'qtd' &&
//               key !== 'lostQtd' &&
//               key !== 'price' &&
//               key !== 'payment' &&
//               key !== 'paymentQtd' &&
//               key !== 'date') {
//                 this.incomingOutcomingForm.addControl(key, new FormControl(inAndOut[0]['_data'][modality][paramArrayIndex][key]));
//                 this.fields.push(key);
//               }
//             }
//           }

//           this.isStarted = true;
//         });

//       } else {
//         this.submitToCreate = true;
//         this.submitToUpdate = false;
//         this.title = 'Cadastrar lançamento';
//         this.submitButton = 'Cadastrar';

//         this.isStarted = true;
//       }
//     });
//   }

//   onIncomingOutcomingFormSubmit = (formDirective: FormGroupDirective) => {
//     if (this.submitToUpdate) {
//       /* Set the object to update in database */
//       if (this.incomingOutcomingForm.controls['modality'].value === 'outcoming') {
//         this.inAndOut['arrayOfOutcoming'][this.indexOfRegister] = this.incomingOutcomingForm.value;
//       } else {
//         this.inAndOut['arrayOfIncoming'][this.indexOfRegister] = this.incomingOutcomingForm.value;
//       }

//       this._crud
//       .update({
//         collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'inAndOut', this.monthAndYear],
//         objectToUpdate: this.inAndOut
//       }).then(res => {
//         formDirective.resetForm();
//         this.fields = [];

//         this._snackbar.open('Atualização feita com sucesso', '', {
//           duration: 4000
//         });
//       });
//     }

//     if (this.submitToCreate) {
//       /* Set the object to update in database */
//       if (this.incomingOutcomingForm.controls['modality'].value === 'outcoming') {
//         this.inAndOut['arrayOfOutcoming'].push(this.incomingOutcomingForm.value);
//       } else {
//         this.inAndOut['arrayOfIncoming'].push(this.incomingOutcomingForm.value);
//       }

//       this._crud
//       .update({
//         collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'inAndOut', '201806'], // TODO: pegar ano e mês atual
//         objectToUpdate: this.inAndOut
//       }).then(res => {
//         formDirective.resetForm();
//         this.fields = [];

//         this._snackbar.open('Cadastro feito com sucesso', '', {
//           duration: 4000
//         });
//       });
//     }
//   }

//   getListOfTypes = (value) => {
//     if (value === 'outcoming') {
//       this.types = this.outcomingsTypes;
//       this.typesServ = [];
//     } else if (value === 'incoming') {
//       this.types = this.incomingsTypes01;
//       this.typesServ = this.incomingsTypes02;
//     }
//   }

//   getMonthAndYear = (date) => {
//     let finalDate;
//     finalDate = new Date(date);

//     return {
//       month: (finalDate.getMonth() + 1),
//       year: finalDate.getFullYear()
//     };
//   }

//   addField = () => {
//     let dialogRef;
//     dialogRef = this.dialog.open(DialogFormIncomingOutcomingComponent, {
//       height: '250px',
//       width: '600px',
//       data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.incomingOutcomingForm.addControl(result, new FormControl(null));
//         this.fields.push(result);
//       }
//     });
//   }

//   removeField = (index) => {
//     this.incomingOutcomingForm.removeControl(this.fields[index]);
//     this.fields.splice(index, 1);
//   }

// }

// /**
//  * Dialog
//  */
// @Component({
//   selector: 'dialog-form',
//   templateUrl: './dialog-form.html',
// })

// export class DialogFormIncomingOutcomingComponent {

//   constructor(
//     public dialogRef: MatDialogRef<DialogFormIncomingOutcomingComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
