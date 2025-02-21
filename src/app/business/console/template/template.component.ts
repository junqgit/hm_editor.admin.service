import { Router } from '@angular/router';


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';
import { FolderService } from '../folder.service';
import { BasFolder } from '../model/bas-folder';
import { EmrArea } from '../model/emr-area';
import { EmrBaseTemplate } from '../model/emr-base-template';
import { EmrDept } from '../model/emr-dept';
import { EmrHospital } from '../model/emr-hospital';
import { EmrTemplate } from '../model/emr-template';
import { TemplateService } from '../template.service';
import { GrowlMessageService } from '../../../common/service/growl-message.service';

import { UtilTools } from '../../../common/lib/Util';
import { EditorWrapperComponent } from '../../../common/editor-wrapper/editor-wrapper.component';
import { MenuItem } from 'primeng/primeng';
import { environment } from '../../../../environments/environment';
import { ConfirmationService } from 'portalface/widgets';
import { SysParamService } from '../../sys-param/sys-param.service';

declare let $: any;
@Component({
  selector: 'kyee-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  searchParams = {page:{pageSize:7,currentPage:1,totalRecords:0},dir:'',template:'',type:'',inpType:'',status:''};



  currentUserInfo:CurrentUserInfo;
  displayDistributeTemplateDialog:boolean = false;
  searchEmrAreaList: EmrArea[] = [];
  selectedSearchEmrArea:EmrArea = new EmrArea();

  searchEmrHospitalList: EmrHospital[] = [];
  searchEmrHospitalDeptList: EmrDept[] = [];

  selectedSearchEmrHospital:EmrHospital = new EmrHospital();
  selectedSearchEmrDept:EmrDept = new EmrDept();

  emrAreaList: EmrArea[] = [];
  emrHospitalList: EmrHospital[] = [];
  emrHospitalDeptList: EmrDept[] = [];
  selectedEmrArea:EmrArea = new EmrArea();
  selectedEmrHospital:EmrHospital = new EmrHospital();
  selectedEmrDept:EmrDept = new EmrDept();

  searchEmrBaseFolderList:BasFolder[];
  selectedSearchEmrBaseFolder = new BasFolder();

  templateStatusOptions =[
    {label:'请选择',value:''},
    {label:'固定模板',value:'0'},
    {label:'质控模板',value:'1'},
    {label:'自由模板',value:'2'},
  ];
  templateStatusValue:string = '';

  templateType = '住院';

  selectedValues:string = '0';
  hiddenTemplateManage = false;

  emrTemplateList = [];
  emrTemplateSearchName:string;


  // 新建
  displayNewTemplateDialog:boolean = false;
  emrBaseFolderList:BasFolder[];
  selectedEmrBaseFolder = new BasFolder();

  emrBaseTemplateList:EmrBaseTemplate[];
  selectedEmrBaseTemplate = new EmrBaseTemplate();


  emrTemplateListOptions:EmrTemplate[];
  selectedEmrTemplate = new EmrTemplate();

  newTemplateStatusOptions = [{label:'质控模板',value:'1'},
  {label:'自由模板',value:'2'}];
  newTemplateStatusValue = '1';
  newDescription:string;
  newEmrTemplate:EmrTemplate;// 新建模板实体

  // 历史版本
  displayHistoryTemplateDialog = false;
  emrTemplateHistoryList:EmrTemplate[];

  // 编辑器
  hiddenEmrWrapper:boolean = true;
  editorDisplay: boolean = false;
  myEmrWrapperClass: string="myEmrWrapper";
  intEditorUrl: string;
  editorDialogDisplay: boolean = false;
  editorDialogHeader: string;
  emrTemplate:EmrTemplate = new EmrTemplate();

  breadcrumbItems: MenuItem[];

  @ViewChild(EditorWrapperComponent)
    editorWrapperComponent: EditorWrapperComponent;

    @ViewChild('editorIframe')
    editorIframe: ElementRef;
    //目录对应模板
    dirTemplate = {"目录":{},"模板":{}};
    // 发布
    // selectedDisEmrtemplate:EmrTemplate[];
    selectedDisEmrtemplate:EmrTemplate;
    selectedDisEmrtemplates:EmrTemplate[];

    displayPushTemplateDialog = false;
    selectedDisHos = new EmrHospital();
    selectedDisDept = new EmrDept();
    disDeptList:EmrDept[];



    //值映射
    hospitalMap = {};
    templateMap = {};

    pushDescription:string;

    uploadUrl = '/emr-server/admin-service/upload';

    createUserName:string;
    publishUserName:string;

    updateDataSource = false;// 是否修改了数据元
    isHospitalRole:boolean;
    selectedNewHos= new EmrHospital();// 新建选中的医院
    disHos:boolean;

    applySystemList = [
      {label:'请选择',value:''},
      {label:'emr',value:'emr'},
      {label:'pacs',value:'pacs'}];
    selectNewApplySystem = {label:'emr',value:'emr'};
    selectApplySystem;


    templateDirObj:{};
    dirTemplates:{};
    moveTemplateFlag:boolean = false;
    moveTemplateName:string;
    moveCurDir:string;
    moveToDir:string;
    hosDirList:any[];

    editorMedicalIp:any[];
  constructor(private templateService:TemplateService,private authTokenService:AuthTokenService,private folderService:FolderService,private growlMessageService: GrowlMessageService,private confirmationService: ConfirmationService,private router: Router,private sysParamService:SysParamService) {


  }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    this.isHospitalRole = !this.sysParamService.isAreaUser(this.currentUserInfo);
    if(this.isHospitalRole){
      this.uploadUrl = `/emr-server/admin-service/upload?hosnum=${this.currentUserInfo.hosNum || ''}&nodecode=${this.currentUserInfo.nodeCode || ''}&hosname=${this.currentUserInfo.hosName || ''}&username=${this.currentUserInfo.userName || ''}`;
    }else{
      this.uploadUrl = `/emr-server/admin-service/upload?hosnum=&nodecode=&hosname=&username=${this.currentUserInfo.userName || ''}`;

    }
    this._initEmrHospital([]);
    this._initEmrDept([]);
    this.initHospitals();
    this.getAllFolders();
    this.initDirTemplate(null);
    this.initHosEmrMeta();
    // 可编辑【住院病案首页、中医病案首页】的ip
    this.initEditorIp();

  }
  _initEmrHospital(data){
    const hospital = new EmrHospital();
    hospital.name = '请选择';
    if(this.displayDistributeTemplateDialog) {
      this.emrHospitalList = data;
      if(this.isHospitalRole){
        this.selectedEmrHospital = this.emrHospitalList[0];
        this.getDisDeptList();
      }else{
        this.emrHospitalList.splice(0, 0, hospital);
        this.selectedEmrHospital = new EmrHospital();
      }

    } else {
      this.searchEmrHospitalList = data;
      if(this.isHospitalRole){
        this.selectedSearchEmrHospital = this.searchEmrHospitalList[0];
        this.selectedDisHos = this.searchEmrHospitalList[0];
        this.getEmrDeptList('');
        this.getDisDeptList();
      }else{
      this.searchEmrHospitalList.splice(0, 0, hospital);
      this.selectedSearchEmrHospital = new EmrHospital();
      }
    }
  }
  _initEmrDept(data) {
    const dept = new EmrDept();
    dept.name = '请选择';
    if(this.displayDistributeTemplateDialog) {
      this.emrHospitalDeptList = [...data];
      this.emrHospitalDeptList.splice(0, 0, dept);
      this.selectedEmrDept = new EmrDept();
    } else {
      this.searchEmrHospitalDeptList = [...data];
      this.searchEmrHospitalDeptList.splice(0, 0, dept);
      this.selectedSearchEmrDept = new EmrDept();
    }
  }
  initHospitals(){
    this.searchEmrHospitalList = [];
    var params = {'areaCode':this.currentUserInfo.areaCode || 'guangdong_jy'};
    if(this.currentUserInfo.authority == '医院'){
      params['hosnum'] = this.currentUserInfo.hosNum;
      params['nodecode'] = this.currentUserInfo.nodeCode;
    }
    this.sysParamService.queryHospitalListByRole().then(
      (data) => {
        data = data||[];
        let allHospital = [];
        if(data){

           allHospital = (data|| []).reduce((prev,h) => {
            let _h = new EmrHospital();
            _h.name = h['医院名称'];
            _h.code= h['医院编码'] + '-'+h['院区编码'];
            this.hospitalMap[h['医院编码'] + '-'+h['院区编码']] = h;
            let depts = [];
            (h['科室列表'] || []).forEach(d => {
              let _d = new EmrDept();
              _d.name = d['科室名称'];
              _d.code = d['科室ID'];
              depts.push(_d);
            });
            _h.children = depts;
            prev.push(_h);
            return prev;
          },[]);
        }
        this._initEmrHospital(allHospital);
      }
    )

  }
  getEmrDeptList(type:string){
    const condition = <any>{};
    if(type == 'dialog'){
      if(!this.selectedEmrHospital){
        return;
      }
      this._initEmrDept(this.selectedEmrHospital.children || []);
    }else{
      if(!this.selectedSearchEmrHospital){
        return;
      }
      this._initEmrDept(this.selectedSearchEmrHospital.children || []);
    }

  }
  getAllFolders(){
    this.folderService.getAllFolders().then(data => {

      if(data['code'] == 10000){
        this.emrBaseFolderList = [...data['data']];
        this._initBasFolders(data['data']);

      }else{
        this.emrBaseFolderList = [];
        this._initBasFolders([]);
      }

    })
  }
  _initBasFolders(d){
    let bf = new BasFolder();
    bf.name = '请选择';
    this.searchEmrBaseFolderList = d;
      this.searchEmrBaseFolderList.splice(0, 0, bf);
      this.selectedSearchEmrBaseFolder = new BasFolder();
  }
  initDirTemplate(callback){
    this.folderService.mapDirTemplate().then(d => {
      if(d.code == 10000){
        this.dirTemplate = d.data;
        callback && callback();
      }
    })
  }
  // 新建
  showTemplateNewDialog(){
    this.newDescription = '';
    this.displayNewTemplateDialog = true;
    if(this.selectedSearchEmrBaseFolder && this.selectedSearchEmrBaseFolder.name != '请选择'){
      this.selectedEmrBaseFolder = this.selectedSearchEmrBaseFolder;
    }else{
    this.selectedEmrBaseFolder = this.emrBaseFolderList[0];
  }
    this.getBaseTemplateList();
  }
  getBaseTemplateList(){

    this.emrBaseTemplateList = [];
    this.selectedEmrBaseTemplate = null;
    this.selectedEmrTemplate = null;
    this.selectNewApplySystem = this.applySystemList[1];
    this.folderService.getBasTemplateList(this.selectedEmrBaseFolder).then(bt => {
      if(bt.code == '10000'){
        this.emrBaseTemplateList = bt.data || [];
        if(this.emrBaseTemplateList.length > 0){
          this.selectedEmrBaseTemplate = this.emrBaseTemplateList[0];
          this.getBaseTemplateStore();
        }
      }

    })
  }
  getBaseTemplateStore(){
    this.emrTemplateListOptions =  [];

    this.templateService.getTemplateByName(this.selectedEmrBaseTemplate['templateName']).then(
      t => {
        if(t.code == 10000){
          this.emrTemplateListOptions = (t.data||[]).reduce((prev,c) => {
            if(c['deptId']){
              let deptName = this.deptMap(c['hosnum'],c['deptId']);
              c['labelName'] = c['templateName']+ (deptName?'-'+deptName:'');
            }else{
              c['labelName'] = c['templateName'];
            }
            prev.push(c);
            return prev;
          },[]);
          this.selectedEmrTemplate = this.emrTemplateListOptions[0];
          this.selectNewApplySystem = this.selectedEmrTemplate.applySystem == 'pacs' ? this.applySystemList[2] : this.applySystemList[1];
        }
      }
    )
  }
  /**
   * 新增医院模板
   */
   saveEmrTemplate(){
    if(!this.selectedEmrBaseTemplate||!this.selectedEmrBaseTemplate['templateName']){
      this.growlMessageService.showError('', '请选择参考模板');
      return;
    }
    if(!this.createUserName){
      this.growlMessageService.showError('', '请先输入创建人用户名');
      return;
    }
    this.newEmrTemplate = new EmrTemplate();
    this.newEmrTemplate.createUser = this.createUserName;
    this.newEmrTemplate.description = this.newDescription || '';
    this.newEmrTemplate.templateTrueName = this.selectedEmrBaseTemplate['templateName'];

    this.newEmrTemplate.templateName = this.selectedEmrTemplate?this.selectedEmrTemplate['templateName'] || '':'';
    this.newEmrTemplate.type = this.newTemplateStatusValue;
    this.newEmrTemplate.inpType = this.selectedEmrBaseTemplate.type;

    if(this.selectedNewHos){
      let hosnum = this.selectedNewHos.code || '';
      if(hosnum){
      this.newEmrTemplate.hosname = this.selectedNewHos.name || '';
      this.newEmrTemplate.hosnum = hosnum;
      }

    }
    if(this.selectNewApplySystem){
      this.newEmrTemplate.applySystem = this.selectNewApplySystem.value;
    }
    this.templateService.createTemplate(this.newEmrTemplate)
      .then(
        (data) => {
          if (data && data.code == '10000') {
            const template = data.data || {};
            this.displayNewTemplateDialog = false;
            this.getEmrTemplateList();

          } else {
            this.growlMessageService.showError('', data ? (data.msg || '新增失败') : '新增失败');
          }
        });
  }
  getEmrTemplateList(){
    this.selectedDisEmrtemplates = null;
    this.emrTemplateList = [];
    this._initSearchParams();
    this.searchParams.page.pageSize = 1000;
    this.templateService.getTemplateList(this.searchParams).then(data => {
      if(data.code == '10000'){
        let emrTemplates = data.data;
        for (let i = 0; i < emrTemplates.length; i++) {
         let folderName = ((this.dirTemplate['模板'] || {})[emrTemplates[i].templateTrueName] || {})['folder'];
         emrTemplates[i]['folderName'] = folderName;
        }
        this.emrTemplateList = emrTemplates;
      }else{
        this.growlMessageService.showError('', data ? (data.msg || '搜索失败') : '搜索失败');
      }
    })
  }
  _initSearchParams() {
    if (this.selectedSearchEmrBaseFolder && this.selectedSearchEmrBaseFolder['idStr']) {
      this.searchParams['目录'] = this.selectedSearchEmrBaseFolder['idStr'];
    } else {
      this.searchParams['目录'] = '';
    }

    if(this.emrTemplateSearchName){
      this.searchParams['模板名称'] = this.emrTemplateSearchName;
    }else{
      this.searchParams['模板名称'] = '';
    }
    if(this.selectedSearchEmrArea && this.selectedSearchEmrArea['_id']){
      this.searchParams['区域名称'] =  this.selectedSearchEmrArea.areaName;
    }else{
      this.searchParams['区域名称'] = '';
    }
    if(this.selectedValues == '1' && this.selectedSearchEmrHospital && this.selectedSearchEmrHospital['code']){
      this.searchParams['医院名称'] =  this.selectedSearchEmrHospital.name;
      this.searchParams['医院编码'] =  this.selectedSearchEmrHospital.code;
    }else{
      if(this.isHospitalRole){
        this.searchParams['医院名称'] = this.currentUserInfo['hosName'];
        this.searchParams['医院编码'] =  this.currentUserInfo.hosNum+'-'+this.currentUserInfo.nodeCode;
      }else{
        this.searchParams['医院名称'] = '';
      }

    }

    if(this.selectedSearchEmrDept && this.selectedSearchEmrDept.code){
      this.searchParams['科室ID'] =  this.selectedSearchEmrDept.code;
    }else{
      this.searchParams['科室ID'] = '';
    }
    if(this.templateStatusValue == '0' || this.templateStatusValue){
      this.searchParams['模板分类'] =  this.templateStatusValue;
    }else{
      this.searchParams['模板分类'] = '';
    }
    if(this.templateType){
      this.searchParams['模板类别'] =  this.templateType;
    }else{
      this.searchParams['模板类别'] = '';
    }
    this.searchParams['发布状态'] = this.selectedValues;
    if(this.selectApplySystem){
      this.searchParams['应用系统'] = this.selectApplySystem['value'];
    }
  }
  // 历史版本
  otherVersionTemplate(template){
    this.emrTemplateHistoryList = [];
    this.templateService.getHistoryTemplateList(template.idStr,template.hosnum).then(d => {
      if(d.code == 10000){
        this.emrTemplateHistoryList = d.data;
        this.displayHistoryTemplateDialog = true;
      }else{
        this.growlMessageService.showError('',d.msg||'获取数据失败,请检查网络或联系运维人员!');
      }
    })
  }

  openTemplateEditorClient(template: EmrTemplate){
    this.hiddenTemplateManage = true;
    this.hiddenEmrWrapper = false;
    let canEditor = '0';
    this.templateService.getTemplate(template).then((data) => {
      if (data && data.code == '10000') {
        const emrTemplate = data.data || {};
        if(emrTemplate.isDel == '1'){
          this.growlMessageService.showError('', '模板已被删除');
          return;
        }
        canEditor = this.emrEditFlag(emrTemplate);
      
        let folderName = ((this.dirTemplate['模板'] || {})[emrTemplate.templateTrueName] || {})['folder'];
        if(!folderName){

          this.initDirTemplate(() => {
            const editorUrl = `editor.html?` +
          `designMode=true&consoleMode=edit&modelName=EmrTemplate` +
          `&templateTrueName=` + encodeURIComponent(emrTemplate.templateTrueName) +
          `&templateCode=` + encodeURIComponent(`${emrTemplate.templateName}`) +
          `&templateID=${emrTemplate['idStr']}` +
          `&fileID=${emrTemplate.fileID}` +
          `&userID=${this.currentUserInfo.userId || ''}` +
          `&userName=${this.currentUserInfo.userName || ''}` +
          `&consoleCanEdit=${canEditor}` +
          `&folderName=${folderName}`;
        this.editorWrapperComponent.setEditorUrl( editorUrl);
        this.editorDisplay = true;
        this.emrTemplate = <EmrTemplate>UtilTools.deepCopyObjAndArray(emrTemplate);
          });
          return;
        }
        const editorUrl = `editor.html?` +
          `designMode=true&consoleMode=edit&modelName=EmrTemplate` +
          `&templateTrueName=` + encodeURIComponent(emrTemplate.templateTrueName) +
          `&templateCode=` + encodeURIComponent(`${emrTemplate.templateName}`) +
          `&templateID=${emrTemplate['idStr']}` +
          `&fileID=${emrTemplate.fileID}` +
          `&userID=${this.currentUserInfo.userId || ''}` +
          `&userName=${this.currentUserInfo.userName || ''}` +
          `&consoleCanEdit=${canEditor}` +
          `&folderName=${folderName}`;
        this.editorWrapperComponent.setEditorUrl( editorUrl);
        this.editorDisplay = true;
        this.emrTemplate = <EmrTemplate>UtilTools.deepCopyObjAndArray(emrTemplate);
      } else {
        this.growlMessageService.showError('', data ? (data.msg || '查询失败') : '查询失败');
      }
    });
  }
  /**
   * 查看版本模板
   * @param emrTemplateLog
   */
   openTemplateHistoryEditorClient(templateConsoleDoc: object) {
    this.editorDialogHeader = `模板查看：${templateConsoleDoc['templateTrueName']}`;
    const editorUrl = `${environment.editorUrl}editor.html?` +
      `designMode=true&consoleMode=edit&modelName=EmrTemplate` +
      `&templateTrueName=` + encodeURIComponent(templateConsoleDoc['templateTrueName']) +
      `&templateCode=` + encodeURIComponent(`${templateConsoleDoc['templateName']}`) +
      `&templateID=${templateConsoleDoc['idStr']}` +
      `&fileID=${templateConsoleDoc['fileID']}` +
      `&userID=${this.currentUserInfo.userId}` +
      `&userName=${this.currentUserInfo.userName}` +
      `&consoleCanEdit=1`;
    const iframe = <HTMLIFrameElement>this.editorIframe.nativeElement;
    iframe.contentWindow.location.href = editorUrl;
    this.editorDialogDisplay = true;
  }
  // 发布
  disTemplate(template){
    this.pushDescription = '';

    if(template['hosnum']){
      this.disHos = true;
    }else{
      this.disHos = false;
    }
    this.selectedDisEmrtemplate = template;
    if(this.disHos){
      this.getDisDeptList();
    }
    this.displayPushTemplateDialog = true;
  }
  disTemplates(){
    this.displayPushTemplateDialog = true;
  }
  confirmDis(){

    if(!this.publishUserName){
      this.growlMessageService.showError('', '请先输入发布人用户名');
      return;
    }
    // if(!this.selectedDisHos.code){
    //   this.growlMessageService.showError('', '请选择发布的医院');
    //   return;
    // }
    // if(!this.selectedDisEmrtemplate || this.selectedDisEmrtemplate.length == 0){
    //   this.growlMessageService.showError('', '请选择发布的模板');
    //   return;
    // }



    let code = this.selectedDisEmrtemplate['hosnum'] || '';
    let name = this.selectedDisEmrtemplate['hosname'] || '';

    let bakDisName = this.selectedDisEmrtemplate.disUserName;
    this.selectedDisEmrtemplate.disUserName = this.publishUserName;
    let bakStatus = this.selectedDisEmrtemplate.status;
    this.selectedDisEmrtemplate.editorDataSource = this.updateDataSource?'1':'0';
    this.templateService.disTemplate(this.selectedDisEmrtemplate,'guangdong_jy',code,name,(this.selectedDisDept || {})['code'] || '',this.pushDescription || '').then(d => {

      if(d.code == 10000){
        this.selectedDisEmrtemplate.status = '1';
        this.growlMessageService.showSuccess('发布成功');
        this.displayPushTemplateDialog = false;
        if(!this.updateDataSource && bakStatus == '1'){
          // 跳转模板更新菜单
          this.confirmationService.confirm({
            message: `是否更新历史病历?`,
            header: '提示',
            icon: 'fa fa-question-circle',
            accept: () => {
              // this.router.navigate(['/main/business/console/templateUpdate'],{});
              $('#模板更新').click();            }
          });


          this.initHosEmrMeta();
          this.updateDataSource = false;
        }
        this.getEmrTemplateList();



      }else{
        this.selectedDisEmrtemplate.disUserName = bakDisName;
        this.growlMessageService.showError('', d.msg || '发布失败');
      }
    })
  }
  getDisDeptList(){
    if(!this.disHos){
        return;
    }
    let data = this.searchEmrHospitalList.filter(s => s['code'] == this.selectedDisEmrtemplate['hosnum'])[0].children;

    const dept = new EmrDept();
    dept.name = '请选择';
      this.disDeptList = [...data];
      this.disDeptList.splice(0, 0, dept);
      this.selectedDisDept = new EmrDept();

  }
  hosMap(code){
    return (this.hospitalMap[code] || {})['医院名称'] || '';
  }
  deptMap(hosCode,code){
    if(!code) return '';
    let depts = (this.hospitalMap[hosCode] || {})['科室列表'] || [];
    for(let d in depts){
      let d1 = depts[d] || {};
      if(code == d1['科室ID']){
        return d1['科室名称'] || '';
      }
    }
    return '';
  }
  exportEmrTemplate(){

    if(!this.selectedDisEmrtemplates){
      this.growlMessageService.showError('', '请选择导出的模板');
      return;
    }



    let params = [].concat(this.selectedDisEmrtemplates);
    this.templateService.exportTemplate(params)
    .subscribe(blob=>{
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = 'template_'+(new Date().getTime())+".zip";
      a.click();
      window.URL.revokeObjectURL(url);

    },()=>{
      this.growlMessageService.showGrowl({severity: 'error', detail:'导出失败，请检查网络并稍后再试。'});
    })
  }
  deleteTemplate(template){
    let id = template.idStr;
    this.isUsedTemplate(id,(data) => {
      if(data){
        this.growlMessageService.showWarningInfo('已经创建过病历，不允许删除');
        return;
      }
      this.confirmationService.confirm({
        message: `确定删除模板${template.templateName}?`,
        header: '删除模板',
        icon: 'fa fa-trash',
        accept: () => {
          this.templateService.deleteBaseTemplate(id).then(
            (data) => {
              if (data && data['code'] == '10000') {
                this.getEmrTemplateList();
                this.growlMessageService.showSuccessInfo(`删除模板${template.templateName}成功！`);
              } else {
                this.growlMessageService.showErrorInfo(`删除模板${template.templateName}失败`, data ? data['msg'] : '');
              }
            },
            (err) => {
              this.growlMessageService.showErrorInfo(`删除模板${template.templateName}失败：`, err);
            });
        }
      });

    })
  }
  revetTemplate (template){
    let id = template.idStr;
    this.confirmationService.confirm({
      message: `模板${template.templateName}撤销后，其状态将变为未发布`,
      header: '撤销模板',
      icon: 'fa fa-reply',
      accept: () => {
        this.templateService.revetBaseTemplate(id).then(
          (data) => {
            if (data && data['code'] == '10000') {
              this.getEmrTemplateList();
              this.growlMessageService.showSuccessInfo(`撤销模板${template.templateName}成功！`);
            } else {
              this.growlMessageService.showErrorInfo(`撤销模板${template.templateName}失败`, data ? data['msg'] : '');
            }
          },
          (err) => {
            this.growlMessageService.showErrorInfo(`撤销模板${template.templateName}失败：`, err);
          });
      }
    });

  }
  isUsedTemplate(id,callback){
    this.templateService.isUsedTemplate(id).then(d =>
      d && callback && callback(d['data'])
    )
  }

  onUploadError(event) {
    this.growlMessageService.showGrowl({severity: 'error', detail: event.xhr.status + ',' + event.xhr.statusText});
  }

  onUploadComplete(event) {
    console.log(event);
    const returnMsg = JSON.parse(event.xhr.responseText);
    if (returnMsg['code'] == '10000' && returnMsg['data']) {
      this.initDirTemplate(null);
      this.getEmrTemplateList();
      this.growlMessageService.showGrowl({severity: 'success', detail: "导入成功"});
    } else {
      this.growlMessageService.showGrowl({severity: 'error', detail: "导入失败"});
    }
  }

  initHosEmrMeta(){
    this.hosDirList = [{"label":'',"value":''}];
    this.templateService.getTemplateDirs(this.currentUserInfo.hosNum+'-'+this.currentUserInfo.nodeCode).then(res => {
      this.dirTemplates = res || {};
      this.templateDirObj = Object.keys(this.dirTemplates).reduce((p,c) => {
        this.dirTemplates[c].forEach(es => {
          p[es['模板名称']] = c;
        });
        // this.hosDirList.push({"label":c,"value":c});
        return p;
      },{});
    })
  }
  initEditorIp(){
    this.editorMedicalIp = ['127.0.0.1','localhost'];
    this.sysParamService.editorMedicalIp().then(d => {
      this.editorMedicalIp = this.editorMedicalIp.concat(d || []);
      console.log('可编辑病案首页ip:',this.editorMedicalIp);
    })
  }
  emrEditFlag(emrTemplate){
    let flag = '0';
    if(emrTemplate['templateTrueName'] == '住院病案首页' || emrTemplate['templateTrueName'] == '中医病案首页'){
      if(this.editorMedicalIp.indexOf(location.hostname) == -1){
        flag = '1';
      }

    }else{
      if(emrTemplate['type'] == '0'){
        flag = '1';
      }
    }

    return flag;
  }
}
