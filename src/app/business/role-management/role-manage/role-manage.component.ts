import { AuthTokenService } from './../../../basic/auth/authToken.service';
import { CurrentUserInfo } from './../../../basic/common/model/currentUserInfo.model';
import { OnInit, Component } from '@angular/core';
import { Message } from 'portalface/widgets';
import { RoleManageService } from './role-manage-service';
import {GrowlMessageService} from "../../../common/service/growl-message.service";
import { TreeNode } from 'portalface/widgets';
import { LoadingService } from 'portalface/services';
import {SysParamService} from "../../sys-param/sys-param.service";

@Component({
    selector: 'kyee-role-manage',
    templateUrl: './role-manage.component.html',
    styleUrls: ['./role-manage.component.scss']
})
export class RoleManageComponent implements OnInit {
    searchRoleName: string ='';
    searchRoleCode: string ='';
    searchResults: any = []; // 搜索结果列表
    tableLoadingFlag: Boolean = false;
    msgs:  Message[];
    paginateInfo: object = {
        totalNum: 0, // 记录总数
        pageSize: 10, // 每页显示数量
        pageNo: 1 // 当前页
    };
    isShowAddRoleDialog: Boolean = false;
    selectedRoleInfo: any = {
      selectRoleName: '',
      selectRoleId: '',
      selectedMenus: []
    };
    isShowDeleteRoleDialog: Boolean = false;
    dialogTitle:string = '新增角色';
    isHospitalRole: Boolean = false;
    currentUserInfo: CurrentUserInfo;
    isSysAdmin:boolean;
    showDataTable:boolean = false;
    currentAreaCode = '';
    currentHosCode = '';
    hosAreaCode = '';
    selectedNode:TreeNode;
    filterHospitalName:String = '';
    areasAndHospitals:TreeNode[];
    menus : TreeNode[]=[];
    allDefaultMenus: TreeNode[] = []; // 存放当前医院默认的所有菜单
    selectedRole: {};
    currentMenus : TreeNode[]=[];
    first: number = 0; // 角色列表页码重置

    constructor(
        private roleManageService:RoleManageService,
        private authTokenService: AuthTokenService,
        private growlMessageService: GrowlMessageService,
        private loadingService:LoadingService,
        private sysParamService:SysParamService
    ) {}

    ngOnInit() {
        this.currentUserInfo = this.sysParamService.getCurUser();
        if(!this.sysParamService.isAreaUser(this.currentUserInfo)){
            this.isHospitalRole = true;
            this.showDataTable = true;
            this.isSysAdmin = false;
            this.currentAreaCode = this.currentUserInfo['areaCode'];
            this.currentHosCode = this.currentUserInfo['hosNum'];
            this.hosAreaCode = this.currentUserInfo['nodeCode'];
            this.loadDefaultMenus();
        }else {
          this.showDataTable = false;
          this.isSysAdmin = true;
          this.getAreasAndHospitalsList();
        }
    }

    loadDefaultMenus() {
      this.roleManageService.getDefaultMenus().subscribe(
        result =>{
          if(result.code = 10000 && result.data) {
            this.allDefaultMenus = result.data || [];
            this.search();
          }
        }
      );
    }

    doSearch() {
        let element = document.getElementsByClassName('ui-paginator-page')[0] as HTMLElement;
        const firstele = document.getElementsByClassName('ui-paginator-first')[0] as HTMLElement;
        if (firstele.getAttribute('class').indexOf('ui-state-disabled') === -1) {
          element = firstele;
        }
        element.click();
    }


    /**
    * @param event 分页
    */
    // paginate(event) {
    //     // if ((event.page + 1) !== this.paginateInfo['pageNo'] || this.paginateInfo['pageNo'] === 1) {
    //     //     this.paginateInfo['pageNo'] = event.page + 1 ;
    //     //     this.search();
    //     // }
    //   let page = event.first / this.paginateInfo['pageSize'];
    //   if ((page + 1) !== this.paginateInfo['pageNo'] || this.paginateInfo['pageNo'] === 1) {
    //     this.paginateInfo['pageNo'] = page + 1 ;
    //     this.search();
    //   }
    // }

