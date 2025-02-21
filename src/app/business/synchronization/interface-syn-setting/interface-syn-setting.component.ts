import { Component, OnInit } from '@angular/core';
import {CommonSyncBean} from "./commonSyncBean";
import {DataSyncService} from "./data-sync.service";
import {Message} from "portalface/widgets/commons/message";
import {SelectItem} from "portalface/widgets/commons/selectitem";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {SysParamService} from "../../sys-param/sys-param.service";
import {GrowlMessageService} from "../../../common/service/growl-message.service";
import { LoadingService } from 'portalface/services';

@Component({
  selector: 'kyee-interface-syn-setting',
  templateUrl: './interface-syn-setting.component.html',
  styleUrls: ['./interface-syn-setting.component.scss'],
  providers: [DataSyncService]
})
export class InterfaceSynSettingComponent implements OnInit {

  syncBeanList: CommonSyncBean[] = [];
  selectedSyncBean: CommonSyncBean[] = [];
  msgs: Message[] = [];
  areaCodeList: SelectItem[];
    // = this.initSelectItem(['test', 'beijing', 'anhui_aq_demo', 'guangdong_jy_demo', 'guangdong_jy_demo2', 'anhui_mc', 'anhui_lx', 'anhui_qc', 'anhui_aq', 'guangdong_jy', 'hebei_zjk']);
  jobNameList: SelectItem[] = [];
  isShowDeleteDialog: Boolean = false;
  constructor(
    private dataSyncService: DataSyncService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private growlMessageService: GrowlMessageService,
    private sysParamService:SysParamService
  ) {

  }

  ngOnInit(): void {
    //this.getAreaSettingList();
    // this.dataSyncService.getJobNameList().subscribe(
    //   apiResult =>{
    //     if(apiResult.code ==10000 ){
    //       this.jobNameList = this.initSelectItem(apiResult.data);
    //     }
    //   }
    // );
    this.getSyncBeanList();//获取接口同步设置列表
    this.activatedRoute.queryParamMap.subscribe(
      (params: ParamMap) => {

      }
    );
  }

  getSyncBeanList(){
    this.dataSyncService.getSyncBeanList().subscribe(
      interfaceResult => {
        if(interfaceResult.code==10000){
          let list:CommonSyncBean[] = interfaceResult.data;
          for(let i = 0; i < list.length; i ++){
            list[i].switch = 'off';
            list[i].saveSwitch = 'off';
          }
          this.syncBeanList = list;
        }
      },
      error => {
        this.msgs = [];
        this.msgs.push({severity: 'error', detail: "获取同步列表失败，请稍后再试"});
      }
    );
  }
  getAreaSettingList(){
    this.dataSyncService.getAreaSettingList().subscribe(
      apiResult => {
        if(apiResult.code == 10000 && apiResult.data){
          let areas = [];
          let selectItem = [];
          areas= apiResult.data;
          for(let i = 0; i < areas.length; i++){
            selectItem.push({label: areas[i]['areaName'], value: areas[i]['areaName'],code:areas[i]['areaCode']});//areaCode
          }
          this.areaCodeList = selectItem;
        }
      },
      error => {
        this.msgs = [];
        this.msgs.push({severity: 'error', detail: "获取区域编码失败，请稍后再试"});
      }
    );
  }

  initSelectItem(arr: string[]): SelectItem[] {
    let selectItem = [];
    for (let i = 0; i < arr.length; i++) {
      selectItem.push({label: arr[i]['jobChineseName'], value: arr[i]['jobChineseName'],code:arr[i]['jobName'],'jobGroup':arr[i]['jobGroup']});
    }
    return selectItem;
  }

  addSyncBean() {
    let syncBeanListCpoy: CommonSyncBean[] = this.syncBeanList.slice(0);
    let commonSyncBean = new CommonSyncBean();
    this.setTargetContexPath(commonSyncBean);
    this.setJobChineseName(commonSyncBean);
    let newFirstBeanList = [];
    commonSyncBean['state'] = '-1';// 新增标识    
    newFirstBeanList.push(commonSyncBean);
    syncBeanListCpoy.forEach(syncBean=>{
      newFirstBeanList.push(syncBean);
    })
    this.syncBeanList = newFirstBeanList;
  }

