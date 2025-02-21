import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'portalface/services';
import { ConfirmationService, TreeNode } from 'portalface/widgets';
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
import { SysParamService } from '../../sys-param/sys-param.service';
import { CustomItems } from '../model/customItems.model';
import { FormCustomConfigServices } from './form-custom-config.services';

@Component({
  selector: 'kyee-form-custom-config',
  templateUrl: './form-custom-config.component.html',
  styleUrls: ['./form-custom-config.component.scss'],
  providers: [FormCustomConfigServices]
})
export class FormCustomConfigComponent implements OnInit {
  isSysAdmin: Boolean = false; // 是否是系统管理员
  filterHospitalName: string = '';
  reportsTree: TreeNode[]; // 医院列表数据
  selectedReport: TreeNode; // 选中对象
  showConfigTable: Boolean = false; // 是否显示配置项列表
  signDictList: CustomItems[]; // 自定义体征项数据
  selectedSignDict: CustomItems; // 选中项
  displayRptDialog: Boolean = false; // 编辑新增弹框是否显示
  rptTitle: string;
  hospitalInfo: any = {
    areaCode: '',
    hosNum: '',
    nodeNum: '',
    deptCode: '',
    wardCode: '*'
  };
  curUserInfo: any;
  reportInfo: any = {
    reportName: '',
    reportId: '',
    rptType: '',
    rptVersion: ''
  };
  patType: string = '1'; // 成人1 新生儿 2
  constructor(private loadingService: LoadingService,
    private growlMessageService: GrowlMessageService,
    private formService: FormCustomConfigServices,
    private sysParamService: SysParamService,
    private authTokenService: AuthTokenService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.curUserInfo = this.sysParamService.getCurUser();
    if (!this.sysParamService.isAreaUser(this.curUserInfo)) {
          this.isSysAdmin = false;
          this.hospitalInfo.hosNum = this.curUserInfo['hosNum'];
          this.hospitalInfo.areaCode = this.curUserInfo['nodeCode'];
          this.hospitalInfo.hosName = this.curUserInfo['hosName'];
          this.hospitalInfo.nodeNum = this.curUserInfo['nodeCode'];
          let formInfo = this.getFormList()[0];
          this.reportInfo.reportName = formInfo['label'];
          this.reportInfo.reportId = formInfo['data']['表单ID'];
          this.reportInfo.rptVersion = formInfo['data']['表单版本'];
          this.reportInfo.rptType = '1' ;
          this.loadCustomItemsList();
      }else {
          this.isSysAdmin = true;
          this.getAreasAndHospitalsList();
      }
  }

