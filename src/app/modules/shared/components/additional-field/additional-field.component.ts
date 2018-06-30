/**
 * Documentação - instruções
 *
 * Passo 01: Insira no html o code <app-additional-field [params]="paramsToAdditionalField"></app-additional-field>
 * Passo 02: Declare o parametro paramsToAdditionalField como public no ts | Ex.: public paramsToAdditionalField: any
 * Passo 03: Inicialize o parametro paramsToAdditionalField como um objeto com uma array (fields) vazia no ngOnInit | Ex.: { fields:[] }
 */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';

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

  constructor() {
    this.changeAdditionalField = new EventEmitter<any>();
  }

  ngOnInit() {
    /* Get fields from input */
    this.fields = this.params.fields;
  }

  /* Method to set the additional field */
  setAdditionalField = (index, value) => {
    const object = {
      method: 'change',
      index: index,
      value: value
    };

    this.changeAdditionalField.emit(object);
  }

  /* Method to remove a additional field */
  removeField = (index) => {
    const object = {
      method: 'remove',
      index: index,
    };

    this.changeAdditionalField.emit(object);
  }

}
