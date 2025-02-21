import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'borrow-params',
  templateUrl: './borrow.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class BorrowParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() vertifyNumber;
  @Input() paramBean;
  @Input() selectParamType;
  disabledAutoBackInput: boolean = true;
  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  autoBackEditorClick() {
    if (this.paramBean['借阅归还时限']['启用']) {
      this.disabledAutoBackInput = false;
    }
  }

  //保存解约自动归还时间参数配置
  saveReturnTime() {
    if (isNaN(this.paramBean['借阅归还时限']['期限']) || this.paramBean['借阅归还时限']['期限'] < 1) {
      this.paramBean['借阅归还时限']['期限'] = 1;
    }
    this.disabledAutoBackInput = true;
    this.saveHospitalParams();
  }
}