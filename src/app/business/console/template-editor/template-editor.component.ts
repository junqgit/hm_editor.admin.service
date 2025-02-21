import { TemplateService } from './../template.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { SysParamService } from '../../sys-param/sys-param.service';
import { ConfirmationService } from 'portalface/widgets';
import { LoadingService } from 'portalface/services';
import { AuthTokenService } from '../../../basic/auth/authToken.service';

@Component({
  selector: 'kyee-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {

  msgs: any[];
  hospitalList: any;
  selectedHispital: any;
  selectedScope: any;CurrentUserInfo
  deptmentList: any[]; // 科室列表
  selectedDeptment: any;
  templateDirs: any;
  dirLoadingFlag: false; // 模板目录加载效果是否开启
  selectedTemplateDir: any; // 当前选中模板目录
  emrTemplates: any[]; // 病历模板列表
  templateLoadingFlag: false; // 模板加载效果开启标识
  selectedTemplate: any; // 当前选择模板
  allTemplateData: any;
  templatesOrderRule: string; // 模版排序规则

  editorDisplay: Boolean = false;
  selectedNewDirs: any;
  newHospitalList: object;
  @ViewChild ('editorIframe') editorIframe: ElementRef;
  @ViewChild ('dirTable') dirTable: any;

  isShowUploadDialog: Boolean = false; // 是否显示文件上传弹框
  importFileDeptmentList: any[]; // 选择文件上传模态框中科室列表
  selectedImportFileHispital: any; // 选择将要导入的医院名称
  selectedImportFileScope: any; // 选择将要导入的医院类型或者科室类型
  selectedImportFileDeptment: any; // 选择将要导入的科室
  importFileName: any; // 导入的文件名
  isHospitalRole: Boolean = false;
  currentUserInfo: CurrentUserInfo;

  // @ViewChild('fileUpload') fileUpload: ElementRef;

  // uploader: FileUploader = new FileUploader({
  //   url: environment.apiUrl + 'admin-service/template/importTemplateZip',
  //   method: 'POST',
  //   itemAlias: 'uploadfile',
  //   authToken: this.authTokenService.createAuthorizationTokenHeader(),
  //   autoUpload: false,
  //   parametersBeforeFiles: true,
  //   headers : [{name: 'charset', value: 'UTF-8'}]
  // });

  constructor(
    private authTokenService: AuthTokenService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private sysParamService:SysParamService,
    private templateService:TemplateService
  ) { }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    if(!this.sysParamService.isAreaUser(this.currentUserInfo)){
      this.isHospitalRole = true;
    }
    this.initHospitalList();
    // this.uploader.onBuildItemForm = this.buildItemForm.bind(this);
    // this.uploader.onSuccessItem = this.successFile.bind(this);
    // this.uploader.onAfterAddingFile = this.afterAddFile.bind(this);
    // this.uploader.onErrorItem = this.errorUploadFile.bind(this);
  }

  /**
   * 显示导入文件模态框
   * @param evt
   */
  showImportFileDialog(evt) {
    this.selectedImportFileHispital = this.selectedHispital;
    this.importFileDeptmentList = this.deptmentList;
    this.selectedImportFileScope = this.selectedScope;
    if (this.selectedImportFileScope === 'deptment') {
      this.selectedImportFileDeptment = this.selectedDeptment;
    }
    this.isShowUploadDialog = true;
  }

  /**
   * 改变上传文件所属医院
   */
  changeImportFileHospital(evt) {
    this.importFileDeptmentList = this.selectedImportFileHispital['科室列表'];
    this.changeImportFileScope('area');
  }

  /**
   * 切换医院或者科室
   * @param type
   */
  changeImportFileScope(type) {
    this.selectedImportFileScope = type;
    if (type !== 'deptment') {
      this.selectedImportFileDeptment = null;
    }else {
      this.selectedImportFileDeptment = this.importFileDeptmentList[0];
    }
  }

  /**
   * 取消上传
   */
  closeUploadDialog() {
    this.isShowUploadDialog = false;
  }

  /**
   * 关闭上传文件弹框之前清除数据
   */
  // beforeHideImportFileDialog(evt) {
  //   this.selectedImportFileHispital = {};
  //   this.selectedImportFileScope = '';
  //   this.selectedImportFileDeptment = {};
  //   this.importFileDeptmentList = [];
  //   this.fileUpload.nativeElement.value = '';
  //   this.importFileName = '';
  //   this.uploader.clearQueue();
  // }

  /**
   * 确认上传
   */
  // confirmUpload() {
  //   if  (this.uploader.queue.length === 0) {
  //     this.showMessage('warn', '', '请先选择文件，再上传');
  //     return;
  //   }
  //   if (this.uploader.queue[0].isUploading) {
  //     this.showMessage('warn', '', '文件正在上传中...');
  //     return;
  //   }
  //   const fileItem = this.uploader.queue[0];
  //   if(fileItem._file.name.startsWith("template")){
  //     this.showMessage('warn', '', '此处请导入console平台模板，该模板可在模板管理处导入');
  //     return;
  //   }
  //   fileItem.upload();
  // }

  /**
   * 文件添加时上传之前事件响应
   * @param fileItem
   * @param form
   */
  // buildItemForm(fileItem: FileItem, form: any): any {
  //   let additionalParameter  = {};
  //   let selectedImportFileHispital = this.selectedImportFileHispital || {};
  //   let selectedImportFileDeptment = this.selectedImportFileDeptment || {};
  //   additionalParameter['areaCode'] = selectedImportFileHispital['areaCode'];
  //   additionalParameter['hospitalCode'] = selectedImportFileHispital['院区编码'];
  //   additionalParameter['hospitalId'] = selectedImportFileHispital['医院编码'];
  //   additionalParameter['scope'] = this.selectedImportFileScope;
  //   additionalParameter['deptmentId'] = selectedImportFileDeptment['科室ID'];
  //   let filename = fileItem.file['name'] ? fileItem.file['name'].replace(/([^\u0000-\u00FF])/g, '') : '';
  //   fileItem.file['name'] = filename;
  //   this.uploader.setOptions({'additionalParameter': additionalParameter});
  // }

  /**
   * 文件上传成功回调
   */
  successFile(fileItem: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    if (status === 200) {
      // 上传文件后获取服务器返回的数据
      if(response && JSON.parse(response).code == 10000){
        this.showMessage('success', '', '模板导入成功');
      }else{
        this.showMessage('error', '', '模板导入失败');
      }
      this.selectedTemplateDir = null;
      this.closeUploadDialog();
      this.updateTemplateDirsData(null);
    }else {
      // 上传文件后获取服务器返回的数据错误
      this.showMessage('error', '', '文件导入失败');
    }
  }

  /**
   * 添加文件上传之前事件处理
   * @param fileItem
   */
  afterAddFile(fileItem: FileItem): any {
    this.importFileName = fileItem.file ? fileItem.file.name : '未命名文件';
  }

  /**
   * 文件上传异常监听
   * @param fileItem
   */
  errorUploadFile(fileItem: FileItem): any {
    this.showMessage('error', '', '网络异常');
  }

  /**
   * 移除添加的文件
   */
  // removeFile() {
  //   this.fileUpload.nativeElement.value = '';
  //   this.importFileName = '';
  // }

  /**
   * 初始化医院信息
   */
  initHospitalList() {
    this.sysParamService.queryHospitalListByRole().then(data => {


      this.hospitalList = data || [];

      this.selectedHispital = this.hospitalList[0];
      this.updateDeptList();
      if(this.isHospitalRole){
        this.changeScope('hospital');
        for(let i=0;i<this.hospitalList.length;i++){
          if(this.hospitalList[i]['医院编码'] == this.currentUserInfo.hosNum){
            this.selectedHispital=this.hospitalList[i];
          }
        }
      }else{
        this.changeScope('area');
      }

    });
  }

  /**
   * 更新模板相关数据
   */
  updateTemplateDirsData(templateDir: any) {
    this.loadingService.loading(true);
    let selectedDeptment = this.selectedDeptment || {};
    let selectedHispital = this.selectedHispital || {};
    let searchParams = {
      'areaCode': selectedHispital['areaCode'] || '',
      '医院编码': selectedHispital['医院编码']　|| '',
      '院区编码': selectedHispital['院区编码'] || '',
      '科室ID': selectedDeptment['科室ID'] || '',
      'scope': this.selectedScope || ''
    };
    this.templateService.queryDirAndTemplateList(searchParams).then(data => {
      this.templateDirs = data || [];
      let selectTemplateDir = templateDir || {};
      let index = this.templateDirs.findIndex(dir => dir['目录名称'] === selectTemplateDir['目录名称']);
      if (index < 0) {
        index = 0;
      }
      this.selectedTemplateDir = this.templateDirs[index];
      this.updateTemplateList();
      if (templateDir && index === 0 && this.dirTable.el.nativeElement.children[0].children[0].querySelector('.ui-datatable-scrollable-body')) {
        this.dirTable.el.nativeElement.children[0].children[0].querySelector('.ui-datatable-scrollable-body').scrollTop = 0;
      }
      this.loadingService.loading(false);
    });

    //获取所选医院的配置
    let searchParams1 = {
      '医院编码': selectedHispital['医院编码'] || '',
      '院区编码': selectedHispital['院区编码'] || ''
    };
    this.templateService.getHospitalPrams(searchParams1).then(
      data => {
        if(data){
          this.templatesOrderRule = data['病历模板排序规则'];
        }}
    );
  }

  /**
   * 更新模板目录对应的模板列表
   */
  updateTemplateList() {
    this.selectedTemplate = null;
    if (this.selectedTemplateDir) {
      this.emrTemplates = this.selectedTemplateDir['模板列表'];
    }else {
      this.emrTemplates = [];
    }
  }

  /**
   * @param evt 导入模板文件
   */
  // importFile(evt) {
  //   this.fileUpload.nativeElement.click();
  // }

  /**
   * 更新科室列表数据
   */
  updateDeptList() {
    if (this.selectedHispital) {
      this.deptmentList = this.selectedHispital['科室列表'] || [];
      this.selectedDeptment = this.deptmentList[0];
    }else {
      this.deptmentList = [];
      this.selectedDeptment = {};
    }
  }

  /**
   *
   * @param evt 选择医院
   */
  changeHospital(evt) {
    this.selectedHispital = evt.value;
    this.updateDeptList();
    this.changeScope('area');
  }

  /**
   *
   * @param evt 改变科室
   */
  changeDeptment(evt) {
    this.selectedDeptment = evt.value;
    this.updateTemplateDirsData(null);
  }

  /**
   * 切换医院和科室并更新模板
   */
  changeScope(typeName) {
    this.selectedScope = typeName;
    if ('deptment' === typeName) {
      this.selectedDeptment = this.deptmentList ? this.deptmentList[0] : null;
    }else {
      this.selectedDeptment = null;
    }
    this.updateTemplateDirsData(null);
  }

  /**
   *
   * @param template 预览模板内容
   */
  previewTemplate(template) {

    const 模板存储地址 = template['模板存储地址'] || '';
    const 模板ID = template['模板ID'];
    const 模板名称 = template['模板名称'];
    const 版本 = template['版本'];
    const 序号 = template['序号'];
    const 模板别名 = template['模板别名'];
    const 模板类型 = template['模板类型'];
    const 模板收藏全名 = template['模板收藏全名'];

    let editorUrl = environment.editorUrl + 'editor.html'
      + '?模板ID=' + 模板ID
      + '&模板名称=' + 模板名称.replace('#', '%23')
      + '&模板存储地址=' + 模板存储地址
      + '&序号=' + 序号
      + '&模板别名=' + 模板别名
      + '&模板类型=' + 模板类型
      + '&模板收藏全名=' + 模板收藏全名;

    const editorMode = '只读模板';

    editorUrl = editorUrl + '&editorMode=' + editorMode;
    const iframe = <HTMLIFrameElement> this.editorIframe.nativeElement;

    iframe.contentWindow.location.href = editorUrl;
    this.editorDisplay = true;
  }

  /**
   *
   * @param template 删除模板内容
   */
  deleteTemplate(template) {

    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除该模板吗？',
      accept: () => {
        let templateName : string = template['模板名称'];
        let templateId: string = template['模板ID'];
        templateName = templateName.split('@')[0] || '';
        if('' == templateName) {
          this.showMessage('warn', '' , '模板信息有误, 请重新选择');
        }
        let params = {
          'templateId': templateId,
          'templateName': templateName
        };
        this.templateService.deleteTemplateByParams(params).then(data => {
            this.selectedTemplate = null;
            this.updateTemplateDirsData(null);
            this.showMessage('success', '' , data.msg);
        });
      }
    });
  }

  /**
   * 显示移动目录弹框
   * @param evt
   * @param overlayPanel
   */
  showAdjustDirOverlay(evt, overlayPanel) {
    this.selectedNewDirs = null;
    overlayPanel.toggle(evt);
  }

  /**
   * 取消移动目录弹框
   */
  closeAdjustDirOverlay(overlayPanel) {
    overlayPanel.hide();
  }

  /**
   * 确认调整目录
   * @param overlayPanel
   */
  confirmAdjustDir(overlayPanel) {
    let params = {
      'oldDir': this.selectedTemplateDir['目录名称'],
      'newDir': this.selectedNewDirs['目录名称'],
      'templateName': this.selectedTemplate['模板别名'],
      'hosnum':this.selectedHispital['医院编码']+'-'+this.selectedHispital['院区编码']
    };
    this.templateService.adjustTemplateDir(params).then(data => {
        this.selectedTemplate = null;
        this.updateTemplateDirsData(this.selectedTemplateDir);
        this.showMessage('success', '' , data.msg);
        overlayPanel.hide();
    });
  }

  /**
   * 调整模板顺序
   * @param template
   * @param direction
   */
  modifyTemplate(template, direction) {
    let ts = new Array();

    switch (direction) {
      case 'up':
        const i = this.emrTemplates.indexOf(template);
        if (i === 0) {
          this.showMessage('warn', '', '该模板已经排序第一了，不能上移了！');
          return;
        }
        ts.push(template);
        let prev = this.emrTemplates.slice(i - 1, i)[0];
        let  orderField = this.updateOrderTag(ts,template,prev);
        if(orderField == '序号' || ts.length <= 2 ){
        this.emrTemplates = [...this.emrTemplates.slice(0, i - 1), ...ts, ...this.emrTemplates.slice(i + 1)];
        }else{
        this.emrTemplates =  ts.sort((a,b) => {   return a[orderField] - b[orderField]})
        }
        break;
      case 'down':
        const j = this.emrTemplates.indexOf(template);
        if (j === this.emrTemplates.length - 1) {
          this.showMessage('warn', '', '该模板已经排序最后了，不能下移了！');
          return;
        }
        let next = this.emrTemplates.slice(j + 1, j + 2)[0];
        let  orderField1 = this.updateOrderTag(ts,template,next);
        ts.push(template);
        if(orderField1 == '序号' || ts.length <= 2 ){
        this.emrTemplates = [...this.emrTemplates.slice(0, j), ...ts, ...this.emrTemplates.slice(j + 2)];
        }else{
        this.emrTemplates =  ts.sort((a,b) => {   return a[orderField1] - b[orderField1]})
        }
        break;
    }
    let selectedDirIndex = this.templateDirs.findIndex(dir => dir.目录名称 === this.selectedTemplateDir.目录名称);
    let currentEmrTemplateList = this.templateDirs[selectedDirIndex]['模板列表'];
    this.templateDirs[selectedDirIndex]['模板列表'] = this.emrTemplates;
    this.templateService.updateEmrTemplateByExchange(ts).then(() => {
      this.showMessage('success', '', direction == 'up'?'上移成功！':'下移成功！');
    }, () => {
      this.showMessage('error', '', '操作失败，请稍后再试。');
    });
  }

  //更新上移下移后的排序标志
  updateOrderTag(ts,t,t2){

    let orderField = '序号';
    if(this.templatesOrderRule){
      let orderRule = this.templatesOrderRule;
      if(orderRule == '模板名称'){
        orderField = '名称排序移动标志';
        this.addOrderField(ts,orderField,t,t2);
      }else if(orderRule == '模板别名'){
        orderField = '别名排序移动标志';
        this.addOrderField(ts,orderField,t,t2);
      }else if(orderRule == '版本号'){
        orderField = '版本排序移动标志';
        this.addOrderField(ts,orderField,t,t2);
      }
    }


    const sequence = t[orderField];
    const sequence2 = t2[orderField];
    t[orderField] = sequence2;
    t2[orderField] = sequence;
    ts.push(t2);
    return orderField;
  }

//增加排序字段
addOrderField(ts,orderField,t,t2){
  if(!this.emrTemplates.find(e => e[orderField] == null || e[orderField] == 0)){ //如该目录下所有模版已有排序编号则不需要重新编号
    return;
  }

  this.emrTemplates.forEach((template,index) => {
   template[orderField] = index + 1;
   if(template['模板ID'] == t['模板ID']){
      t = template;
      return;
   }
   if(template['模板ID'] == t2['模板ID']){
    t2 = template;
      return;
   }
  ts.push(template);
  });
}


  /**
   * 显示提示信息
   * @param severity
   * @param summary
   * @param detail
   */
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({severity: severity, summary: summary, detail: detail});
  }

}
