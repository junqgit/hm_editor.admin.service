import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'quality-params',
  templateUrl: './quality.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class QualityParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() saveHospitalParams;
  @Input() selectParamType;
  @Input() vertifyNumber;
  @Input() paramBean;
  @Input() msgs;
  processConfig :any[];
  statusList:any[] =[] ;
  disabledAutoSaveEditoInput: boolean = true;
  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  saveAutoSaveParams() {
    if (this.paramBean['书写自动保存']['时间间隔'] < 1) {
      this.paramBean['书写自动保存']['时间间隔'] = 1;
    }
    this.disabledAutoSaveEditoInput = true;
    this.saveHospitalParams();
  }

  /**
 * 质控定时器
 * @param event
 */
  saveQcTimer(event) {
    if (!event || (event && event.checked)) {
      if (null == this.paramBean['质控定时器']['areaCode'] || '' == this.paramBean['质控定时器']['areaCode']) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', detail: '请填写完整质控定时器配置参数' });
        return;
      }
    }
    this.saveHospitalParams();
  }


  configPro(d) {
    if (d['type'] == 'require') {
      return;
    }
    if (d['type'] == 'del') {
      d['type'] = '';
      return;
    }
    d['type'] = 'del';
  }

  saveProConfig() {
    //let pro = {'FIRST':this.processConfig[0]['code']};
    let len = this.processConfig.length;
    let pro = {};
    let validPos = 0;
    let delPro = {};
    for (let i = 0; i < len; i++) {
      let curPro = this.processConfig[i];
      pro[curPro['code']] = [];
      let preValid = validPos;
      while (curPro['type'] == 'del' && preValid < i) {
        pro[this.processConfig[preValid]['code']].push(curPro['code']);
        preValid++;
      }
      if (curPro['type'] != 'del') {
        validPos = i;
      } else {
        delPro[curPro['code']] = true;
      }

    }

    pro['屏蔽流程'] = delPro;
    this.paramBean['质控流程配置'] = pro;
    this.saveHospitalParams();

  }
} 