    /**
     * 消息组件
     * @param severity
     * @param summary
     * @param detail
     */
    showMessage(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    search(menusOfCurrentRole?: any) {
      const params = {
          '角色名称': this.searchRoleName,
          '角色编码': this.searchRoleCode,
          'pageNo': this.paginateInfo['pageNo'],
          'pageSize': this.paginateInfo['pageSize'],
          'areaCode' : this.currentAreaCode,
          'hosCode' : this.currentHosCode,
          'hosAreaCode' : this.hosAreaCode
      };
      this.loadingService.loading(true);
      this.roleManageService.getAllRoles(params).subscribe((result) => {
        this.tableLoadingFlag = false;
        this.loadingService.loading(false);
        if (!menusOfCurrentRole) {
          this.selectedRole = {};
        }
        this.first = 0;
        this.currentMenus = [];
        this.searchResults = [];
        if (!result) {
            this.paginateInfo['totalNum'] = 0;
            return ;
        }
        this.searchResults = result['data'] || [];
        this.paginateInfo['totalNum'] = Number(result['data'].length || 0);
        if (menusOfCurrentRole) {
          let selectedRole = this.searchResults.filter((item: any, index: number) => {
            if (item['_id'] === this.selectedRole['_id']) {
              return item;
            }
          })[0];
          this.selectRole({data: selectedRole});
        }
      }, error => {
          this.tableLoadingFlag = false;
          this.paginateInfo['totalNum'] = 0;
          this.loadingService.loading(false);
          this.showMessage('error', '异常', error.message || '网络异常');
      });
    }

  /**
   * 新增角色
   * @param evt
   */
  showAddRoleDialog(type, template) {
      if(type == 'update'){
          this.dialogTitle = '编辑角色';
          this.selectedRoleInfo.selectRoleId = template._id;
          this.selectedRoleInfo.selectRoleName = template.角色名称;
          if(this.selectedRoleInfo.selectedMenus.length==0 && this.currentMenus.length!=0){
            var defaultMenus = Object.assign([],this.currentMenus);
            for (let i = 0; i < defaultMenus.length; i++) {
              if (defaultMenus[i]['checked'] == true && (!defaultMenus[i]['children'] || defaultMenus[i]['children'].length==0)) {
                this.selectedRoleInfo.selectedMenus.push(defaultMenus[i]);
              }else if (defaultMenus[i]['children'] && defaultMenus[i]['children'].length>0) {
                for (let j = 0; j < defaultMenus[i]['children'].length; j++) {
                  if (defaultMenus[i]['children'][j]['checked'] == true) {
                    this.selectedRoleInfo.selectedMenus.push(defaultMenus[i]['children'][j]);
                  }
                }
              }
            }
          }
      }else{
          this.dialogTitle = '新增角色';
          this.selectedRoleInfo.selectRoleId = '';
          this.selectedRoleInfo.selectRoleName = '';
      }
      if(!template.menus){
        this.menus =  Object.assign([], this.allDefaultMenus);
      }
      this.isShowAddRoleDialog = true;
  }

  confirmAddRole() {
    if (!this.selectedRoleInfo.selectRoleName || !this.selectedRoleInfo.selectRoleName.trim()) {
      this.showMessage('warn', '警告', '角色名称不能为空');
      return;
    }
    if (!this.selectedRoleInfo.selectedMenus || this.selectedRoleInfo.selectedMenus.length === 0) {
      this.showMessage('warn', '警告', '角色菜单不能为空');
      return;
    }
    const params = {
        '_id': this.selectedRoleInfo.selectRoleId,
        '角色名称': this.selectedRoleInfo.selectRoleName
    };
    params['areaCode'] = this.currentAreaCode;
    params['hosCode'] = this.currentHosCode;
    params['hosAreaCode'] = this.hosAreaCode;
    let menusOfCurrentRole = [];
    let selectedMenus = Object.assign([],this.selectedRoleInfo.selectedMenus);
    if(selectedMenus != undefined && selectedMenus.length > 0){
      for(let item of selectedMenus){
        let menu = {};
        menu['data'] = item['data'];
        if(item['_id'] != undefined && item['_id'] != null){
          menu['_id'] = item['_id'];
        }else {
          menu['parentId'] = item['parent']['_id'];
        }
        menusOfCurrentRole.push(menu);
      }
      params['menus'] = menusOfCurrentRole;
    }
    if(this.dialogTitle == '新增角色'){
        params['_id'] = null;
        this.roleManageService.addRole(params).then((result) => {
          if (result.code == '10000') {
            this.search();
            this.showMessage('success', '提示', result.msg || '新增成功');
            this.isShowAddRoleDialog = false;
          }else {
            this.showMessage('warn', '提示', result.msg || '新增失败');
          }
          this.tableLoadingFlag = false;
        }, error => {
            this.tableLoadingFlag = false;
            this.showMessage('error', '异常', error.message || '网络异常');
        });
    }else{
        this.roleManageService.updateRole(params).then((result) => {
          if (result.code == '10000') {
            this.showMessage('success', '提示', result.msg || '编辑成功');
            this.search(menusOfCurrentRole);
            this.isShowAddRoleDialog = false;
          }else {
            this.showMessage('warn', '提示', result.msg || '编辑失败');
          }
          this.tableLoadingFlag = false;
        }, error => {
            this.tableLoadingFlag = false;
            this.showMessage('error', '异常', error.message || '网络异常');
        });
    }
  }


  showDeleteRoleDialog(template){
    this.selectedRoleInfo.selectRoleId = template._id;
    this.selectedRoleInfo.selectRoleName = template.角色名称;
    this.isShowDeleteRoleDialog = true;
  }

  confirmDeleteRole(){
    const params = {
        '_id': this.selectedRoleInfo.selectRoleId,
        '角色名称': this.selectedRoleInfo.selectRoleName
    };
    this.roleManageService.deleteRole(params).then((result) => {
        this.tableLoadingFlag = false;
        if(result.code && 10000 == result.code){
          this.showMessage('success','提示','删除成功');
          this.isShowDeleteRoleDialog = false;
          this.search();
        }else {
          this.showMessage('error','提示',result.msg);
        }
        }, error => {
            this.tableLoadingFlag = false;
            this.showMessage('error', '异常', error.message || '网络异常');
        });
    }

  selectNode(){
    if(this.selectedNode &&  this.selectedNode['parent'] == undefined && this.selectedNode['医院名称'] == null){
      this.growlMessageService.showWarningInfo('请选择医院');
      this.showDataTable = false;
      return;
    }else {
      this.showDataTable = true;
      this.currentAreaCode = this.selectedNode.parent["areaCode"]
      this.currentHosCode = this.selectedNode['医院编码'];
      this.hosAreaCode = this.selectedNode['院区编码'];
      this.loadDefaultMenus();
    }
  }

  getAreasAndHospitalsList(){
    this.loadingService.loading(true);
    this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
      apiResult =>{
        if(apiResult.code == 10000 && apiResult.data){
          let interfaceResult = apiResult.data;
          for(let area of interfaceResult){
            area['label'] = area['areaName'].toString();
            area['data'] = area['areaCode'].toString();
            area['expanded'] = true;//区域默认展开
            area['expandedIcon']= 'fa-folder-open';
            area['collapsedIcon'] = 'fa-folder';
            area['children'] = [];
            area['checked'] = true;
            let hospitals = area['hospitalParam'];
            if(hospitals.length > 0){
              let childrens = [];
              for (let hospital of hospitals){
                hospital['label'] = hospital['医院名称'];
                hospital['data'] = hospital['医院编码'];
                hospital['院区编码'] = hospital['院区编码'];
              }
              area['children'] = hospitals;
            }
          }
          this.areasAndHospitals = interfaceResult;
          if (this.areasAndHospitals[0] && this.areasAndHospitals[0]['children'].length > 0){
            this.selectedNode = this.areasAndHospitals[0]['children'][0];
            this.selectedNode['parent'] = this.areasAndHospitals[0];
            this.selectNode();
          }
        }
        this.loadingService.loading(false);
      },
      error =>{
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('','获取区域及医院列表失败，请稍后再试');
      }
    );
  }

