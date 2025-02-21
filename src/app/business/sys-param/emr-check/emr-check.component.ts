import { AuthTokenService } from './../../../basic/auth/authToken.service';
import { EmrCheckService } from './emr-check.service';
import { SysParamService } from './../sys-param.service';
import { CurrentUserInfo } from './../../../basic/common/model/currentUserInfo.model';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'portalface/services';
import { Message, TreeNode } from 'portalface/widgets';

@Component({
  selector: 'kyee-emr-check',
  templateUrl: './emr-check.component.html',
  styleUrls: ['./emr-check.component.scss']
})
export class EmrCheckComponent implements OnInit {
  msgs: Message[] = [];

  areasAndHospitals:TreeNode[];//区域医院树
  selectedHospiral:TreeNode = {};
  hospitalParamsTree:TreeNode[];//医院参数树
  selectedParam:TreeNode;
  hospitalParamsVisible:boolean = false;//医院参数列表区域
  disabledAutoBackInput:boolean = true; 
  disabledAutoSaveEditoInput:boolean = true;
  showContinuePrintSaveBtn:boolean = true;
  hospitalParamsLoading: Boolean = false;
 
  hospitalCode:string;
  nodeCode:string;

  isSysAdmin: boolean;
  currentUserInfo:CurrentUserInfo;
  showDataTable:boolean;
  currentAreaCode:string;
  currentHosCode:string;
  hosAreaCode:string;

  checkHospitals: Object = {};

  filterHospitalName:string = '';


  currentTemplateDirs:object[] =[];
  selectDir:Object;
  viewTableData:Object[] = [];

  allData:Object;
  constructor(private sysService:SysParamService,private emrCheckService:EmrCheckService,private authTokenService:AuthTokenService,private loadingService:LoadingService) { }

  ngOnInit() {
    this.currentUserInfo = JSON.parse(this.authTokenService.getCurrentUserInfo());
    this.getCheckHospitals();
  }
  // 获取开启三级检诊医院列表
  getCheckHospitals(){

    this.emrCheckService.getCheckHospitals().subscribe(res => {

      if(res.code == 10000){
        res.data.forEach(h => {
          let _hosnum = h['医院编码'];
          let _nodecode = h['院区编码'];
          if(_hosnum){
            this.checkHospitals[_hosnum+'-'+_nodecode] = true;
          }
        });
      }
      if (this.currentUserInfo && this.currentUserInfo.currentRole == '医院') {
        this.showDataTable = false;
        this.isSysAdmin = false;
        this.currentAreaCode = this.currentUserInfo['areaCode'];
        this.currentHosCode = this.currentUserInfo['hosNum'];
        this.hosAreaCode = this.currentUserInfo['nodeCode'];
        this.selectedHospiral['医院编码'] = this.currentHosCode;
        this.selectedHospiral['院区编码'] = this.hosAreaCode;
        this.selectedHospiral['医院名称'] = this.currentUserInfo['hosName'];
        this.search();
      } else {
        this.showDataTable = false;
        this.isSysAdmin = true;
        this.getAreasAndHospitalsList();
      }
    });
  }
  getAreasAndHospitalsList(){

    this.sysService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
      apiResult =>{
        if(apiResult.code == 10000 && apiResult.data){
          let interfaceResult = apiResult.data;
          for(let item of interfaceResult){
            item['label'] = item['areaName'].toString();
            item['data'] = item['areaCode'].toString();
            item['expanded'] = true;//区域默认展开
            item['expandedIcon']= 'fa-folder-open';
            item['collapsedIcon'] = 'fa-folder';
            item['children'] = [];
            item['checked'] = true;
            let hospitals = item['hospitalParam'];
          
            hospitals = hospitals.filter(h => {
              return this.checkHospitals[h['医院编码']+'-'+h['院区编码']];
            });
            if(hospitals.length > 0){
              let childrens = [];
              for (let hospital of hospitals){
                hospital['label'] = hospital['医院名称'];
                hospital['data'] = hospital['医院编码'];
                hospital['院区编码'] = hospital['院区编码'];
                hospital['areaCode'] = item['areaCode'].toString();
              }
              item['children'] = hospitals;
            }
          }
          this.areasAndHospitals = interfaceResult;
          if (this.areasAndHospitals && this.areasAndHospitals.length > 0) {
            this.selectedHospiral = this.areasAndHospitals[0].children[0];
            this.hospitalSelect();
          }else {
            this.hospitalParamsVisible = false;
            this.setAllParamVisibleFalse();
          }
        }
        this.loadingService.loading(false);
      },
      error =>{
        this.loadingService.loading(false);
        this.msgs = [];
        this.msgs.push({severity: 'error', detail: "获取区域及医院列表失败，请稍后再试"});
      }
    )
  }

  search(){
    this.hospitalCode = this.currentHosCode;
    this.nodeCode = this.hosAreaCode;
    this.hospitalSelect();
  }

  hospitalSelect(){
    if(this.selectedHospiral['医院名称'] == undefined || this.selectedHospiral['医院名称']== null || this.selectedHospiral['医院名称'] == ""){
      this.msgs = [];
      this.msgs.push({severity:'warn',detail:'请选择区域下的平台'});
    }else {
      this.hospitalCode = this.selectedHospiral['医院编码'];
      this.nodeCode = this.selectedHospiral['院区编码'];
      this.currentTemplateDirs = [];
        this.allData = {};
        this.viewTableData = [];
      this.emrCheckService.getEmrCheck(this.hospitalCode,this.nodeCode).subscribe(res =>{
        
        this.showDataTable = true;
        
        if(res && res["目录"]){
          this.allData = res["目录"];
          this.currentTemplateDirs = [];
          var dirList = Object.keys(this.allData);
          dirList.forEach(i=>{
            this.currentTemplateDirs.push({'目录名称':i});
          });
          this.currentTemplateDirs[0]['active'] = 'active';
          this.selectDir = this.currentTemplateDirs[0];
          this.viewTableData = this.allData[this.selectDir['目录名称']];
        }
      });
    }
  }

  setAllParamVisibleFalse(){

    this.showDataTable = false;
  }
  getTemplateListByDirName(dir){
    this.currentTemplateDirs.forEach(item => {
      item['active'] = item['目录名称'] == dir['目录名称']?'active':'';
    });
          this.selectDir = dir;
          this.viewTableData = this.allData[this.selectDir['目录名称']];

  }
  save(){
    this.emrCheckService.saveEmrCheck(this.hospitalCode,this.nodeCode,{'目录':this.allData}).subscribe(res=>{
      if(res['code'] == 10000){
        this.msgs = [];
        this.msgs.push({severity: 'info', detail: "保存成功"});
      }else{
        this.msgs = [];
        this.msgs.push({severity: 'error', detail: "保存失败"});
      }
    })
  }

}
