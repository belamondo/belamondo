import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  //Common properties: start
  public productForm: FormGroup;
  public isStarted: boolean;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public fields: any = [];
  //Common properties: end

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.productForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      barcode: new FormControl(null),
      unit: new FormControl(null),
    });

    this.productFormInit();
  }

  productFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar produto";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar cliente";
        this.submitButton = "Cadastrar";

        this.isStarted = true;
      }
    })
  }

  onProductFormSubmit = () => {}

  addField = () => {
    let dialogRef = this.dialog.open(DialogFormComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result || result !== ''){
        this.productForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.productForm.removeControl(this.fields[index]);
    this.fields.splice(index, 1);
  }

}

/**
 * Dialog
 */
@Component({
  selector: 'dialog-form',
  templateUrl: './dialog-form.html',
})
export class DialogFormComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}