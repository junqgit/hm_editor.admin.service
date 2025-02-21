import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SyncConfigServices } from '../sync-config.services';
import { ConfirmationService } from 'portalface/widgets';
import { ValueMapperComponent } from '../value-mapper/value-mapper.component';
import { LoadingService } from 'portalface/services';



@Component({
  selector: 'kyee-col-mapper',
  templateUrl: './col-mapper.component.html',
  styleUrls: ['./col-mapper.component.scss']
})
export class ColMapperComponent implements OnInit {

  type = '同步配置';
  @Input() hospitalInfo: any;
  @Input() from:string;

  //@Input() allDatasource: any[];

  valueList: any[] = [];
  valueListBak: any[] = [];

  mapperDlg: boolean = false;

  rowId: string;

  hisNames: any[] = [];
  selDs: any;
  syncFlag: boolean;
  // joinFlag: boolean;
  operationFlag: boolean;
  valMapper: string;

  selValMapper:any;
  valMappers:any[] = [];

  msgs: any[];

  tfValues = [{ 'label': '全部', 'value': '' }, { 'label': '是', 'value': '1' }, { 'label': '否', 'value': '0' }];
  valValues = [{ 'label': '全部', 'value': '' }, { 'label': '有', 'value': '1' }, { 'label': '无', 'value': '0' }];

  hisNameFilter: string;
  dsNameFilter: string;
  syncFliter: string = '';
  joinFliter: string = '';
  //operationFliter: string;
  valFliter: string = '';

  @ViewChild(ValueMapperComponent)
  dictionaryComponent: ValueMapperComponent;

  allDsObj={};

  selData:any = null;
  @Input() allData:any[];
  constructor(private syncConfigService: SyncConfigServices, private confirmationService: ConfirmationService,private loadingService:LoadingService) { }

  ngOnInit() {

    this.search();
    this.dictionaryComponent.backgroundSearch(this.type);

    // this.allDsObj = this.allDatasource.reduce((p,c) => {
    //   p[c['label']] = c['value'];
    //   p[c['value']] = c['label'];
    //   return p;
    // },{})

  }

  search() {
    // this.loadingService.loading(true);
    // this.syncConfigService.getSyncConifg(this.param()).then(res => {
    //   this.loadingService.loading(false);
    //   if (res['code'] == 10000) {
    //     this.valueListBak = res['data'] || [];
    //     this.filterData();
    //     //this.showMessage('success','',this.rowId?'修改成功':'新增成功')
    //     return;
    //   }
    //   this.showMessage('error', '', '获取数据失败')
    // })

    this.getCurData(this.allData);
    
  }

  getCurData(d){
    this.valueListBak = (d || []).filter(v => {
      if(!v['from']){
        if(v['operationFlag']){
          v['from'] = '手术';
        }else{
          v['from'] = '基础数据';
        }
      }
      return v['from'] == this.from;
      // if(v['from']){
      //   return v['from'] == this.from;
      // }
      // let flag = false;
      // let dsn = v['dsName'] || '';
      // let operation = v['operationFlag'];

      // switch(this.from){
      //   case '基础数据':
      //     flag = (dsn == '医疗付费方式代码' || dsn.indexOf('费') == -1) && !operation;
      //     break;
      //   case '手术':
      //     flag = !!operation;
      //     break;
      //   case '费用':
      //     flag = dsn != '医疗付费方式代码' && (dsn.indexOf('费') > 0 || dsn.indexOf('金额') > 0) ;
      //     break;
      // }
      // return flag;

    });
    this.filterData();
  }
  addMapper() {
    this.editorMapperData(null);

  }

  editorMapperData(d) {
    this.valMappers = (this.dictionaryComponent.dictionaryList || []).reduce((p,c) => {
      p.push({"label":c['值域名称'],'value':c['_id']});
      return p;
    },[{"label":'','value':''}])
    this.rowId = '';
    this.selDs = null;
    if (d) {
      this.selDs = {"code":d['dsCode'],"name":d['dsName']};
      this.rowId = d['_id'];
      this.hisNames = (d['hisNames'] || '').split(/,/g).reduce((p, c) => {
        p.push({ "name": c });
        return p;
      }, [])
      //this.selDs = { "label": d['dsName'] || '', "value": d['dsCode'] || '' };
      //this.selDs = d['dsCode'];
      this.syncFlag = d['syncFlag'];
      this.operationFlag = d['operationFlag'];
      // this.joinFlag = d['joinFlag'];
      this.valMapper = d['valMapper'];
      this.mapperDlg = true;
      this.selValMapper = { "label": d['valMapper'] || '', "value": d['valMapperId'] || '' };
      return;
    }
    this.hisNames = [{ "name": '' }];
    //this.selDs = null;
    this.syncFlag = this.from == '费用'?true:false;
    this.operationFlag = this.from == '手术'?true:false;
    // this.joinFlag = false;
    this.valMapper = '';

    this.mapperDlg = true;
  }
  addHisName() {
    this.hisNames.push({ "name": '' });
  }
  confirmMapper() {
    let obj = this.dataParam();
    if (!this.checkData(obj)) {
      return;
    }
    let param = this.param();
    Object.assign(param, obj);
    if (this.rowId) {
      param['_id'] = this.rowId;
    }
    param['from'] = this.from;
    this.syncConfigService.saveSyncConifg(param).then(res => {
      if (res['code'] == 10000) {

        //this.getCurData(res['data']);

        this.showMessage('success', '', this.rowId ? '修改成功' : '新增成功');
        this.reloadData();
        this.mapperDlg = false;
        return;
      }else if(res['code'] == 10006){

        this.showMessage('info', '', res['msg']);
        return;
      }
      this.showMessage('error', '', '保存异常')

    })
  }

