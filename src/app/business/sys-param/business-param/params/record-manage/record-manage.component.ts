import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'record-manage-params',
  templateUrl: './record-manage.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class RecordManageParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() selectParamType;
  @Input() paramBean;
  @Input() vertifyNumber;
  @Input() msgs;
  emrMangeTemplates: any = []; // 病案管理员可编辑病历设置列表
  showContinuePrintSaveBtn:boolean = true;
  emrManageExcelFieldFormat:any[] = [];

  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  /**
* 纸质病案收回
* @param event
*/
  paperFiling(event) {
    if (!this.paramBean['纸质版归档']['归档时限'] || '' == this.paramBean['纸质版归档']['归档时限']) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', detail: '请填写归档时限' });
      return;
    }
    this.saveHospitalParams();
  }

  addEmrManageFieldFormatMapping() {
    if (!this.emrManageExcelFieldFormat) {
      this.emrManageExcelFieldFormat = [];
    }
    this.emrManageExcelFieldFormat.push({ "name": "", "format": "" });
  }
  removeFieldFormatMapping(index) {
    this.emrManageExcelFieldFormat.splice(index, 1);
  }

}
