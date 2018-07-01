/**
 * Documentação - instruções
 *
 * Passo 01: Insira no html a tag <app-additional-field [params]="paramsToAdditionalField"
 * (changeAdditionalField)="onOutputFromAdditionalField($event)"></app-additional-field>
 * Passo 02: Declare o parametro paramsToAdditionalField como public no ts | Ex.: public paramsToAdditionalField: any
 * Passo 03: Inicialize o parametro paramsToAdditionalField como um objeto com uma array (fields) vazia no ngOnInit | Ex.: { fields:[] }
 * Passo 04: Crie o método onOutputFromAdditionalField() no ts para adicionar, alterar e remover o formControl no formGroup
 */
import {
  Component,
  Inject,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

@Component({
  selector: 'app-additional-field',
  templateUrl: './additional-field.component.html',
  styleUrls: ['./additional-field.component.css']
})
export class AdditionalFieldComponent implements OnInit {
  @Input('params')
  params: any;

  @Output()
  changeAdditionalField: EventEmitter<any>;

  // Common properties: start
  public fields: any = [];
  // Common properties: end

  constructor(
    public dialog: MatDialog,
  ) {
    this.changeAdditionalField = new EventEmitter<any>();
  }

  ngOnInit() {
    /* Get fields from input */
    this.fields = this.params.fields;
  }

  /* Method to open dialog and add a additional field */
  addField = () => {
    const dialogRef = this.dialog.open(SubDialogComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.expenseForm.addControl(result, new FormControl(null));
        const object = {
          method: 'add',
          value: result
        };

        this.changeAdditionalField.emit(object);

        this.fields.push(result);
      }
    });
  }

  /* Method to set the additional field */
  setAdditionalField = (index, field, value) => {
    const object = {
      method: 'change',
      index: index,
      field: field,
      value: value
    };

    this.changeAdditionalField.emit(object);
  }

  /* Method to remove a additional field */
  removeField = (index, value) => {
    const object = {
      method: 'remove',
      index: index,
      value: value
    };

    this.fields.splice(index, 1);
    this.changeAdditionalField.emit(object);
  }

}

/**
 * Sub Dialog
 */
@Component({
  selector: 'app-subdialog',
  templateUrl: './subdialog.html',
})
export class SubDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