  delMapper(data) {
    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除【'+(data['hisNames'] ||  data['dsName'])+'】？',
      accept: () => {
        this.syncConfigService.delSyncConifg(data['_id']).then(res => {
          if (res['code'] == 10000) {
            this.showMessage('success', '', '删除成功');
            this.valueList = this.valueList.filter(d => d['_id'] != data['_id']);
            this.reloadData();
            return;
          }
          this.showMessage('error', '', '删除失败')
        })
      }
    });
  }
  param() {
    return this.syncConfigService.syncConfigBasParam(this.hospitalInfo, this.type);
  }
  checkData(obj) {

    if (!obj['hisNames'] || !obj['dsName']) {
      this.showMessage('info', '', 'HIS字段和数据元不能为空!')
      return false;
    }

    // if(obj['hisNames'].indexOf(',') > -1 && !obj['dsName']){
    //   this.showMessage('info', '', '内容合并时数据元不能为空')
    //   return false;
    // }
    
    // if(obj['syncFlag'] && !obj['dsName']){
    //   this.showMessage('info', '', '设置全量同步数据元不能为空')
    //   return false;
    // }

    // his字段、emr数据元只配置一个
    //let oneNameFlag = (!obj['hisNames'] && obj['dsName']) || (obj['hisNames'] && !obj['dsName']);

    // if (oneNameFlag) {
    //   let nosetFlag = !obj['syncFlag'] && !obj['valMapper'];
    //   if (nosetFlag) {
    //     this.showMessage('info', '', '全量同步、值域不能全为空');
    //     return false;
    //   }

    // }

    // 重复数据元
    if((this.valueListBak || []).find(v => this.rowId != v['_id'] && v['dsName'] == obj['dsName'])){
      this.showMessage('info', '', `已包含${obj['dsName']}的配置`);
      return false;
    }
    return true;
  }

  dataParam() {
    let names = this.hisNames.reduce((p, c) => {
      p.push(c['name'] || '');
      return p;
    }, []).filter(n => !!n);

    let dsName = '', dsCode = '';
    if (this.selDs && this.selDs['code'] && this.selDs['name']) {
      dsName = this.selDs['name'];
      dsCode = this.selDs['code'];
    }

    let hisNames = names.join(',');
 // 'joinFlag': this.joinFlag,
    return { 'hisNames': hisNames, 'dsName': dsName, 'dsCode': dsCode, 'syncFlag': this.syncFlag,  'operationFlag': this.operationFlag, 'valMapper': this.selValMapper?this.selValMapper['label']:'','valMapperId': this.selValMapper?this.selValMapper['value']:''};
  }

  filterData() {
    this.valueList = (this.valueListBak || []).filter(d => {

      let hisNameFlag = true;
      let dsNameFlag = true;
      let syncFlag = true;

      let operationFlag = true;
      let valMapperFlag = true;

      if (this.hisNameFilter) {
        hisNameFlag = (d['hisNames'] || '').indexOf(this.hisNameFilter) > -1
      }
      if (this.dsNameFilter) {
        dsNameFlag = (d['dsName'] || '').indexOf(this.dsNameFilter) > -1
      }

      if (this.syncFliter != '') {
        syncFlag = this.syncFliter == '1' ? d['syncFlag'] == true : d['syncFlag'] == false;
      }
      
      // if (this.operationFliter != '') {
      //   operationFlag = this.operationFliter == '1' ? d['operationFlag'] == true : d['operationFlag'] == false;
      // }

      if (this.valFliter != '') {
        valMapperFlag = this.valFliter == '1' ? !!d['valMapper'] : !!!d['valMapper'];
      }
      return hisNameFlag
        && dsNameFlag
        && syncFlag
        //&& operationFlag
        && valMapperFlag;
    });
    console.log(this.valueList);
  }
  showValueMapperDialog(){
    this.dictionaryComponent.showDictionaryDialog(this.type);
  }
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }
  delHisName(index){
    this.hisNames.splice(index,1);
    
  }
  reloadData(){
    this.loadingService.loading(true);
    this.syncConfigService.getSyncConifg(this.syncConfigService.syncConfigBasParam(this.hospitalInfo, '同步配置')).then(res => {
      this.loadingService.loading(false);
      if (res['code'] == 10000) {
        this.allData = res['data'] || [];
      }else{
        this.allData = [];
        this.showMessage('error', '', '获取数据异常，请刷新页面或联系运维人员!');

      }
      this.getCurData(this.allData);
    })
  }
}
