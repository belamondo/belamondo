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
  FormControl
} from '@angular/forms';
import {
  MatPaginator,
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

  @Input('source')
  source: any;

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
  public allChecked: Boolean = false;

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
      this.params.list.dataTotalLength = this.source.length;
    }

    if (!this.params.list.limit) {
      this.params.list.limit = 5;
    }

    if (!this.params.list.page) {
      this.currentPage = 1;
    }

    this.dataTemp = this.source;

    this.lastPage = Math.ceil(this.params.list.dataTotalLength / this.params.list.limit);
    this.setLimitOverPage(this.currentPage);
  }

  checkRow = (index, check) => {
    if (index > -1) { /* Check a specific row */
      const i = ((this.currentPage - 1) * parseInt(this.params.list.limit, 10)) + index;
      this.dataTemp[i]['checked'] = check;

      this.dataSource = this.dataTemp.slice(this.params.list.limit * (this.currentPage - 1), (this.params.list.limit * this.currentPage));
      this.lastPage = Math.ceil(this.dataTemp.length / this.params.list.limit);
      this.currentPage = this.currentPage;

      /* Check master if all checkbox was selected or not selected */
      let count = 0;
      this.dataTemp.map((element, x) => {
        if (
          x >= ((this.currentPage - 1) * parseInt(this.params.list.limit, 10)) &&
          x < ((this.currentPage - 1) * parseInt(this.params.list.limit, 10) + parseInt(this.params.list.limit, 10)) &&
          element.checked
        ) {
          count++;
        }
      });
      if (count === this.dataSource.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }

    } else { /* Check all rows */
      this.allChecked = check;
      this.dataTemp.map((element, i) => {
        element.checked = check;
      });
    }

    /* Enable button */
    if (check) { /* Enable */
      if (this.dataSource.length > 0) {
        this.params.header.actionIcon.map(element => {
          for (const key in element) {
            /* Enable button */
            if (key === 'disabled') {
              element.disabled = false;
            }
          }
        });
      }
    } else { /* Disable */
      /* Check if all rows are not selected */
      let hasElementChecked = false;
      if (this.dataSource !== undefined) {
        this.dataSource.map((element, x) => {
          if (element.checked) {
            hasElementChecked = true;
          }
        });
        if (!hasElementChecked) {
          /* Disable button */
          this.params.header.actionIcon.map(element => {
            for (const key in element) {
              if (key === 'disabled') {
                element.disabled = true;
              }
            }
          });
        }
      }
    }
  }

  onTableDataOutput = (event, data, icon) => {
    let object;

    object = {
      icon: icon,
      data: data
    };

    this.changeTable.emit(object);
  }

  setLimit = () => {
    this.params.list.limit = this.tableFooterForm.value.numberOfLines;

    this.setLimitOverPage(1);
  }

  setLimitOverPage = (page) => {
    /* Clear checkbox */
    this.allChecked = false;
    this.checkRow(-1, false);

    this.dataSource = this.dataTemp.slice(this.params.list.limit * (page - 1), (this.params.list.limit * page));

    this.lastPage = Math.ceil(this.dataTemp.length / this.params.list.limit);

    this.currentPage = page;
  }

  // Search over all object properties
  searchOverAll = () => {
    this.dataTemp = [];

    if (!this.tableSearchForm.value.search && this.tableSearchForm.value.search === '') {
      this.dataTemp = this.source;
      this.lastPage = Math.ceil(this.params.list.dataTotalLength / this.params.list.limit);
      this.setLimitOverPage(1);
      return false;
    }

    this.source.forEach(object => {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          if (object[key] && typeof object[key] === 'string') {
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
      this.dataTemp = this.source;
      this.lastPage = Math.ceil(this.params.list.dataTotalLength / this.params.list.limit);
      this.setLimitOverPage(1);
      return false;
    }

    let objectToBreak = {};
    this.source.forEach(object => { // looping over array of objects
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

  sort = (field) => {

    /* Check if array is alread sorted */
    let isSorted = true;
    for (let i = 0; i < this.dataTemp.length; i++) {
      if (
        this.dataTemp[i + 1] !== undefined &&
        this.dataTemp[i][field].localeCompare(this.dataTemp[i + 1][field]) === 1
      ) {
        isSorted = false;
        break;
      }
    }

    if (!isSorted) { /* Sort */
      this.dataTemp.sort((a, b) => {
        return a[field].localeCompare(b[field]);
      });
    } else { /* Reverse Sort */
      this.dataTemp.sort((a, b) => {
        return b[field].localeCompare(a[field]);
      });
    }

    this.setLimitOverPage(this.currentPage);
  }
}
