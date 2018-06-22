import {
  DeleteConfirmComponent
} from './../delete-confirm/delete-confirm.component';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialog,
  MatPaginator,
  MatTableDataSource,
} from '@angular/material';
import {
  Router
} from '@angular/router';


/**
 * Services
 */
import {
  CrudService
} from './../../services/firebase/crud.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {
  @Input('params')
  params: any;
  @Output()
  changeTable: EventEmitter<any>;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  public currentPage: number;
  public dataSource: any;
  public dataTemp: any;
  public lastPage: number;
  public numberOfLines: any;
  public tableFooterForm: FormGroup;
  public tableSearchForm: FormGroup;

  constructor(
    private _router: Router
  ) {
    this.changeTable = new EventEmitter<any>();
  }

  ngOnInit() {
    this.tableFooterForm = new FormGroup({
      numberOfLines: new FormControl(null)
    });

    this.tableSearchForm = new FormGroup({
      search: new FormControl(null)
    });

    if (this.params.footer) {
      if (!this.params.footer.numberOfLines) {
        this.params.footer.numberOfLines = ['1', '5', '10', '20', '50'];
      }
    }

    if (!this.params.list.dataTotalLength) {
      this.params.list.dataTotalLength = this.params.list.dataSource.length;
    }

    if (!this.params.list.limit) {
      this.params.list.limit = 5;
    }

    if (!this.params.list.page) {
      this.currentPage = 1;
    }

    this.dataTemp = this.params.list.dataSource;

    this.lastPage = Math.ceil(this.params.list.dataTotalLength / this.params.list.limit);
    this.setLimitOverPage(this.currentPage);
  }

  onTableDataOutput = (event, data) => {
    let object;

    object = {
      icon: event.srcElement.innerText,
      data: data
    };

    this.changeTable.emit(object);
  }

  setLimit = () => {
    this.params.list.limit = this.tableFooterForm.value.numberOfLines;

    this.setLimitOverPage(1);
  }

  setLimitOverPage = (page) => {
    this.dataSource = this.dataTemp.slice(this.params.list.limit * (page - 1), (this.params.list.limit * page));

    this.lastPage = Math.ceil(this.dataTemp.length / this.params.list.limit);

    this.currentPage = page;
  }

  // Search over all object properties
  searchOverAll = () => {
    this.dataTemp = [];

    if (!this.tableSearchForm.value.search && this.tableSearchForm.value.search === '') {
      this.dataTemp = this.params.list.dataSource;
      this.lastPage = Math.ceil(this.params.list.dataTotalLength / this.params.list.limit);
      this.setLimitOverPage(1);
      return false;
    }

    this.params.list.dataSource.forEach(object => {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          if (object[key]) {
            if (object[key].match(new RegExp(this.tableSearchForm.value.search, 'gi'))) {
              this.dataTemp.push(object);
              break;
            }
          }
        }
      }
    });

    this.lastPage = Math.ceil(this.dataTemp.length / this.params.list.limit);

    this.setLimitOverPage(1);
  }

  // Search over specific properties
  searchOverProperties = (propertiesArray) => {
    if (!this.tableSearchForm.value.search && this.tableSearchForm.value.search === '') {
      this.dataTemp = this.params.list.dataSource;
      this.lastPage = Math.ceil(this.params.list.dataTotalLength / this.params.list.limit);
      this.setLimitOverPage(1);
      return false;
    }

    let objectToBreak = {};
    this.params.list.dataSource.forEach(object => { // looping over array of objects
      propertiesArray.forEach(property => { // looping over properties chosen by user to make the filter
        for (const key in object) {
        // looping over keys in each object from array of objects
          if ((property === key) && (object !== objectToBreak)) {// After pushing an object to dataTemp, break the loop over it
            if (object.hasOwnProperty(key)) {
              if (object[key].match(new RegExp(this.tableSearchForm.value.search, 'gi'))) {
                this.dataTemp.push(object);
                objectToBreak = object;
              }
            }
          }
        }
      });
    });

    this.lastPage = Math.ceil(this.dataTemp.length / this.params.list.limit);

    this.setLimitOverPage(1);
  }

  sort = (event, index) => {
    console.log(event, index);
    this.params.list.dataSource.forEach((object, objectI) => {// looping over array of objects
      for (const key in object) { // looping over keys in each object from array of objects
        if (key === this.params.list.show[index].field) {
          if (this.dataTemp[0][key] > object[key]) {
            let temp;
            temp = this.dataTemp[0];
            this.dataTemp[0] = object;
            this.dataTemp[objectI] = temp;
            break;
          } else {
            if ((objectI > 0) && (this.dataTemp[objectI - 1][key] > object[key])) {
              let temp;
              temp = this.dataTemp[objectI - 1][key];
              this.dataTemp[objectI - 1] = object;
              this.dataTemp[objectI] = temp;
              break;
            }
          }
        }
      }
    });
  }
}
