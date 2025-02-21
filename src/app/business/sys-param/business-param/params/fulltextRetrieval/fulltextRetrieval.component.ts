import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'fulltextRetrieval-params',
  templateUrl: './fulltextRetrieval.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class fulltextRetrievalParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() paramBean;
  @Input() selectedParam;
  @Input() selectParamType;
  options360 = [{"value":'', "label":'无'},{"value":'his360', "label":'his360页面'},{"value":'集成平台360', "label":'集成平台360页面'}];

  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }
}