  getAreasAndHospitalsList() {
    this.loadingService.loading(true);
    this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
      apiResult => {
        if (apiResult.code == 10000 && apiResult.data) {
          let interfaceResult = apiResult.data;
          this.reportsTree = this.getHospitalTreeData(interfaceResult);
          this.updateHospitalInfo();
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
    let interfaceResult =  Object.assign([], data);
    for(let area of interfaceResult){
        area['label'] = area['areaName'].toString();
        area['data'] = area;
        area['expanded'] = true; // 区域默认展开
        area['expandedIcon'] = 'fa-folder-open';
        area['collapsedIcon'] = 'fa-folder';
        area['children'] = [];
        area['checked'] = true;
        let hospitals = area['hospitalParam'];
        if (hospitals.length > 0) {
          for (let hospital of hospitals){
            hospital['label'] = hospital['医院名称'];
            hospital['data'] = hospital;
            hospital['院区编码'] = hospital['院区编码'];
            hospital['children'] = this.getFormList();
          }
          area['children'] = hospitals;
        }
    }
    return interfaceResult;
  }

    /**
     * 获取当前医院表单列表
    */
   getFormList() {
        let form = [{
            'label': '体温单',
            'data': {
              // 'showConfigTable': true,
              // '表单类型': '体温单',
              '表单名称': '体温单',
              '表单ID': 'tiwendan',
              '表单版本': '01'
            }
        }];
        return form;
    }

  updateHospitalInfo() {
    if (this.reportsTree && this.reportsTree.length > 0) {
      this.selectedReport = this.reportsTree[0].children[0].children ? (this.reportsTree[0].children[0].children[0] || {}) : {};
      this.reportsTree[0].children[0].expanded = true;
      this.selectedReport.parent = this.reportsTree[0].children[0];
      this.reportSelect();
    }
  }

  reportSelect() {
    if (this.selectedReport && this.selectedReport['parent'] == undefined) {
      this.growlMessageService.showWarningInfo('请选择表单');
      return;
    }
    // this.resetScrollTreeBody();
    let selectedNode = this.selectedReport;
    let hospitalInfo = this.selectedReport['parent'].data || {};
    let reportData = selectedNode.data || {};
    this.reportInfo.reportName = selectedNode.label;
    if ('新生儿体温单' == this.reportInfo.reportName) {
      this.patType = '2';
    }
    this.reportInfo.reportId = reportData.表单ID;
    this.reportInfo.rptType = '1' ; // reportData.表单类型;
    this.hospitalInfo.hosNum = hospitalInfo['医院编码']; // 当前节点所在的医院
    this.hospitalInfo.areaCode = hospitalInfo['区域编码'];
    this.hospitalInfo.hosName = hospitalInfo['医院名称'];
    this.hospitalInfo.nodeNum = hospitalInfo['院区编码'];
    this.reportInfo.rptVersion = reportData['表单版本']; // 当前表单的版本信息
    this.loadCustomItemsList();
  }

  loadCustomItemsList() {
    this.getCustomItemsList();
    this.showConfigTable = true; // reportData.showConfigTable; // 是否显示表单明细
    this.selectedSignDict = null;
  }

  addClick() {
    this.rptTitle = '新增体征项';
    this.selectedSignDict = new CustomItems();
    this.displayRptDialog = true;
  }

  doEdit() {
    if (!this.selectedSignDict) {
      this.growlMessageService.showWarningInfo('请选中一项编辑!');
      return;
    }
    this.rptTitle = '编辑体征项';
    this.displayRptDialog = true;
  }

  deleteClick() {
    if (!this.selectedSignDict) {
      this.growlMessageService.showWarningInfo('请选中一项删除!');
      return;
    }
    this.confirmationService.confirm({
        message: '确定删除当前记录?',
        header: '提示',
        icon: 'fa fa-trash',
        accept: () => {
            // 删除记录
            this.deleteCustomItem();
        },
        reject: () => {
            this.growlMessageService.showDefaultInfo( '取消删除！');
        }
    });
  }

  deleteCustomItem() {
    this.formService.deleteCusItemById(this.selectedSignDict).then(data => {
      if (data.code === 10000) {
          this.growlMessageService.showSuccessInfo('删除成功!');
          this.getCustomItemsList();
          this.selectedSignDict = null;
      }else {
        this.growlMessageService.showErrorInfo('', data.msg || '获取自定义配置项数据失败！')
      }
    });
  }

  doCancel() {
    this.selectedSignDict = null;
    this.displayRptDialog = false;
  }

  doSave() {
    let signsDict = this.selectedSignDict;
    if (!this.checkSignDictFormat(this.selectedSignDict)) {
        return;
    }
    signsDict.医院编码 = this.hospitalInfo.hosNum;
    signsDict.病区ID = '*';
    signsDict.患者类型 = this.patType;
    signsDict.记录方式 = '2';
    signsDict.是否可选 = 'Y';
    signsDict.表单名称 = this.reportInfo.reportName;
    signsDict.表单ID = this.reportInfo.reportId;
    if (!signsDict._id) {
      delete(signsDict._id);
      this.formService.checkCustomItemsByCode(signsDict).then(res => {
        if (res.code == 10000) {
          if (res.data) {
            this.saveAndUpdateCustomItems(signsDict);
          }else {
            this.growlMessageService.showWarningInfo(res.msg || '体征项校验失败!');
          }
        }else {
          this.growlMessageService.showErrorInfo('', res.msg || '体征项校验失败!');
        }
      });
    }else {
      this.saveAndUpdateCustomItems(signsDict);
    }
  }

  saveAndUpdateCustomItems(signsDict: CustomItems) {
    this.formService.saveAndUpdateCustomItems(signsDict).then(data => {
      if (data.code == 10000) {
        this.growlMessageService.showSuccessInfo('创建成功!');
        this.getCustomItemsList();
        this.displayRptDialog = false;
      }else {
        this.growlMessageService.showErrorInfo('', data.msg || '创建失败！');
      }
    });
  }

  /**
     * 校验体征字典输入是否合法
     * @param signDict
     */
  checkSignDictFormat(signDict: CustomItems) {
    // let min = signDict.最小值;
    // let max = signDict.最大值;
    let name = signDict.体征名称;
    let code = signDict.体征代码;
    let order = signDict.排序;
    let signDialog = document.getElementById('sign-dict-dia');
    if (signDialog.getElementsByClassName('invalid').length > 0) {
        this.growlMessageService.showWarningInfo('输入内容有误，请检查');
        return false;
    }
    if (!code || code.length === 0) {
        this.growlMessageService.showWarningInfo('请填写体征代码');
        return false;
    }
    if (!name || name.length === 0) {
        this.growlMessageService.showWarningInfo('请填写体征名称');
        return false;
    }
    // if (!signDict.打印名称 || signDict.打印名称.length === 0) {
    //     this.growlMessageService.showWarningInfo('请填写体征打印名称');
    //     return false;
    // }
    if (!order) {
        signDict.排序 = 0;
    }
    // if (min && isNaN(min)) {
    //     this.growlMessageService.showWarningInfo('最小值应为数字');
    //     return false;
    // }

    // if (max && isNaN(max)) {
    //     this.growlMessageService.showWarningInfo('最大值应为数字');
    //     return false;
    // }

    if (order && isNaN(order) || Number(order) > 99 || Number(order) < 0) {
        this.growlMessageService.showWarningInfo('排序值应为0-99数字');
        return false;
    }
    return true;
}

  getCustomItemsList() {
    this.formService.getCustomItemsList(this.hospitalInfo, this.reportInfo).then(data => {
      if (data.code === 10000) {
          this.signDictList = data.data;
      }else {
        this.growlMessageService.showErrorInfo('', '获取自定义配置项数据失败！')
      }
    });
  }
}

