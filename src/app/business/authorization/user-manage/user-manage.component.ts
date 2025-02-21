import { OnInit, Component,ElementRef,ViewChild } from '@angular/core';
import { TreeNode } from 'portalface/widgets';
import {SysParamService} from "../../sys-param/sys-param.service";
import {AuthTokenService} from "../../../basic/auth/authToken.service";
import {CurrentUserInfo} from "../../../basic/common/model/currentUserInfo.model";
import {GrowlMessageService} from "../../../common/service/growl-message.service";
// import {RoleManageService} from "../role-manage/role-manage-service";
import {UserBean} from "./user.model";
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import {ClientUser} from "./clientUser";
import {environment} from "../../../../environments/environment";
import { LoadingService } from 'portalface/services';
import {RoleManageService} from "../../role-management/role-manage/role-manage-service";
@Component({
    selector: 'kyee-user-manage',
    templateUrl: './user-manage.component.html',
    styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {

  areasAndHospitals:TreeNode[];
  currentUserInfo:CurrentUserInfo;
  isSysAdmin:boolean;
  selectedNode:TreeNode;
  userList:any = [];
  searchParam:String;
  roleParam:String;
  currentAreaCode = '';
  currentHosCode = '';
  hosAreaCode = '';
  currentDeptCode = '';
  paginateInfo: object = {
    totalNum: 0, // 记录总数
    pageSize: 10, // 每页显示数量
    currentPage: 1 // 当前页
  };
  dialogTitle = '';
  isShowUserDialog:boolean = false;
  selectedUser = new UserBean();
  roles : any[];
  allDoctors : any[];
  selectDoctors : any[]; // 上级医师下拉列表
  clientUser = new ClientUser();
  importFileName: any; // 导入的文件名
  signatureBase64:String;
  isShowUserDetailDialog:boolean = false;
  showDataTable:boolean = false;
  filterHospitalName:String = '';

  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('batchFileUpload') batchFileUpload: ElementRef;

  uploader: FileUploader = new FileUploader({
    url:environment.apiUrl + 'admin-service/user/saveUser',
    method: 'POST',
    itemAlias: 'uploadfile',
    authToken: this.authTokenService.createAuthorizationTokenHeader(),
    autoUpload: false,
    allowedFileType: ['image'],
    parametersBeforeFiles: true,
    headers : [{name: 'charset', value: 'UTF-8'}]
  });

  batchUploader:FileUploader = new FileUploader({
    url:environment.apiUrl + 'admin-service/user/uploadPics',
    method:'POST',
    itemAlias: 'zipFile',
    authToken: this.authTokenService.createAuthorizationTokenHeader(),
    autoUpload: false,
    parametersBeforeFiles: true,
    headers : [{name: 'charset', value: 'UTF-8'}]
  });

  deleteDisplay = false;
    constructor( private sysParamService:SysParamService,
                 private authTokenService:AuthTokenService,
                 private growlMessageService: GrowlMessageService,
                 private roleManageService:RoleManageService,
                 private loadingService:LoadingService) {
    }

    ngOnInit() {
      this.currentUserInfo = this.sysParamService.getCurUser();
      if(!this.sysParamService.isAreaUser(this.currentUserInfo)){
        this.showDataTable = true;
        this.isSysAdmin = false;
        this.searchParam = '';
        this.roleParam = '';
        this.currentAreaCode = this.currentUserInfo['areaCode'];
        this.currentHosCode = this.currentUserInfo['hosNum'];
        this.hosAreaCode = this.currentUserInfo['nodeCode'];
        this.currentDeptCode = '';
        const params = {
          'areaCode' :this.currentAreaCode ,
          'hosCode' : this.currentHosCode,
          'hosAreaCode' : this.hosAreaCode,
          'deptCode':this.currentDeptCode,
          'key' : this.searchParam,
          'roleParam' : this.roleParam,
          'page' : this.paginateInfo
        };
        this.queryUserList(params);
        this.querAllDoctors(params);
      }else {
        this.showDataTable = false;
        this.isSysAdmin = true;
        this.getAreasAndHospitalsList();
      }
      // this.getAllRoles();
      this.uploader.onBuildItemForm = this.buildItemForm.bind(this);
      this.uploader.onSuccessItem = this.successFile.bind(this);
      this.uploader.onAfterAddingFile = this.afterAddFile.bind(this);
      this.uploader.onErrorItem = this.errorUploadFile.bind(this);

      this.batchUploader.onBuildItemForm = this.buidBatchItemForm.bind(this);
      this.batchUploader.onAfterAddingFile = this.afterBatchAddFile.bind(this);
      this.batchUploader.onSuccessItem = this.successBatchFile.bind(this);
      this.batchUploader.onErrorItem = this.errorBatchUploadFile.bind(this);

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

                let depts = hospital['科室列表'];
                if(depts.length > 0){
                  for(let dept of depts){
                    dept['label'] = dept['科室名称'];
                    dept['data'] = dept['科室ID'];
                  }
                }
                hospital['children'] = depts || [];
              }
              area['children'] = hospitals;
            }
          }
          this.areasAndHospitals = interfaceResult;
          this.updateUserList();
        }
        this.loadingService.loading(false);
      },
      error =>{
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('','获取区域及医院列表失败，请稍后再试');
      }
    );
  }

  updateUserList() {
    if (this.areasAndHospitals && this.areasAndHospitals.length > 0) {
      this.selectedNode = this.areasAndHospitals[0].children[0] || {};
      this.selectedNode.parent = this.areasAndHospitals[0];
      this.selectNode();
    }else {
      this.showDataTable = false;
    }
  }

  searchUser(){
    this.loadUserList();
  }

  selectNode(){
    if(this.selectedNode &&  this.selectedNode['parent'] == undefined && this.selectedNode['医院名称'] == null){
      this.growlMessageService.showWarningInfo('请选择医院或科室');
      this.showDataTable = false;
      return;
    }else {
      this.showDataTable = true;
      this.searchParam = '';
      this.roleParam = '';
      this.currentDeptCode = this.selectedNode['科室ID'];
      if(this.currentDeptCode == undefined){//选择的是医院
        this.currentAreaCode = this.selectedNode.parent["areaCode"]
        this.currentHosCode = this.selectedNode['医院编码'];
        this.hosAreaCode = this.selectedNode['院区编码'];
      }else {
        this.currentAreaCode = this.selectedNode.parent.parent["areaCode"];
        this.currentHosCode = this.selectedNode.parent["医院编码"];
        this.hosAreaCode = this.selectedNode.parent['院区编码'];
      }
      this.loadUserList();
      this.getAllRoles();
    }
  }

  loadUserList(){
    const params = {
      'areaCode' : this.currentAreaCode,
      'hosCode' : this.currentHosCode,
      'hosAreaCode' : this.hosAreaCode,
      'deptCode': this.currentDeptCode,
      'key' : this.searchParam,
      'roleParam' : this.roleParam,
      'page' : this.paginateInfo
    };
    this.queryUserList(params);
    this.querAllDoctors(params);
  }


  queryUserList(params){
    this.loadingService.loading(true);
    this.roleManageService.queryUserList(params).subscribe(
      result =>{
        if(result.code==10000 && result.data){
          let users = result.data.dataList;
          this.paginateInfo['totalNum'] = Number(result['data']['page'].totalRecords || 0);
          this.userList = [];
          if(users.length > 0){
            for(let user of users){
              let item = user;
              item['basUserId'] = item['_id'];
              item['userId'] = item['用户ID'];
              item['_id'] = '';
              if(user.clientUser == null || user.clientUser == ""){
                item['picName'] = null;
                item['userRoles'] = '';
                item['roles'] = null;
              }else {
                item['picName'] = user['clientUser']['picName'];
                item['picFileId'] = user['clientUser']['picFileId'];
                item['_id'] = user['clientUser']['_id'];
                item['picName'] = user['picName'];
                if(user['clientUser']['roles'] == null || user['clientUser']['roles'].length==0){
                   item['userRoles'] = '';
                   item['roles'] = null;
                }else{
                  item['roles'] = user['clientUser']['roles'];
                  let userRoles = '';//data-table列表中显示用户角色
                  for(let role of user['clientUser']['roles']){
                    userRoles = userRoles + role['角色名称'] + ',';
                  }
                  userRoles = userRoles.substring(0,userRoles.length - 1);
                  item['userRoles'] = userRoles;
                }
                if(user['clientUser']['selectDoctors'] == null || user['clientUser']['selectDoctors'].length == 0){
                  item['selectDoctors'] = null;
                  item['higherDoctors'] = '';
                }else {
                  item['selectDoctors'] = user['clientUser']['selectDoctors'];
                  let higherDoctors = '';// data-table列表中显示上级医师
                  for(let doctor of user['clientUser']['selectDoctors']){
                    higherDoctors = higherDoctors + doctor['用户名'] + ',';
                  }
                  higherDoctors = higherDoctors.substring(0,higherDoctors.length -1);
                  item['higherDoctors'] = higherDoctors;
                }
              }
              this.userList.push(item);
            }
          }
        }else {
          this.userList = [];
          this.paginateInfo['totalNum'] = 0;
          this.growlMessageService.showWarningInfo("未查询到用户信息")
        }
        this.loadingService.loading(false);
      },
      error =>{
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('',"查询用户信息失败，请稍后重试。")
      }
    );
  }

  querAllDoctors(params){
    this.roleManageService.querAllDoctors(params).subscribe(
      result =>{
        let data = result.data;
        this.allDoctors = [];
        for(let doctor of data){
          this.allDoctors.push({label:doctor['用户名'],value:doctor});
        }
      }
    );
  }

  getAllRoles(){
    const params = {
      '角色名称': this.roleParam,
      'areaCode' : this.currentAreaCode,
      'hosCode' : this.currentHosCode,
      'hosAreaCode' : this.hosAreaCode
    };
    this.roleManageService.getAllRoles(params).subscribe(
      result =>{
        if(result.code==10000 && result.data){
          if(result.data.length > 0){
            let data = result.data;
            this.roles = [];
            for(let role of data){
              this.roles.push({label:role['角色名称'],value:role})
            }
          }
        }
      },
      error =>{
        this.growlMessageService.showErrorInfo('','获取角色列表失败')
      }
    );
  }

  /**
   * @param event 分页
   */
  paginate(event) {
    if ((event.page + 1) !== this.paginateInfo['pageNo'] || this.paginateInfo['pageNo'] === 1) {
      this.paginateInfo['currentPage'] = event.page + 1 ;
      this.loadUserList();
    }
  }

  editUserInfo(user){
    this.selectedUser = user || new UserBean();
    let signatureFileId = this.selectedUser['picFileId'];
    if(signatureFileId !==null && signatureFileId !== '' && signatureFileId !== undefined){
      let param = "picFileId=" + signatureFileId;
      this.roleManageService.getSignature(param).subscribe(
        result =>{
          if(result.code == 10000 && result.data){
            let imagFileName = this.selectedUser['picName'];
            let fileType = imagFileName.substring(imagFileName.lastIndexOf('.') +1,imagFileName.length);
            this.signatureBase64 ='data:image/'+fileType +';base64,' + result.data;
            this.filterHigherDoctors(user);//过滤上级医生下拉列表

          }
          else{
            let errorinfo = result.msg;
            if(errorinfo){
              this.growlMessageService.showErrorInfo('',errorinfo);
            }
            else{
              this.growlMessageService.showErrorInfo('','获取签名失败，请稍后重试。');
            }
            let imagFileName = this.selectedUser['picName'];
            let fileType = imagFileName.substring(imagFileName.lastIndexOf('.') +1,imagFileName.length);
            this.signatureBase64 ='data:image/'+fileType +';base64,' + result.data;
            this.filterHigherDoctors(user);//过滤上级医生下拉列表
          }
          
        },
        error =>{
          this.growlMessageService.showErrorInfo('','获取签名失败，请稍后重试。');
        }
      );
    }else {
      this.filterHigherDoctors(user);//过滤上级医生下拉列表
    }
  }

  filterHigherDoctors(user){
     let currentRowDoctorName = user['用户名'];
     let currentRowDoctorId = user['登陆帐号'];
     this.selectDoctors = this.allDoctors.filter(item =>item['label'] != currentRowDoctorName && item.value["用户ID"] != currentRowDoctorId);
    this.isShowUserDialog = true;
  }

  showUserInfo(user){
    this.selectedUser = user || new UserBean();
    let signatureFileId = this.selectedUser['picFileId'];
    if(signatureFileId !==null && signatureFileId !== '' && signatureFileId !== undefined){
      let param = "picFileId=" + signatureFileId;
      this.roleManageService.getSignature(param).subscribe(
        result =>{
          if(result.code == 10000 && result.data){
            let imagFileName = this.selectedUser['picName'];
            let fileType = imagFileName.substring(imagFileName.lastIndexOf('.') +1,imagFileName.length);
            this.signatureBase64 ='data:image/'+fileType +';base64,' + result.data;
            this.selectDoctors = this.allDoctors;
            this.isShowUserDetailDialog = true;
          }
        },
        error =>{
          this.growlMessageService.showErrorInfo('','获取签名失败，请稍后重试。');
        }
      );
    }else {
      this.selectDoctors = this.allDoctors;
      this.isShowUserDetailDialog = true;
    }
  }

  /**
   * @param evt 上传签名
   */
  importFile(evt) {
    this.fileUpload.nativeElement.click();
  }

  /**
   * @param evt 批量上传签名
   */
  importBatchFile(evt){
    this.batchFileUpload.nativeElement.click();
  }

  saveEdit(){
    const fileItem = this.uploader.queue[0];
    let fileSize;
    if(fileItem){
      fileSize = fileItem.file.size;
    }
    if(fileItem == undefined){//未选择图片签名
      let additionalParameter  = {};
      let paramObj = {};
      paramObj['_id'] = this.selectedUser['_id'];
      paramObj['areaCode'] = this.currentAreaCode;
      paramObj['hosCode'] = this.currentHosCode;
      paramObj['hosAreaCode'] = this.hosAreaCode;
      paramObj['basUserId'] = this.selectedUser['basUserId'];
      paramObj['jobNumber'] = this.selectedUser['登陆帐号'];
      paramObj['picName'] = this.selectedUser['picName'];
      paramObj['picFileId'] = this.selectedUser['picFileId'];
      paramObj['roles'] = this.selectedUser['roles'];
      paramObj['selectDoctors'] = this.selectedUser['selectDoctors'];
      paramObj['userId'] = this.selectedUser['userId'];
      let param = 'clientUser='+JSON.stringify(paramObj) ;
      this.roleManageService.updateUser(param).subscribe(
        result =>{
          if(result.code==10000){
            this.isShowUserDialog = false;
            this.growlMessageService.showSuccessInfo('编辑用户成功');
            this.loadUserList();//刷新数据列表
          }
        },
        error =>{
          this.growlMessageService.showErrorInfo('','编辑用户失败');
        }
      );
    }else {
      if(fileSize < 10240){
        fileItem.upload();
      }else{
        this.compressImg(fileItem)
      }
    }

  }

  compressImg(fileItem) {
    const reader = new FileReader();
    // readAsDataURL 方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成DONE，并触发 loadend (en-US) 事件，
    // 同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
    reader.readAsDataURL(fileItem.file.rawFile);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        // 图片的宽高
        const w = img.width;
        const h = img.height;
        const canvas = document.createElement("canvas");
        // canvas对图片进行裁剪，这里设置为图片的原始尺寸
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // canvas中，png转jpg会变黑底，所以先给canvas铺一张白底
        ctx.fillStyle = "#fff";
        // fillRect()方法绘制一个填充了内容的矩形，这个矩形的开始点（左上点）在
        // (x, y) ，它的宽度和高度分别由width 和 height 确定，填充样式由当前的fillStyle 决定。
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 绘制图像
        ctx.drawImage(img, 0, 0, w, h);

        // canvas转图片达到图片压缩效果
        // 返回一个包含图片展示的 data URI base64 在指定图片格式为 image/jpeg 或 image/webp的情况下，
        // 可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
        const dataUrl = canvas.toDataURL("image/jpeg", 0.1);
        // base64格式文件转成Blob文件格式   拿到这个blobFile文件就可以上传给服务端
        const blobFile = this.dataURLtoBlob(dataUrl);
        const blobToFile = (blob, fileName) => {
          const file = new File([blob], fileName, { type: blob.type });
          return file;
        }

        let files = blobToFile(blobFile, fileItem.file.name)
        fileItem.file = files;
        fileItem.some = files;
        fileItem._file = files;
        fileItem.upload();
      };
    };
  }

  // canvas生成的格式为base64，需要进行转化
  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  cancelUpdate(){
    this.signatureBase64 = '';
    this.isShowUserDialog = false;
  }

  /**
   * 添加文件上传之前事件处理
   * @param fileItem
   */
  afterAddFile(fileItem: FileItem): any {
    let fileSize = fileItem.file.size;
    if (fileSize > 102400) {
        this.growlMessageService.showErrorInfo('','上传的签名图片大小大于100kb，无法上传');
        this.uploader.clearQueue();
        return;
    }else{
      this.importFileName = fileItem.file ? fileItem.file.name : '未命名文件';
    }
  }

  /**
   * 添加一个文件之后的回调
   * @param fileItem
   */
  afterBatchAddFile(fileItem: FileItem):any {
    this.batchUploader.queue[0] = fileItem;
  }

  /**
   * 移除添加的文件
   */
  removeFile() {
    this.fileUpload.nativeElement.value = '';
    this.importFileName = '';
    let fileItem = this.batchUploader.queue[0];
    this.uploader.clearQueue();
    this.batchUploader.queue[0] = fileItem;
  }

  /**
   * 关闭上传文件弹框之前清除数据
   */
  beforeHideImportFileDialog(evt) {
    this.fileUpload.nativeElement.value = '';
    this.importFileName = '';
    this.uploader.clearQueue();
    this.signatureBase64 = '';
  }
  /*
  * 通过右上角按钮关闭用户详情窗口
  * */
  beforeHideUserDetailDialog(event){
    this.signatureBase64 = '';
  }

  /*
  * 文件选择完成后的操作处理
  * */
  selectedFileOnChanged(){
    const batchFileItem = this.batchUploader.queue[0];
    this.batchFileUpload.nativeElement.value = '';
    if(batchFileItem == undefined || (batchFileItem.file.type != 'application/zip' && batchFileItem.file.type != 'application/x-zip-compressed')){
      this.batchUploader.clearQueue();
      this.growlMessageService.showWarningInfo('请选择zip类型图片签名压缩包');
      return;
    }else {
      let fileSize = batchFileItem.file.size;
      if (fileSize > 40000000) {
        this.growlMessageService.showErrorInfo('','文件大小大于40Mb，无法上传');
        return;
      } else {
        this.loadingService.loading(true);
        batchFileItem.upload();
      }
    }
  }

  /**
   * 文件上传成功回调
   */
  successFile(fileItem: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    if (status === 200) {
      // 上传文件后获取服务器返回的数据
      this.growlMessageService.showSuccessInfo("签名上传成功");
      this.cancelUpdate();
      this.loadUserList();//刷新数据
    }else {
      // 上传文件后获取服务器返回的数据错误
      this.growlMessageService.showErrorInfo('',"签名上传失败");
    }
  }

  successBatchFile(fileItem: FileItem, response: string, status: number, headers: ParsedResponseHeaders):any{
    this.batchUploader.clearQueue();
    this.loadingService.loading(false);
    if (status === 200) {
      // 上传文件后获取服务器返回的数据
      let result = JSON.parse(response);
      if(result['code'] == 10000){
        this.growlMessageService.showSuccessInfo("批量上传签名成功");
        this.loadUserList();//刷新数据
      }else {
        this.growlMessageService.showWarningInfo(result['msg']);
      }
    }else {
      // 上传文件后获取服务器返回的数据错误
      this.growlMessageService.showErrorInfo('',"签名上传失败");
    }
  }

  /**
   * 文件添加时上传之前事件响应
   * @param fileItem
   * @param form
   */
  buildItemForm(fileItem: FileItem, form: any): any {
    let additionalParameter  = {};
    let clientUser = {};
    //let filename = fileItem['file']["rawFile"]["name"] ? fileItem['file']["rawFile"]["name"]:'';
    //fileItem.file['name'] = filename;
    let filename = fileItem.file['name'];
    clientUser['_id'] = this.selectedUser['_id'];
    clientUser['areaCode'] = this.currentAreaCode;
    clientUser['hosCode'] = this.currentHosCode;
    clientUser['hosAreaCode'] = this.hosAreaCode;
    clientUser['userId'] = this.selectedUser['userId'];
    clientUser['basUserId'] = this.selectedUser['basUserId'];
    clientUser['jobNumber'] = this.selectedUser['登陆帐号'];
    clientUser['picName'] = filename;
    clientUser['picFileId'] = '';
    clientUser['roles'] = this.selectedUser['roles'];
    clientUser['selectDoctors'] = this.selectedUser['selectDoctors'];
    additionalParameter['clientUser'] = JSON.stringify(clientUser) ;
    this.uploader.setOptions({'additionalParameter': additionalParameter});
  }

  buidBatchItemForm(fileItem: FileItem, form: any):any{
    let batchUploadParam = {};
    batchUploadParam['areaCode '] = this.currentAreaCode;
    batchUploadParam['hosCode '] = this.currentHosCode;
    batchUploadParam['hosAreaCode'] = this.hosAreaCode;
    this.batchUploader.setOptions({'additionalParameter':batchUploadParam});
  }

  /**
   * 文件上传异常监听
   * @param fileItem
   */
  errorUploadFile(fileItem: FileItem): any {
    this.growlMessageService.showErrorInfo('','网络异常');
  }

  errorBatchUploadFile(fileItem: FileItem):any {
    this.loadingService.loading(false);
    this.batchUploader.clearQueue();
    this.growlMessageService.showErrorInfo('','网络异常');
  }

  // 删除签名 
  deleteFile(evt) {
    console.log(evt);
    this.deleteDisplay = true;
  }
  delete(){
    this.deleteDisplay = false;
    let params = "areaCode="+this.selectedUser['areaCode']+"&hosCode="+this.selectedUser['医院编码']+"&hosAreaCode="+this.selectedUser['院区编码']+"&jobNumber="+this.selectedUser['登陆帐号']+"&userId="+this.selectedUser['userId'] + "&picFileId=" + this.selectedUser['picFileId'];
    this.roleManageService.deleteSignature(params).subscribe(
      result =>{
        if(result.code==10000 && result.data == '删除成功'){
          this.signatureBase64 = '';
          this.selectedUser['picName'] = null;
          this.selectedUser['picFileId'] = null;
          this.growlMessageService.showSuccessInfo('删除该图片签名成功');
        }else{
          this.growlMessageService.showErrorInfo('','删除该图片签名失败')          
        }
      },
      error =>{
        this.growlMessageService.showErrorInfo('','删除该图片签名失败')
      }
    );
  }
  cancel(){
    this.deleteDisplay = false;
  }

}
