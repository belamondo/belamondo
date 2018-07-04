import { element } from 'protractor';
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
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

/**
 * Components
 */
import { DialogPaymentComponent } from './../dialog-payment/dialog-payment.component';

/**
 * Rxjs
 */
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';
import { StrategicDataService } from './../../../shared/services/strategic-data.service';

@Component({
  selector: 'app-dialog-incoming',
  templateUrl: './dialog-incoming.component.html',
  styleUrls: ['./dialog-incoming.component.css']
})
export class DialogIncomingComponent implements OnInit {
  // Common properties: start
  public incomingForm: FormGroup;
  public isStarted: boolean;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public fields: any = [];
  public userData: any;
  public paramsToTableData: any;
  // Common properties: end

  public discountOverTotal: number;
  public filteredCompanies: Observable<any[]>;
  public filteredPeople: Observable<any[]>;
  public filteredProducts: Observable<any[]>;
  public filteredServices: Observable<any[]>;
  public companies: any;
  public people: any;
  public products: any;
  public services: any;

  public price: number;
  public priceTotal: number;
  public sellingObject: any;
  public startSelling: boolean;
  public lastPrice: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _crud: CrudService,
    public _dialog: MatDialog,
    public _snackbar: MatSnackBar,
    private _strategicData: StrategicDataService,
  ) { }

  ngOnInit() {
    this.incomingForm = new FormGroup({
      clientType: new FormControl(null, Validators.required),
      sellingType: new FormControl(null, Validators.required),
      company: new FormControl(null),
      person: new FormControl(null),
      quantity: new FormControl(null),
      lost_quantity: new FormControl(null),
      price: new FormControl(null),
      payment: new FormControl(null),
      payment_quantity: new FormControl(null),
      product: new FormControl(null),
      service: new FormControl(null),
      date: new FormControl(null),
    });

    this.sellingObject = [];
    this.startSelling = false;

    // Autocomplete on ngOnInit: start
    this.filteredCompanies = this.incomingForm.get('company').valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this._companiesFilter(val) : [])
      );

    this.filteredPeople = this.incomingForm.get('person').valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this._peopleFilter(val) : [])
      );

    this.filteredProducts = this.incomingForm.get('product').valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this._productsFilter(val) : [])
      );

    this.filteredServices = this.incomingForm.get('service').valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this._servicesFilter(val) : [])
      );

    this.companies = [];
    this.people = [];
    this.products = [];
    this.services = [];
    // Autocomplete on ngOnInit: end

    if (this._strategicData.userData$) {
      this.userData = this._strategicData.userData$;

      this.incomingFormInit();
    } else {
      this._strategicData
      .setUserData()
      .then(userData => {
        this.userData = userData;

        this.incomingFormInit();
      });
    }
  }

  // Autocomplete: start
  private _companiesFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let checkObjectIndex, tempObject;
    checkObjectIndex = null;
    tempObject = [];

    for (let index = 0; index < this.companies.length; index++) {
      for (const key in this.companies[index]) {
        if (this.companies[index].hasOwnProperty(key)) {
          const e = this.companies[index][key];
          if (e.toLowerCase().includes(filterValue) && (index !== checkObjectIndex)) {
            tempObject.push(this.companies[index]);
            checkObjectIndex = index;
          }
        }
      }
    }

    return tempObject;
  }

  displayCompany = (company) => {
    return company ? company.business_name + ' - ' + company.cnpj : undefined;
  }

  private _peopleFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let checkObjectIndex, tempObject;
    checkObjectIndex = null;
    tempObject = [];

    for (let index = 0; index < this.people.length; index++) {
      for (const key in this.people[index]) {
        if (this.people[index].hasOwnProperty(key)) {
          const e = this.people[index][key];
          if (e.toLowerCase().includes(filterValue) && (index !== checkObjectIndex)) {
            tempObject.push(this.people[index]);
            checkObjectIndex = index;
          }
        }
      }
    }

    return tempObject;
  }

  displayPerson = (person) => {
    return person ? person.name + ' - ' + person.cpf : undefined;
  }

  private _productsFilter = (value: string): string[] => {
    const filterValue = value.toLowerCase();
    let checkObjectIndex, tempObject;
    checkObjectIndex = null;
    tempObject = [];

    for (let index = 0; index < this.products.length; index++) {
      for (const key in this.products[index]) {
        if (this.products[index].hasOwnProperty(key)) {
          const e = this.products[index][key];

          if (typeof e === 'string') {
            if (e.toLowerCase().includes(filterValue) && (index !== checkObjectIndex)) {
              tempObject.push(this.products[index]);
              checkObjectIndex = index;
            }
          }
        }
      }
    }

    return tempObject;
  }

  displayProduct = (product) => {
    return product ? null : undefined;
  }

  private _servicesFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let checkObjectIndex, tempObject;
    checkObjectIndex = null;
    tempObject = [];

    for (let index = 0; index < this.services.length; index++) {
      for (const key in this.services[index]) {
        if (this.services[index].hasOwnProperty(key)) {
          const e = this.services[index][key];
          if (e.toLowerCase().includes(filterValue) && (index !== checkObjectIndex)) {
            tempObject.push(this.services[index]);
            checkObjectIndex = index;
          }
        }
      }
    }

    return tempObject;
  }

  displayService = (service) => {
    return service ? null : undefined;
  }
  // Autocomplete: end

  onClientChoice = (event) => {
    if (event.value && event.value === 'counter') {

    }
    this.startSelling = true;
  }

  onSelling = (event) => {
    this.sellingObject.push(event.option.value);
    this.sellingObject[this.sellingObject.length - 1]['quantity'] = 1;
    this.sellingObject[this.sellingObject.length - 1]['discount'] = 0;

    this.setTotalPrice();
  }

  incomingFormInit = () => {
    if (this.data.id) {
      this.paramToSearch = this.data.id;
      this.submitToCreate = false;
      this.submitToUpdate = true;
      this.title = 'Atualizar venda';
      this.submitButton = 'Atualizar';

      const param = this.paramToSearch.replace(':', '');

      this._crud.readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings', param],
      }).subscribe(res => {
        this.incomingForm.patchValue(res[0]);

        /* Check if has additionals fields */
        if (Object.keys(res[0]).length > 2) {
          // tslint:disable-next-line:forin
          for (const key in res[0]) {
            /* Create form control if it is a additional field */
            if (key !== 'name' && key !== 'barcode' && key !== 'unit' && key !== '_id') {
              this.incomingForm.addControl(key, new FormControl(res[0][key]));
              this.fields.push(key);
            }
          }
        }
      });
    } else {
      this.submitToCreate = true;
      this.submitToUpdate = false;
      this.title = 'Cadastrar venda';
      this.submitButton = 'Salvar';
    }

    this.setClients();
    this.setProducts();
    this.setServices();
  }

  onIncomingFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings', this.data.id],
          objectToUpdate: this.incomingForm.value
        }).then(() => {
          this._dialog.closeAll();
          this.fields = [];

          this._snackbar.open('Atualização feita com sucesso', '', {
            duration: 4000
          });
        });
    }

    if (this.submitToCreate) {
      this._crud
      .create({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'incomings'],
        objectToCreate: this.incomingForm.value
      }).then(() => {
        formDirective.resetForm();
        this.fields = [];

        this._snackbar.open('Cadastro feito com sucesso', '', {
          duration: 4000
        });
      });
    }
  }

  // addField = () => {
  //   const dialogRef = this.dialog.open(SubDialogIncomingComponent, {
  //     height: '250px',
  //     width: '600px',
  //     data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.incomingForm.addControl(result, new FormControl(null));
  //       this.fields.push(result);
  //     }
  //   });
  // }

  onPayment = () => {
    if (this.data.id) {
      this._dialog.open(DialogPaymentComponent, {
        width: '90%',
        data: {
          id: this.data.id
        }
      });
    } else {
      this._dialog.open(DialogPaymentComponent, {
        width: '90%',
        data: {
        }
      });
    }
  }

  removeField = (index) => {
    this.incomingForm.removeControl(this.fields[index]);
    this.fields.splice(index, 1);
  }

  removeItemFromObject = (index) => {
    this.sellingObject.splice(index, 1);
    this.setTotalPrice();
  }

  setClients = () => {
    this._crud
    .readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userPeople']
    }).subscribe(people => {
      if (people.length > 0) {
        this.people = people;
      }
      this._crud
      .readWithObservable({
        collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'userCompanies']
      }).subscribe(companies => {
        if (companies.length > 0) {
          this.companies = companies;
        }

        this.isStarted = true;
      });
    });

  }

  setDiscountOverTotal = (discountOverTotal) => {
    this.discountOverTotal = discountOverTotal;

    this.setTotalPrice();
  }

  setProducts = () => {
    this._crud
    .readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'products']
    }).subscribe(products => {
      if (products.length > 0) {
        this.products = products;
      }
    });
  }

  setServices = () => {
    this._crud
    .readWithObservable({
      collectionsAndDocs: [this.userData[0]['_userType'], this.userData[0]['_id'], 'services']
    }).subscribe(services => {
      if (services.length > 0) {
        this.services = services;
      }
    });
  }

  setQuantityAndDiscountToSellingObject = (index, quantity, discount) => {
    this.sellingObject[index]['quantity'] = quantity;
    this.sellingObject[index]['discount'] = discount;

    this.setTotalPrice();
  }

  setTotalPrice = () => {
    this.lastPrice = 0;

    this.sellingObject.map(e => {
      // tslint:disable-next-line:max-line-length
      this.lastPrice += (e.quantity * (e.price ? e.price : 0)) * (1 - (e.discount / 100));
    });

    if (this.discountOverTotal) {
      this.lastPrice = this.lastPrice * (1 - (this.discountOverTotal / 100));
    }

    this.lastPrice = Math.round(this.lastPrice * 100) / 100;
  }
}