  changeArea(syncBean){
    // console.log(field);
    this.changeTargetContextPath(syncBean);
  }

  changeTargetContextPath(syncBean){
    this.sysParamService.queryAreaSettingList().subscribe(
      data => {
        if (data && data.code == 10000) {
          let configurationList = data.data || [];
          if(configurationList.length > 0){
            for(let area of configurationList){
              if(syncBean['areaName'] == area['areaName']){
                syncBean['targetContextPath'] = area['targetContextPath'];
                break;
              }
            }
          }else {
            syncBean['targetContextPath'] = '';
          }
        }else {
          this.growlMessageService.showWarningInfo('获取区域配置失败');
          syncBean['targetContextPath'] = '';
        }
      },
      error => {
        syncBean['targetContextPath'] = '';
        this.growlMessageService.showErrorInfo('error','获取区域配置，网络异常。');
      }
    );

  }

  setTargetContexPath(commonSyncBean){
    this.sysParamService.queryAreaSettingList().subscribe(
      data => {
        if (data && data.code == 10000) {
          let configurationList = data.data || [];
          if(configurationList.length > 0){
            let area = configurationList[0];
            commonSyncBean['areaCode'] = area['areaCode'];
            commonSyncBean['areaName'] = area['areaName'];
            commonSyncBean['targetContextPath'] = area['targetContextPath'];
          }else {
            commonSyncBean['targetContextPath'] = '';
          }
        }else {
          this.growlMessageService.showWarningInfo('获取区域配置失败');
          commonSyncBean['targetContextPath'] = '';
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('error','获取区域配置，网络异常。');
      }
    );
  }

  setJobChineseName(commonSyncBean) {
    this.dataSyncService.getSyncBeanList().subscribe(
      interfaceResult => {
        if(interfaceResult.code==10000){
          let list:CommonSyncBean[] = interfaceResult.data || [];
          if (list.length > 0) {
            let firstSyncBean = list[0];
            commonSyncBean['jobChineseName'] = firstSyncBean['jobChineseName'];
          } else {
            commonSyncBean['jobChineseName'] = '';
          }
        } else {
          this.growlMessageService.showWarningInfo('获取同步列表失败');
          commonSyncBean['jobChineseName'] = '';
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('error','获取同步列表失败，请稍后再试。');
      }
    );
  }

  showDeleteDialog(){
    this.isShowDeleteDialog = true;
  }

  removeSyncBean() {
    let syncBeanList = this.selectedSyncBean;
    if(syncBeanList.length < 1){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: "需至少选中一项"});
      return;
    }
    this.dataSyncService.removeSyncBean(syncBeanList).subscribe(
      apiResult =>{
        if(apiResult.code == 10000){
          this.msgs = [];
          this.msgs.push({severity: 'info', detail: "删除接口成功."});
          this.selectedSyncBean = [];
          this.isShowDeleteDialog = false;
          this.getSyncBeanList();
        }
      },
      error =>{
        this.msgs = [];
        this.msgs.push({severity: 'info', detail: "删除接口失败，请稍后再试."});
      }
    );
  }


  findSelectedSyncBeanIndex(syncBean): number {
    return this.syncBeanList.indexOf(syncBean);
  }

