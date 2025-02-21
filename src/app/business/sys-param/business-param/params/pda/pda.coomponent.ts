import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'pda-params',
  templateUrl: './pda.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class PDAParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() paramBean;
  @Input() selectedParam;
  @Input() selectParamType;
  timeOptions = [
    {"value":'2', "label":'2min',WIDGET_DEFAULT:'2min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'5', "label":'5min',WIDGET_DEFAULT:'5min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'10', "label":'10min',WIDGET_DEFAULT:'10min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'15', "label":'15min',WIDGET_DEFAULT:'15min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'20', "label":'20min',WIDGET_DEFAULT:'20min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'25', "label":'25min',WIDGET_DEFAULT:'25min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'30', "label":'30min',WIDGET_DEFAULT:'30min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'35', "label":'35min',WIDGET_DEFAULT:'35min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'40', "label":'40min',WIDGET_DEFAULT:'40min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'45', "label":'45min',WIDGET_DEFAULT:'45min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'50', "label":'50min',WIDGET_DEFAULT:'50min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'55', "label":'55min',WIDGET_DEFAULT:'55min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'60', "label":'60min',WIDGET_DEFAULT:'60min',WIDGET_SHOW_NAME:'黑屏注销'},
    {"value":'无', "label":'无',WIDGET_DEFAULT:'无',WIDGET_SHOW_NAME:'黑屏注销'}];
  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }
}