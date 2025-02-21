import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'record-search-params',
  templateUrl: './record-search.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class RecordSearchParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() selectParamType;
  @Input() paramBean;
  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }
} 