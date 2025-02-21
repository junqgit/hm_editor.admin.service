import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SysParamService } from '../../sys-param/sys-param.service';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';
import { TreeNode } from 'primeng/primeng';
import { LoadingService } from 'portalface/services';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
@Component({
  selector: 'kyee-eva-config',
  templateUrl: './eva-config.component.html',
  styleUrls: ['./eva-config.component.scss']
})
export class EvaConfigComponent implements OnInit {

  currentUserInfo: CurrentUserInfo;
  isSysAdmin: boolean = false;
  filterHospitalName: any = '';
  hospitalInfo: any = {
    areaCode: '',
    hosNum: '',
    nodeNum: '',
    deptCode: '',
    wardCode: '*'
  };
  selectedNode: TreeNode;

    evaFormFlag:boolean;

    areasAndHospitals: TreeNode[];
  constructor(private sysParamService: SysParamService,private growlMessageService: GrowlMessageService,
    private loadingService: LoadingService,private ref:ChangeDetectorRef) { }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    
    if (!this.sysParamService.isAreaUser(this.currentUserInfo)) {
      this.isSysAdmin = false;
      this.hospitalInfo.hosNum = this.currentUserInfo['hosNum'];
      this.hospitalInfo.areaCode = this.currentUserInfo['areaCode'];
      this.hospitalInfo.hosName = this.currentUserInfo['hosName'];
      this.hospitalInfo.nodeNum = this.currentUserInfo['nodeCode'];

      this.evaFormFlag = true;
    } else {
      this.isSysAdmin = true;
      this.evaFormFlag = false;
      this.getAreasAndHospitalsList();
      
    }
  }
  getAreasAndHospitalsList() {
    this.loadingService.loading(true);
    this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
      apiResult => {
        if (apiResult.code == 10000 && apiResult.data) {
          let interfaceResult = apiResult.data;
          this.areasAndHospitals = this.getHospitalTreeData(interfaceResult);

          if(this.areasAndHospitals.length > 0 && this.areasAndHospitals[0].children && this.areasAndHospitals[0].children.length > 0){
            this.selectedNode = this.areasAndHospitals[0].children[0];
            this.selectNode();
          }
          
        }
        this.loadingService.loading(false);
      },
      error => {
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('', '获取区域及医院列表失败，请稍后再试');
      }
    );
  }

  getHospitalTreeData(data) {
    let interfaceResult = Object.assign([], data);
    for (let area of interfaceResult) {
      area['label'] = area['areaName'].toString();
      area['data'] = area;
      area['expanded'] = true; // 区域默认展开
      area['expandedIcon'] = 'fa-folder-open';
      area['collapsedIcon'] = 'fa-folder';
      area['children'] = [];
      area['checked'] = true;
      let hospitals = area['hospitalParam'];
      if (hospitals.length > 0) {
        for (let hospital of hospitals) {
          hospital['label'] = hospital['医院名称'];
          hospital['data'] = hospital;
          hospital['院区编码'] = hospital['院区编码'];
          hospital['children'] = [];
        }
        area['children'] = hospitals;
      }
    }
    return interfaceResult;
  }
  selectNode() {
    if (!this.selectedNode || Object.keys(this.selectedNode).length == 0) {
        this.growlMessageService.showWarningInfo('请选择医院');
        return;
    }

    this.hospitalInfo.hosNum = this.selectedNode['医院编码']; // 当前节点所在的医院
    this.hospitalInfo.areaCode = this.currentUserInfo.areaCode;
    this.hospitalInfo.hosName = this.selectedNode['医院名称'];
    this.hospitalInfo.nodeNum = this.selectedNode['院区编码'];

    this.forceFresh();
}
forceFresh(){
  this.evaFormFlag = false;
  this.ref.detectChanges();
  this.evaFormFlag = true;

}
}