  /**
   * 弹框关闭时，清除他弹框填写值
   */
  clearSelectedRoleInfo() {
    this.selectedRoleInfo.selectRoleId = '';
    this.selectedRoleInfo.selectRoleName = '';
    this.selectedRoleInfo.selectedMenus = [];
  }

  showSelectRoleMenus(params: any) {
    let menus = params['menus'] || [];
    this.currentMenus = [];
    let defaultMenus = [];
    if (menus.length > 0) {
      for(let value of this.allDefaultMenus){
        let newValue = Object.assign({}, value);
        if (newValue['children'] && newValue['children'].length > 0) {
          let selectedChildNum = 0;
          let childrens = [];
          for (let child of newValue['children']){
            let newChild = Object.assign({}, child);
            let selectedMenu = menus.filter((item: any) => {
                return newValue['_id'] == item['parentId'] && newChild['data'] == item['data'];
            })[0];
            if (selectedMenu) {
              newChild['checked'] = true;
              selectedChildNum++;
            }
            childrens.push(newChild);
          }
          newValue['children'] = childrens;
          if (selectedChildNum == childrens.length) {
            newValue['checked'] = true;
          }
        }else {
          let selectedParentMenu = menus.filter((item: any) => {
            return newValue['_id'] == item['_id'] && newValue['data'] == item['data'];
          })[0];
          if (selectedParentMenu) {
            newValue['checked'] = true;
          }
        }
        defaultMenus.push(newValue);
      }
      this.menus = [].concat(defaultMenus);
      for (let i = 0; i < defaultMenus.length; i++) {
        if (defaultMenus[i]['checked'] == true && (!defaultMenus[i]['children'] || defaultMenus[i]['children'].length==0)) {
          this.currentMenus.push(defaultMenus[i]);
        }
        if (defaultMenus[i]['children'] && defaultMenus[i]['children'].length>0) {
          let obj = Object.assign({},defaultMenus[i]);
          obj['children'] = [];
          for (let j = 0; j < defaultMenus[i]['children'].length; j++) {
            if (defaultMenus[i]['children'][j]['checked'] == true) {
              obj['children'].push(defaultMenus[i]['children'][j]);

            }
          }
          if (obj['children'].length > 0) {
            this.currentMenus.push(obj);
          }
        }
      }
      this.selectedRoleInfo.selectedMenus = Object.assign([], this.currentMenus);
    }
  }

  selectRole(evt) {
    this.selectedRole = evt.data;
    this.showSelectRoleMenus(evt.data);
  }
}
