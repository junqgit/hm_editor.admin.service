import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'system-params',
  templateUrl: './system.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class SystemParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() _showOptionsLabel;
  @Input() saveHospitalParams;
  @Input() selectParamType;
  @Input() paramBean;
  @Input() msgs;
  thirdCatalogs: any[] = [];
  signature: object[] = []
  logoDisabledEditor: boolean = true;
  showLogoCancelBtn: boolean = false;
  showLogoSaveBtn: boolean = false;
  showLogoEditorBtn: boolean = true;
  nurseTypeList = [
    { label: '文字', value: '文字' },
    { label: '图片', value: '图片' }]
  recordTypeList = [
    { label: '请选择', value: '' },
    { label: '文字', value: '文字' },
    { label: '图片', value: '图片' }]
  autoList = [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' }
  ]
  ngOnInit(): void {

  }
  constructor(
    private elementRef: ElementRef,
  ) { }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  addThirdCatalogs() {
    if (!this.thirdCatalogs) {
      this.thirdCatalogs = [];
    }
    this.thirdCatalogs.push({ "name": "", "ip": "", "port": "", "address": '', 'params': [] });
  }

  removeThirdCatalogs(index) {
    this.thirdCatalogs.splice(index, 1);
  }

  showOptionsLabel(list, value) {
    return this._showOptionsLabel(list, value);
  }

  doAddParams(data) {
    data.push({ name: '', address: '' })
  }


  /**
 * 小助手体征
 * @param event
 */
  saveSign(event) {
    if (event.checked || event == "1") {
      if (!this.paramBean['小助手体征']['移动护理接口ip'] || '' == this.paramBean['小助手体征']['移动护理接口ip']
        || !this.paramBean['小助手体征']['移动护理接口port'] || '' == this.paramBean['小助手体征']['移动护理接口port']
        || !this.paramBean['小助手体征']['tokenPath'] || '' == this.paramBean['小助手体征']['tokenPath']
        || !this.paramBean['小助手体征']['signPath'] || '' == this.paramBean['小助手体征']['signPath']) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', detail: '请填写完整移动护理接口配置参数' });
        return;
      }
    }
    this.saveHospitalParams();
  }


  saveCDSSReport() {
    if (!this.paramBean['cdss对接设置']['ip'] || !this.paramBean['cdss对接设置']['ip']) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', detail: '请填写IP和端口' });
      return;
    }
    this.saveHospitalParams();
  }

  tabIcoUploader(event) {
    if (!event.files || !event.files[0]) {
      return;
    }
    var _this = this;
    var reader = new FileReader();
    reader.onload = function (evt) {
      _this.paramBean['系统名称以及LOGO']['页签图标'] = evt.target['result'];
    }
    reader.readAsDataURL(event.files[0]);
  }

  sideLogoUploader(event) {
    if (!event.files || !event.files[0]) {
      return;
    }
    var _this = this;
    var reader = new FileReader();
    reader.onload = function (evt) {
      _this.paramBean['系统名称以及LOGO']['侧栏系统LOGO'] = evt.target['result'];
    }
    reader.readAsDataURL(event.files[0]);
  }

  tapLogoEditorBtn() {
    this.logoDisabledEditor = false;
    this.showLogoEditorBtn = false;
    this.showLogoCancelBtn = true;
    this.showLogoSaveBtn = true;
    const targetDom = this.elementRef.nativeElement.querySelectorAll(".file-upload .ui-widget .ui-button");
    targetDom.forEach(element => {
      element.style.background = "#4297fe";
      element.style.border = "1px solid #4297fe";
    });
  }

  tapLogoCancelBtn() {
    this.logoDisabledEditor = true;
    this.showLogoEditorBtn = true;
    this.showLogoCancelBtn = false;
    this.showLogoSaveBtn = false;
    const targetDom = this.elementRef.nativeElement.querySelectorAll(".file-upload .ui-widget .ui-button");
    targetDom.forEach(element => {
      element.style.background = "#ddd";
      element.style.border = "1px solid #ddd";
    });
  }

  tapLogoSaveBtn() {
    this.tapLogoCancelBtn();
    this.saveHospitalParams();
  }

  watermarkIimg(event) {
    if (!event.files || !event.files[0]) {
      return;
    }
    var _this = this;
    var reader = new FileReader();
    reader.onload = function (evt) {
      _this.paramBean['水印设置']['图片'] = evt.target['result'];
    }
    reader.readAsDataURL(event.files[0]);
  }
}
