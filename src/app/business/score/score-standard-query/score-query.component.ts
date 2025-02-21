import { CurrentUserInfo } from './../../../basic/common/model/currentUserInfo.model';

import { OnInit, Component, ElementRef, ViewChild, enableProdMode } from '@angular/core';

import { TreeNode } from 'portalface/widgets';

import { GrowlMessageService } from "../../../common/service/growl-message.service";
import { SysParamService } from "../../sys-param/sys-param.service";


@Component({
  selector: 'kyee-score-query',
  templateUrl: './score-query.html',
  styleUrls: ['./score-query.component.scss']
})

export class ScoreQueryComponent implements OnInit {
  isSysAdmin: boolean;
  showDataTable: boolean;
  filterHospitalName: String = '';
  areasAndHospitals: TreeNode[];
  selectedNode: TreeNode;
  currentAreaCode = '';
  currentHosCode = '';
  hosAreaCode = '';
  currentUserInfo: CurrentUserInfo;
  isNewScoreConfig:boolean = false;
  isSwitch:boolean = true;
  constructor(
    private sysParamService: SysParamService,
    private growlMessageService: GrowlMessageService
  ) { }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    if (!this.sysParamService.isAreaUser(this.currentUserInfo)) {
      this.showDataTable = true;
      this.isSysAdmin = false;
      this.currentAreaCode = this.currentUserInfo['areaCode'];
      this.currentHosCode = this.currentUserInfo['hosNum'];
      this.hosAreaCode = this.currentUserInfo['nodeCode'];
      // this.inittemplateList(this.currentHosCode+'-'+this.hosAreaCode);
      // this.search();
      this.getHosconfig((config) => {
        this.showDataTable = true;
        this.isSwitch = true;
        this.isNewScoreConfig = (config && config['是否启用新质控规则配置'] == 'Y');
      },() => {
        this.showDataTable = false;
        this.growlMessageService.showError('获取系统参数异常，请重试或联系运维人员!','');
      });
    } else {
      this.showDataTable = false;
      this.isSysAdmin = true;
      this.getAreasAndHospitalsList();
    }
  }
    /**
   * 查询区域/医院信息
   */
  getAreasAndHospitalsList() {
    this.showloading(true);
    this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
      apiResult => {
        if (apiResult.code == 10000 && apiResult.data) {
          let interfaceResult = apiResult.data;
          for (let area of interfaceResult) {
            area['label'] = area['areaName'].toString();
            area['data'] = area['areaCode'].toString();
            area['expanded'] = true;//区域默认展开
            area['expandedIcon'] = 'fa-folder-open';
            area['collapsedIcon'] = 'fa-folder';
            area['children'] = [];
            area['checked'] = true;
            let hospitals = area['hospitalParam'];
            if (hospitals.length > 0) {
              let childrens = [];
              for (let hospital of hospitals) {
                hospital['label'] = hospital['医院名称'];
                hospital['data'] = hospital['医院编码'];
                hospital['院区编码'] = hospital['院区编码'];
              }
              area['children'] = hospitals;
            }
          }
          this.areasAndHospitals = interfaceResult;


          if(this.areasAndHospitals.length > 0 && this.areasAndHospitals[0].children && this.areasAndHospitals[0].children.length > 0){
            this.selectedNode = this.areasAndHospitals[0].children[0];
            this.currentAreaCode = this.areasAndHospitals[0]["areaCode"]
            this.currentHosCode = this.selectedNode['医院编码'];
            this.hosAreaCode = this.selectedNode['院区编码'];
            this.getHosconfig((config) => {
              this.showDataTable = true;
              this.isSwitch = true;
              this.isNewScoreConfig = (config && config['是否启用新质控规则配置'] == 'Y');
            },() => {
              this.showDataTable = false;
              this.growlMessageService.showError('获取系统参数异常，请重试或联系运维人员!','');
            });
          }
        }
        this.showloading(false);
      },
      error => {
        this.showloading(false);
        this.growlMessageService.showErrorInfo('', '获取区域及医院npm 列表失败，请稍后再试');
      }
    );
  }
    /**
   * 切换区域医院
   */
  selectNode() {
    if (this.selectedNode && this.selectedNode['parent'] == undefined && this.selectedNode['医院名称'] == null) {
      this.growlMessageService.showWarningInfo('请选择医院');
      this.showDataTable = false;
      return;
    } else {
      this.isSwitch = false;
      let currentDeptCode = this.selectedNode['科室ID'];
      if (currentDeptCode == undefined) {//选择的是医院
        this.currentAreaCode = this.selectedNode.parent["areaCode"]
        this.currentHosCode = this.selectedNode['医院编码'];
        this.hosAreaCode = this.selectedNode['院区编码'];
      } else {
        this.currentAreaCode = this.selectedNode.parent.parent["areaCode"];
        this.currentHosCode = this.selectedNode.parent["医院编码"];
        this.hosAreaCode = this.selectedNode.parent['院区编码'];
      }

      this.getHosconfig((config) => {
        this.showDataTable = true;
        this.isSwitch = true;
        this.isNewScoreConfig = (config && config['是否启用新质控规则配置'] == 'Y');
      },() => {
        this.showDataTable = false;
        this.growlMessageService.showError('获取系统参数异常，请重试或联系运维人员!','');
      });
      // this.inittemplateList(this.currentHosCode+'-'+this.hosAreaCode);
      // this.search();
    }
  }
  
  getHosconfig(callback,ecallback){
    this.sysParamService.getHospitalPrams({"医院编码":this.currentHosCode,"院区编码":this.hosAreaCode}).then(d => callback(d)).catch(e => ecallback());

  }

  showloading(flag) {
    let back = document.getElementsByClassName("kyee-loading-backdrop")[0],
      icon = document.getElementsByClassName("kyee-loading-container")[0];
    if (back && icon) {
      if (flag) {
        back.removeAttribute('hidden');
        icon.removeAttribute('hidden');
      } else {
        back.setAttribute('hidden', "hidden")
        icon.setAttribute('hidden', "hidden")
      }
    }
  }
}



