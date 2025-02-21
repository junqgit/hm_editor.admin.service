import { OnInit, Component } from '@angular/core';
import { ConfirmationService } from "portalface/widgets";
import { AppManageService } from "./app-manage-service"
import { LoadingService } from 'portalface/services';
import { SysParamService } from "../../sys-param/sys-param.service";
import { Message } from 'portalface/widgets';
import { ChineseUtils } from '../../../utils/ChineseUtils';

@Component({
  selector: 'kyee-app-manage',
  templateUrl: './app-manage.component.html',
  styleUrls: ['./app-manage.component.scss']
})
export class AppManageComponent implements OnInit {
  isShowAddDialog: boolean = false;
  searchUserName: string = '';
  searchSysName: string = '';
  currentUserInfo = {};
  systemNames = [];
  selectionUsers = [];
  authorizationInfoList = [];
  msgs: Message[];
  type: string = 'create';
  header: string = '新增授权信息';
  authorizationInfo: any = {
    sysname: '',
    syscode: '',
    username: '',
    password: '',
    showPassword: false,
    status: true
  }
  paginateInfo: any = {
    totalNum: 0,
    pageSize: 10,
    pageNo: 1,
    first:0
  };
  constructor(
    private confirmationService: ConfirmationService,
    private appManageService: AppManageService,
    private loadingService: LoadingService,
    private sysParamService: SysParamService
  ) { }

  ngOnInit() {
    this.doSearch();
    this.currentUserInfo = this.sysParamService.getCurUser();
  }

  showAddDialog(type) {
    this.isShowAddDialog = true;
    this.type = type;
    if (this.type === 'create') {
      this.header = '新增授权信息';
    } else {
      this.header = '修改授权信息';
    }
  }

  closeAddDialog() {
    this.isShowAddDialog = false;
    this.clearAuthorizationInfo();
  }
  nameBlur(event){
    this.authorizationInfo.syscode=ChineseUtils.getChineseFirstPY(this.authorizationInfo.sysname,null);
  }
  addOrUpdate() {
    if (!this.authorizationInfo.sysname ||!this.authorizationInfo.syscode || !this.authorizationInfo.username || !this.authorizationInfo.password) {
      this.showMessage('warn', '提示', '未填写必填项!');
      return;
    }
    if (this.authorizationInfo['_id']) {
      this.updateAuthorizationInfo(this.authorizationInfo);
    } else {
      this.loadingService.loading(true);
      let params: any = {};
      params.sysname = this.authorizationInfo.sysname;
      params.status = this.authorizationInfo.status ? 'Y' : 'N';
      params.syscode = this.authorizationInfo.syscode;
      params.username = this.authorizationInfo.username;
      params.password = this.authorizationInfo.password;
      this.appManageService.addorUpdateAuthorizationInfo(params).then((result) => {
        if (result.code == '10000') {
          this.showMessage('success', '成功', '保存成功');
          this.doSearch();
          this.clearAuthorizationInfo();
          this.isShowAddDialog = false;
        } else {
          this.showMessage('warn', '提示', result.msg || '新增失败');
        }
        this.loadingService.loading(false);
      }, error => {
        this.loadingService.loading(false);
        this.showMessage('error', '异常', error.message || '网络异常');
      });
    }
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }

  doSearch(type?:string) {
    if(!type){
      this.paginateInfo.pageNo = 1;
      this.paginateInfo.first = 0;
    }

    this.loadingService.loading(true);
    this.appManageService.getAuthorizationInfo(this.searchUserName, this.paginateInfo.pageNo, this.paginateInfo.pageSize, this.searchSysName).then((result) => {
      if (result.code == '10000') {
        let list = result.data.dataList;
        list.forEach(item => {
          item.status = item.status === 'Y';
          item.showPassword = false;
        })
        this.authorizationInfoList = result.data.dataList;
        this.paginateInfo.totalNum = result.data.total;
      } else {
        this.showMessage('warn', '提示', result.msg || '新增失败');
      }
      this.loadingService.loading(false);
    }, error => {
      this.loadingService.loading(false);
      this.showMessage('error', '异常', error.message || '网络异常');
    });
  }

  doDelete() {
    if (!this.selectionUsers.length) {
      this.showMessage('warn', '提示', '请先选择账号!');
      return;
    }
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除吗？',
      accept: () => {
        this.deleteAuthorizationInfo();
      }
    });
  }

  doUpdate(data) {
    this.authorizationInfo = { ...data };
    this.showAddDialog('update');
  }

  clearAuthorizationInfo() {
    this.authorizationInfo = {
      sysname: '',
      syscode: '',
      username: '',
      password: '',
      status: true
    }
  }

  updateAuthorizationInfo(userInfos) {
    this.loadingService.loading(true);
    let params: any = {};
    params.sysname = userInfos.sysname;
    params.status = userInfos.status ? 'Y' : 'N';
    params.syscode = userInfos.syscode;
    params.username = userInfos.username;
    params.password = userInfos.password;
    params['_id'] = userInfos['_id'];
    this.appManageService.addorUpdateAuthorizationInfo(params).then((result) => {
      if (result.code == '10000') {
        this.showMessage('success', '成功', '修改成功');
        this.doSearch();
        this.clearAuthorizationInfo();
        this.isShowAddDialog = false;
      } else {
        this.showMessage('warn', '提示', result.msg || '新增失败');
      }
      this.loadingService.loading(false);
    }, error => {
      this.loadingService.loading(false);
      this.showMessage('error', '异常', error.message || '网络异常');
    });
  }

  deleteAuthorizationInfo() {
    this.loadingService.loading(true);
    var ids = this.selectionUsers.map(item => item['_id']).join(',');
    this.appManageService.deleteAuthorizationInfo({ idList: ids }).then((result) => {
      if (result.code == '10000') {
        this.showMessage('success', '成功', '删除成功');
        this.doSearch();
      } else {
        this.showMessage('warn', '提示', result.msg || '新增失败');
      }
      this.loadingService.loading(false);
    }, error => {
      this.loadingService.loading(false);
      this.showMessage('error', '异常', error.message || '网络异常');
    });
  }

  lazyLoad($event) {
    this.paginateInfo.first = $event.first;
    this.paginateInfo.pageNo = ($event.first / $event.rows) + 1;
    this.paginateInfo.pageSize = $event.rows;
    this.doSearch('page');
  }

  isShowPassword(value, type) {
    value.showPassword = type;
  }
}
