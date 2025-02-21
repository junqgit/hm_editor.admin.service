import { ConfirmationService } from 'portalface/widgets';
import { SyncConfigServices } from './../sync-config.services';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from 'portalface/services';

@Component({
  selector: 'kyee-diag-mapper',
  templateUrl: './diag-mapper.component.html',
  styleUrls: ['./diag-mapper.component.scss']
})
export class DiagMapperComponent implements OnInit {

  type = '诊断映射';
  @Input() hospitalInfo: any;

  //@Input() allDatasource:any[];
  valueList:any[] = [];
  diagDlg:boolean;

  hosType = '入院';
  inType = '入院';
  diagType = '西医';

  mainFlag = '次诊断';
  valType = '编码';
  
  aggregationFlag = false;
  syncFlag = false;

  selDs:any;

  rowId:string;
  msgs: any[];
  allDsObj={};
  mainFlagVals = [{label:'全部诊断',value:'全部诊断'},{label:'主诊断',value:'主诊断'},{label:'次诊断',value:'次诊断'}];
  constructor(private syncConfigService:SyncConfigServices, private confirmationService: ConfirmationService,private loadingService:LoadingService) { }

  ngOnInit() {
    this.search();
    // this.allDsObj = this.allDatasource.reduce((p,c) => {
    //   p[c['label']] = c['value'];
    //   p[c['value']] = c['label'];
    //   return p;
    // },{})
  }

  search() {
    this.loadingService.loading(true);
    this.syncConfigService.getSyncConifg(this.param()).then(res => {
      this.loadingService.loading(false);
      if (res['code'] == 10000) {
        this.valueList = res['data'] || [];
        //this.showMessage('success','',this.rowId?'修改成功':'新增成功')
        return;
      }
      this.showMessage('error', '', '获取数据失败')
    })
  }
  addDiagMapper(){
    this.aggregationFlag = false;
    this.syncFlag = false;
    this.rowId = '';
    this.selDs = null;
    this.diagDlg = true;
    this.mainFlag = '次诊断';
  }
  editorDiagMapper(d){
    this.rowId = d['_id'];
    this.hosType = d['hosType'];
    this.inType = d['inType'] || '入院';
    this.diagType  = d['diagType'];
    this.mainFlag = d['mainFlag'];
    this.valType  = d['valType'];
    //this.selDs = d['dsCode'];
    this.selDs = {"code":d['dsCode'],"name":d['dsName']};
    this.diagDlg = true;
    this.aggregationFlag = d['aggregationFlag'] || false;
    this.syncFlag = d['syncFlag'] || false;

  }
  confirmMapper(){
    let obj = this.dataParam();
    if (!this.checkData(obj)) {
      return;
    }
    let param = this.param();
    Object.assign(param, obj);
    if (this.rowId) {
      param['_id'] = this.rowId;
    }
    this.syncConfigService.saveSyncConifg(param).then(res => {
      if (res['code'] == 10000) {
        this.valueList = res['data'] || [];
        this.showMessage('success', '', this.rowId ? '修改成功' : '新增成功');
        this.diagDlg = false;
        return;
      }else if(res['code'] == 10006){

        this.showMessage('info', '', res['msg']);
        return;
      }
      this.showMessage('error', '', '保存异常')

    })
  }
  checkData(obj) {

    if (!obj['dsName']) {
      this.showMessage('info', '', '数据元不能为空!')
      return false;
    }
    if(!obj['aggregationFlag'] && obj['mainFlag'] == '全部诊断'){
      this.showMessage('info', '', '诊断标志为全部诊断时，诊断必须聚合');
      return false;
    }
    return true;
  }
  param() {
    return this.syncConfigService.syncConfigBasParam(this.hospitalInfo, this.type);
  }
  dataParam() {
    let dsName = '', dsCode = '';
    if (this.selDs && this.selDs['code'] && this.selDs['name']) {
      dsName = this.selDs['name'];
      dsCode = this.selDs['code'];
    }
    //,'inType':this.hosType == '门诊'?'':this.inType
    return {'dsName': dsName, 'dsCode': dsCode, 'hosType':this.hosType,'mainFlag':this.mainFlag,'diagType':this.diagType,'valType':this.valType,'aggregationFlag':this.aggregationFlag,'syncFlag':this.syncFlag};
  }
  delDiagMapper(data) {
    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除【'+(data['dsName'] || '')+'】配置？',
      accept: () => {
        this.syncConfigService.delSyncConifg(data['_id']).then(res => {
          if (res['code'] == 10000) {
            this.showMessage('success', '', '删除成功');
            this.valueList = this.valueList.filter(d => d['_id'] != data['_id']);
            return;
          }
          this.showMessage('error', '', '删除失败')
        })
      }
    });
  }
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }
}