  /*保存
  * */
  saveSyncBean(syncBean: CommonSyncBean) {
    syncBean.saveSwitch = 'on';

    if(syncBean.leavingTimeOffset<=0){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: "预出院间隔应大于0"});
      syncBean.saveSwitch = 'off';
      return;
    }
    this.dataSyncService.saveSyncBean(syncBean).subscribe(
      apiResult => {
        if (apiResult.code === 10000) {
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'success', detail: apiResult.msg || '保存成功'});
          if(syncBean['state'] == '-1'){
            syncBean['state'] = '1';
          }
          
        }else if(apiResult.code === 10006){
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'error', detail: apiResult.msg || '保存失败'});
        }else{
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'error', detail: '保存失败'});
        }
      },
      error => {
        syncBean.saveSwitch = 'off';
        this.msgs = [];
        this.msgs.push({severity: 'error',  detail: '保存失败，请稍后重试'});
      }
    );
  }

  stopJob(syncBean){
    syncBean.saveSwitch = 'on';


    this.dataSyncService.stopSyncBean(syncBean).subscribe(
      apiResult => {
        if (apiResult.code === 10000) {
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'success', detail: '已停止'});
          syncBean['state'] = '0';
        }else if(apiResult.code === 10006){
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'error', detail: apiResult.msg});
        }else{
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'error', detail: '停止失败'});
        }
      },
      error => {
        syncBean.saveSwitch = 'off';
        this.msgs = [];
        this.msgs.push({severity: 'error',  detail: '停止失败，请稍后重试'});
      }
    );

  }
  startJob(syncBean){
    syncBean.saveSwitch = 'on';


    this.dataSyncService.startSyncBean(syncBean).subscribe(
      apiResult => {
        if (apiResult.code === 10000) {
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'success', detail: '已恢复'});
          syncBean['state'] = '1';
        }else if(apiResult.code === 10006){
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'error', detail: apiResult.msg});
        }else{
          syncBean.saveSwitch = 'off';
          this.msgs = [];
          this.msgs.push({severity: 'error', detail: '恢复失败'});
        }
      },
      error => {
        syncBean.saveSwitch = 'off';
        this.msgs = [];
        this.msgs.push({severity: 'error',  detail: '停止失败，请稍后重试'});
      }
    );

  }
  
  /**
   * 同步
   * @param syncBean
   */
  syncNow(syncBean: CommonSyncBean) {
    syncBean.switch = 'on';
    this.loadingService.loading(true);
    let startTime = new Date().getTime();

    let syncDataFlag = this.isSyncData(syncBean.jobGroup);

    let jobName = syncBean.jobChineseName;
    this.dataSyncService.syncNow(syncBean).subscribe(
      apiResult => {
        syncBean.switch = 'off';
        this.loadingService.loading(false);
        let endTime = new Date().getTime();
        if (apiResult.code == 10000) {
          this.msgs = [];
          if(syncDataFlag){
            this.msgs.push({severity: 'success', summary:"同步目标：" + jobName, detail: "同步成功! 耗时：" + (endTime - startTime) / 1000 + "秒，数据量：" + apiResult.data + "条"});
          }else{
            this.msgs.push({severity: 'success', summary:"执行：" + jobName, detail: "成功! 耗时：" + (endTime - startTime) / 1000 + "秒"});
          }
        }
        if (apiResult.code != 10000) {
          this.msgs = [];
          if(syncDataFlag){
          this.msgs.push({severity: 'error', summary:"同步目标：" +jobName, detail: "同步失败! 错误信息：" + apiResult.msg});
        }else{
          this.msgs.push({severity: 'error', summary:"执行：" + jobName, detail: "失败! 耗时：错误信息：" + apiResult.msg});
        }
        }

      },
      error => {
        syncBean.switch = 'off';
        this.loadingService.loading(false);
        this.msgs = [];
        if(syncDataFlag){
          this.msgs.push({severity: 'error', summary:"同步目标：" +jobName, detail: "网络异常，请稍后再试"});
        }else{
          this.msgs.push({severity: 'error', summary:"执行：" + jobName, detail: "网络异常，请稍后再试"});
        }
      }
    );
  }

  // findAreaCode(areaName){
  //   let areaList = this.areaCodeList;
  //   for(let i = 0 ; i < areaList.length; i++){
  //     if(areaList[i]['label'] == areaName){
  //       return areaList[i]['code'];
  //     }
  //   }
  //   return "";
  // }

  // findJobName(jobChineseName){
  //   let jobList = this.jobNameList;
  //   for(let item of jobList){
  //     if(item['label'] == jobChineseName){
  //       return item['code'];
  //     }
  //   }
  //   return "";
  // }

  // findJobGroup(jobChineseName){
  //   let jobList = this.jobNameList;
  //   for(let item of jobList){
  //     if(item['label'] == jobChineseName){
  //       return item['jobGroup'];
  //     }
  //   }
  //   return "";
  // }
  
  isSyncData(jobGroup){
    return jobGroup == 'dataSync';
  }

}
