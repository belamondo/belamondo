import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-relationship',
  templateUrl: './dialog-relationship.component.html',
  styleUrls: ['./dialog-relationship.component.css']
})
export class DialogRelationshipComponent implements OnInit {
  public relationshipForm: FormGroup;
  public isStarted: boolean;

  constructor() { }

  ngOnInit() {
    this.isStarted = true;
    
    this.relationshipForm = new FormGroup({
      relationship: new FormControl(null, Validators.required)
    })
  }

}
