import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'nursing-params',
  templateUrl: './nursing.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class NursingParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() selectParamType;
  @Input() paramBean;
  signEntryPageArr = [];
  todoReminderList = [];//当前设置的待办事项
  nursingTemplateMaps:any[] = [];
  nursingFieldSignDictMaps:any[] = [];
  signEntryPageOption = [
    {label: '请选择', value: -1},
    {label: '10', value: 10},
    {label: '20', value: 20},
    {label: '30', value: 30},
    {label: '100', value: 100},
    {label: '300', value: 300},
    {label: '500', value: 500},
    {label: '1000', value: 1000}
  ];
  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  addTemplateMapping() {
    if (!this.nursingTemplateMaps) {
      this.nursingTemplateMaps = [];
    }
    this.nursingTemplateMaps.push({ "name": "", "blankHeadMapping": "", "fieldMapping": "" });
    this.paramBean['是否使用httpPrinter打印']['httpPrinter模板字段映射'] = this.nursingTemplateMaps;
  }

  removeTemplateMapping(index) {
    this.nursingTemplateMaps.splice(index, 1);
    this.paramBean['是否使用httpPrinter打印']['httpPrinter模板字段映射'] = this.nursingTemplateMaps;
  }

  addTodoReminderType() {
    this.todoReminderList.push({ "reminderType": "", "reminderTypeDetail": "" });
  }

  removeTodoReminderType(index) {
    this.todoReminderList.splice(index, 1);
  }

  addSignEntryPage() {
    this.signEntryPageArr.push({ name: "", pageNum: -1 });
  }

  removeSignEntryPage(index) {
    this.signEntryPageArr.splice(index, 1);
  }

  addFieldAndSignCodeMapping() {
    if (!this.nursingFieldSignDictMaps) {
      this.nursingFieldSignDictMaps = [];
    }
    this.nursingFieldSignDictMaps.push({ "name": "", "fieldMapping": "" });
  }

  removeFieldAndSignCodeMapping(index) {
    this.nursingFieldSignDictMaps.splice(index, 1);
  }
}