import { SysParamService } from './../../sys-param/sys-param.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';
import { EmrDept } from '../model/emr-dept';
import { EmrHospital } from '../model/emr-hospital';
import { Message } from 'portalface/widgets';
import { ProcessStatus } from '../../../utils/ProcessStatus';
import { TemplateUpdateService } from '../templateUpdate.service';
import { LoadingService } from 'portalface/services';
import { ReplaceTemplateDataSourceService } from '../replaceTemplateDataSource.service';

declare let $: any;

@Component({
  selector: 'kyee-templateUpdate',
  templateUrl: './templateUpdate.component.html',
  styleUrls: ['./templateUpdate.component.scss']
})
export class TemplateUpdateComponent implements OnInit {

  first: Number = 0; // 分页重置
  start = 1;
  searchData: SearchData;

  currentUserInfo: CurrentUserInfo;

  searchEmrHospitalList: EmrHospital[] = [];
  searchEmrHospitalDeptList: EmrDept[] = [];
  recordType = [{ label: '住院病历', value: '住院' },
                { label: '门诊病历', value: '门诊' }];
  selectedRecordType:any; 
  selectedSearchEmrHospital: EmrHospital = new EmrHospital();
  selectedSearchEmrDept: EmrDept = new EmrDept();

  msgs: Message[];

  //值映射
  hospitalMap = {};
  templateMap = {};

  pushDescription: string;

  isGrounding = false;
  status: object[] = [];
  isYXArchive = 'N';

  selectionRecords = [];
  templateInfoList = [];
  allSize = 0;

  newRecordDialogDisplay = false;
  selectedScope = '';
  selectedDeptment = {};
  templateDirs: any;
  selectedTemplateDir = {};
  emrTemplates = [];
  templatesOrderRule: string; // 模版排序规则
  @ViewChild('dirTable') dirTable: any;
  selectedTemplate: any;
  confirmReplace: boolean;
  replaceTemplate: any;
  newByExpiredTemplate = true;
  dirLoading: boolean;
  @ViewChild('dt') dt: ElementRef;
  hospitalParam: Object;
  emrStatuMap={};
  dropTemplateList:any;
  selectSearchTemplate:any;

  isAreaRole:boolean;

  selectedSearchTemplate = '';
  
  constructor(private render: Renderer2,private templateUpdateService: TemplateUpdateService,private replaceDataService: ReplaceTemplateDataSourceService, private authTokenService: AuthTokenService,
    private loadingService: LoadingService,private sysParamService:SysParamService) {
    this.searchData = {
      院区编码: '',
      医院编码: '',
      主治医生姓名: '',
      住院号: '',
      门诊号: '',
      模板名称: '',
      病历类型: '',
      病案状态: '所有病案',
      科室ID: '',
      pageNo: 0,
      pageSize: 20,
    };
  }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    this.isAreaRole = this.sysParamService.isAreaUser(this.currentUserInfo);
    this._initEmrHospital([]);
    this._initEmrDept([]);
    this.initHospitals();
    this.initDropTemplate();
    this.status = [{ label: '所有状态', value: 'ALL' }];
    this.searchData.病案状态 = '所有状态';
    this.dropTemplateList = [];
    this.dropTemplateList.push({"displayName":"请选择","模板名称":""});
    this.selectedRecordType = this.recordType[0].value; 
  }

  _initEmrHospital(data) {
    const hospital = new EmrHospital();
    hospital.name = '请选择';
    this.searchEmrHospitalList = data;
    if(this.isAreaRole){
      this.searchEmrHospitalList.splice(0, 0, hospital);
      this.selectedSearchEmrHospital = new EmrHospital();
    }else{
      this.selectedSearchEmrHospital = this.searchEmrHospitalList[0];
      if(this.selectedSearchEmrHospital){
        this.getEmrDeptListAndEmrStatus(this.selectedSearchEmrHospital);
      }
      
    }
    
  }
  _initEmrDept(data) {
    const dept = new EmrDept();
    dept.name = '请选择';
    this.searchEmrHospitalDeptList = [...data];
    this.searchEmrHospitalDeptList.splice(0, 0, dept);
    this.selectedSearchEmrDept = new EmrDept();
  }
  initHospitals() {
    this.searchEmrHospitalList = [];
    var params = { 'areaCode': 'guangdong_jy' };
    if (this.currentUserInfo.authority == '医院') {
      params['hosnum'] = this.currentUserInfo.hosNum;
      params['nodecode'] = this.currentUserInfo.nodeCode;
    }
    this.sysParamService.queryHospitalListByRole().then(
      (data) => {
        let allHospital = [];
        if (data) {

          allHospital = (data || []).reduce((prev, h) => {
            let _h = new EmrHospital();
            _h.name = h['医院名称'];
            _h.code = h['医院编码'];
            _h.hosCode = h['院区编码'];
            _h.areaCode = 'guangdong_jy';
            this.hospitalMap[h['医院编码'] + '-' + h['院区编码']] = h;
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
          }, []);
        }
        this._initEmrHospital(allHospital);
      }
    )
  }

  initDropTemplate(){
      //获取所选医院的配置
      let searchParams = {};
      if(this.sysParamService.isAreaUser(this.currentUserInfo)){
        searchParams = {
          '医院编码': this.selectedSearchEmrHospital.code || '',
          '院区编码': this.selectedSearchEmrHospital.hosCode || ''
        };
      }else{
        searchParams = {
          '医院编码': this.currentUserInfo.hosNum || '',
          '院区编码': this.currentUserInfo.nodeCode || ''
        };
      }
      

      this.templateUpdateService.searchTemplateList(searchParams).then(list=>{
        this.dropTemplateList = [];
        this.dropTemplateList.push({ "displayName": "请选择", "模板名称": "" });
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          element['displayName'] = element['模板名称'];
        }
        this.dropTemplateList = this.dropTemplateList.concat(list);
      });
  }

  getEmrDeptListAndEmrStatus(selectedSearchEmrHospital) {
    this._initEmrDept(this.selectedSearchEmrHospital.children || []);
    if (selectedSearchEmrHospital.code && selectedSearchEmrHospital.hosCode) {
      //获取所选医院的配置
      let searchParams1 = {
        '医院编码': selectedSearchEmrHospital.code || '',
        '院区编码': selectedSearchEmrHospital.hosCode || ''
      };
      this.initDropTemplate();
      var that = this;
      this.templateUpdateService.getHospitalPrams(searchParams1).then(
        data => {
          if (data) {
            this.hospitalParam = data;
            that.status = [{ label: '所有状态', value: 'ALL' }, { label: '未归档', value: 'WGD' }].concat(ProcessStatus.getStatuOptions(data,'病案归档'));
            this.emrStatuMap = {};
            this.status.forEach(statu=>{this.emrStatuMap[statu['value']] = statu['label'] });
          } else {
            this.status = [{ label: '所有状态', value: 'ALL' }];
            this.searchData.病案状态 = '所有状态';
            this.hospitalParam = null;
            this.emrStatuMap = {};
          }
        }
      );
    } else {
      this.status = [{ label: '所有状态', value: 'ALL' }];
      this.searchData.病案状态 = '所有状态';
    }
  }

  lazyLoad($event) {
    this.searchData.pageNo = $event.first / $event.rows;
    this.searchData.pageSize = $event.rows;
    if(this.start-->0){
      this.templateInfoList = [];
      return;
    }
    this.searchTemplateInfo();
  }

  ngAfterViewInit() {
    $('.ui-paginator').append('<span id="totalMsg" style="position:absolute;left:1em;color:red;"></span>');
    let timeIdex = setTimeout(() => { // 延时是为了表格表头渲染出来后可获取到表头高度
      let tabContainer = this.dt['el'].nativeElement;
      var scrollable = tabContainer.querySelector('.ui-datatable-scrollable');
      if(scrollable){
        let scrollHeight ='460px';
        this.render.setStyle(scrollable, 'height', scrollHeight);
      }
      var scrollTbody = tabContainer.querySelector('.ui-datatable-scrollable-body');
      if(scrollTbody){
        let scrollHeight ='360px';
        this.render.setStyle(scrollTbody, 'max-height', scrollHeight);
      }
    },2);

  }

  updateSelectedTemplate() {
    if (!this.selectionRecords || this.selectionRecords.length == 0) {
      this.showMessage('error', '', '请勾选要替换模板的病历记录。');
      return;
    }
    this.selectedSearchTemplate = '';
    if(this.selectedSearchEmrHospital.code){
        this.changeScope('hospital');
    }else{
        this.changeScope('area');
    }
    this.newRecordDialogDisplay = true;
  }

  clickSearch(){
    $('#table-data table thead').children('tr').children('.ui-state-default').children('p-dtcheckbox').children('.ui-chkbox').children('.ui-chkbox-box').children('span').removeClass('fa fa-check');
    $('#table-data table tbody').children('tr').find('td:nth-of-type(1)').children('p-dtcheckbox').children('.ui-chkbox').children('.ui-chkbox-box').children('span').removeClass('fa fa-check');
    if (this.first === 0) {
      this.searchData.pageNo = 0;
      this.searchTemplateInfo();
    } else {
      this.first = 0;
    }
  }

  showTotalMsg() {
    $('#totalMsg').text('总计:' + this.allSize + '份病历记录');
  }
  searchTemplateInfo() {
    this.selectionRecords = [];
    this.searchData['医院编码'] = this.selectedSearchEmrHospital.code;
    this.searchData['areaCode'] = this.selectedSearchEmrHospital.areaCode;
    this.searchData['院区编码'] = this.selectedSearchEmrHospital.hosCode;
    this.searchData['科室ID'] = this.selectedSearchEmrDept.code;
    this.searchData['病历类型'] = this.selectedRecordType;
    if(this.selectedRecordType == '住院'){
      this.searchData['门诊号'] = '';
    }else{
      this.searchData['住院号'] = '';
    }
    if(this.selectSearchTemplate){
      if(typeof this.selectSearchTemplate == 'string'){
        this.searchData['模板名称'] = this.selectSearchTemplate;
      }else{
        this.searchData['模板名称'] = this.selectSearchTemplate.模板名称
      }
    }else{
      this.searchData['模板名称'] = '';
    }
    this.dirLoading = true;
    this.templateUpdateService.getTemplateUseInfo(this.searchData).then(
      data => {
        if(data){
          this.templateInfoList = data['templateInfoList'];
          this.allSize = data['allSize'];
          this.dirLoading = false;
          if(this.allSize.valueOf() < 1){
            $('#goPage').hide();
          }else{
            $('#goPage').show();
            let curPage = this.first.valueOf()  / this.searchData.pageSize + 1;
            $('#goPage input').val(curPage);
            $('#goPage span').text(curPage + '/'+Math.ceil(this.allSize.valueOf() / this.searchData.pageSize));
            this.selectionRecords = [];
          }
          this.showTotalMsg();
        }
      }
    );
  }

  getTemplateUseInfoSize(callback) {
    this.templateUpdateService.getTemplateUseInfoSize(this.searchData).then(numberObject => {
      this.allSize = Number(numberObject || 0);
      if (callback) {
        callback();
      }
    }, (error) => {
      console.log(error);
      this.showMessage('error', '获取模板使用信息总数失败', error.msg || '')
    });
  }

  changeScope(scope) {
    this.selectedScope = scope;
    if ('deptment' === scope) {
      this.selectedDeptment = this.searchEmrHospitalDeptList ? this.searchEmrHospitalDeptList[0] : null;
    } else {
      this.selectedDeptment = null;
    }
    this.updateTemplateDirsData(null);
  }

  filteredTemplates: any[];
  filterTemplateByTemplateName($event) {
    this.filteredTemplates = [];//清空上次搜索结果
    let allTemplatesInSearch = [];
    this.templateDirs.forEach(emrTemplateDir => {
      emrTemplateDir.模板列表.forEach(emrTemplate => {
        let 模板名称 = emrTemplate.模板名称;
        emrTemplate["templateNameWithScope"] = this.getRealNameInfo(模板名称);
        allTemplatesInSearch.push(emrTemplate);

      });
    });

    let searchName = $event.query;
    if (searchName.trim() == "") {
      return;
    }
    //根据输入框的值过滤模板列表
    this.filteredTemplates = allTemplatesInSearch.filter((template) => {
      let 模板名称 = this.getRealNameInfo(template.模板名称);
      if (模板名称.indexOf(searchName) >= 0) {
        return true;
      }
    });
  }

  //选中模板搜索中的下拉单
  selectTemplateForPAuto() {
    let selectedTemplate = this.selectedSearchTemplate;
    let 选中的模板ID = selectedTemplate['模板ID'];
    let selectTemplateFullName;
    selectTemplateFullName = selectedTemplate["模板名称"];
    let selectTemplateName = this.getRealNameInfo(selectTemplateFullName);
    //设置选中的目录
    this.selectedTemplateDir = this.templateDirs.filter(templateDir => {
      var list = templateDir['模板列表'];
      if (list && list.length > 0) {
        for (var index = 0; index < list.length; index++) {
          if (list[index]['模板名称'].indexOf(selectTemplateName) > -1) {
            return true;
          }
        }
      }
    })[0];

    //设置模板列表
    this.emrTemplates = this.selectedTemplateDir['模板列表'];
  }


  getRealNameInfo(templateName) {

    if (templateName == null) {
      return;
    }

    if (templateName && templateName.indexOf('@') == -1) {
      console.log(templateName + ':该病历命名不规范');
      var template_name = templateName;
      return template_name;
    } else {
      var nameNoVersion = templateName.split('@')[0];   //不包含版本
      var nameArray = nameNoVersion.split('.');//标准化命名之后，每个病历名称的长度是确定的
      var template_name = nameArray[nameArray.length - 1];
      return template_name;
    }
  }

  /**
   * 更新模板相关数据
  */
  updateTemplateDirsData(templateDir: any) {
    if (this.selectedSearchEmrHospital.code && this.selectedSearchEmrHospital.hosCode) {
      //获取所选医院的配置
      let searchParams1 = {
        '医院编码': this.selectedSearchEmrHospital.code || '',
        '院区编码': this.selectedSearchEmrHospital.hosCode || ''
      };
      var that = this;
      this.templateUpdateService.getHospitalPrams(searchParams1).then(
        data => {
          if (data && data['过期模板是否可新建病历'] == 'N') {
            that.newByExpiredTemplate = false;
          } else {
            that.newByExpiredTemplate = true;
          }
          if (data) {
            that.templatesOrderRule = data['病历模板排序规则'];
          } else {
            that.templatesOrderRule = null;
          }
        }
      );
    }
    this.loadingService.loading(true);
    let selectedDeptment = this.selectedDeptment || {};
    let selectedHispital = this.selectedSearchEmrHospital || {};
    let searchParams = {
      'areaCode': 'guangdong_jy',
      '医院编码': selectedHispital['code'] || '',
      '院区编码': selectedHispital['hosCode'] || '',
      '科室ID': selectedDeptment['code'] || '',
      'scope': this.selectedScope || ''
    };
    var that = this;
    this.templateUpdateService.queryDirAndTemplateList(searchParams).then(data => {
      that.templateDirs = data || [];
      let selectTemplateDir = templateDir || {};
      let index = that.templateDirs.findIndex(dir => dir['目录名称'] === selectTemplateDir['目录名称']);
      if (index < 0) {
        index = 0;
      }
      that.selectedTemplateDir = that.templateDirs[index];
      that.updateTemplateList();
      if (templateDir && index === 0 && that.dirTable.el.nativeElement.children[0].children[0].querySelector('.ui-datatable-scrollable-body')) {
        that.dirTable.el.nativeElement.children[0].children[0].querySelector('.ui-datatable-scrollable-body').scrollTop = 0;
      }
      that.loadingService.loading(false);
    });
  }

  changeDeptment(evt) {
    this.selectedDeptment = evt.value;
    this.updateTemplateDirsData(null);
  }

  /**
   * 更新模板目录对应的模板列表
   */
  updateTemplateList() {
    this.selectedTemplate = null;
    if (this.selectedTemplateDir) {
      this.emrTemplates = this.selectedTemplateDir['模板列表'];
    } else {
      this.emrTemplates = [];
    }
  }

  onClose() {
    this.selectedScope = '';
    this.templateDirs = null;
    this.selectedTemplateDir = {};
    this.dirTable = null;
    this.templatesOrderRule = '';
    this.emrTemplates = [];
  }

  batchReplaceTemplate(replaceTemplate) {
    this.selectedTemplate = replaceTemplate;
    this.confirmReplace = true;
    const 引用模板是否过期 = this.selectedTemplate['引用模板是否过期'];

    const 模板名称 = this.selectedTemplate['模板名称'];

    if (引用模板是否过期 && !this.newByExpiredTemplate) {
      this.showMessage('error', 模板名称 + '模板已过期！', '不能替换');
      return;
    }
    //查询哪些病历可以替换模板
    this.templateUpdateService.canReplaceRecordList(this.selectionRecords).then(res=>{
      if (res['code'] == '10000') {
        if(res['data']){
          console.log(res['data']['error'])
          var canReplace = res['data']['success'];
          var recordIds = [];
          var fullRecordMap = {};
          //使用可以替换模板的病历ID和替换模板文件的存储地址查询病历数据源和模板文件
          this.selectionRecords.forEach(record=>{
            if(canReplace.indexOf(record['病历ID'])>-1){
              recordIds.push(record['病历ID']);
              fullRecordMap[record['病历ID']] = Object.assign({},record);
            }
          });
          if(recordIds.length==0){
            this.showMessage('error', "无可替换的病历","请重新选择");
            return;
          }
          this.loadingService.loading(true);
          var params = {recordIds:recordIds,templatePath:this.selectedTemplate['模板存储地址']};
          var noDataRecord = [];
          this.templateUpdateService.getAllRecordDataAndTemplateFIle(params).then(data=>{
            //遍历病历模板文件对象，创建文件渲染病历上的模板数据
            if(data){
              var emrInfoMap = data['emrInfoMap'];
              if(!emrInfoMap || JSON.stringify(emrInfoMap)=='{}'){
                this.showMessage('error', "无病历内容数据","请重新选择");
                this.loadingService.loading(false);
                return;
              }
              var templateFile = data['templateFile'];
              var replaceList = [];
              recordIds.forEach(key=>{
                var emrInfo = emrInfoMap[key];
                if(!emrInfo){
                  noDataRecord.push("病历ID:"+key+"，无对应病历数据，替换未成功，请保存病历数据后再次进行替换。");
                  return;
                }
                var newfile = templateFile;
                var fileStr = newfile.replace('<body', '<section').replace('</body>', '</section>');

                var body = $(fileStr);
                //将数据渲染到新文件上
                let searchParams = {
                  '医院编码': emrInfo.医院编码 || '',
                  '院区编码': emrInfo.院区编码 || ''
                };
                if(this.hospitalParam){
                  this.replaceDataService.replaceUpdateRecordByEmrInfo(body,emrInfo['病历内容'],this.hospitalParam);
                  fullRecordMap[key]["file"] = body.prop('outerHTML').replace('<section', '<body').replace('</section>', '</body>');
                  var newEmrRecord = this.doStructuredEmrRecord(fullRecordMap[key]);
                  const oldEmrRecord = Object.assign({}, fullRecordMap[key]);
                  oldEmrRecord['区域编码'] = 'guangdong_jy';
                  oldEmrRecord["file"] = null;
                  if ( !oldEmrRecord['记录时间']) {  // 防止该字段没值的时候，传到后端解析报错
                    delete(oldEmrRecord['记录时间']);
                  }
                  if (!oldEmrRecord['打印时间']) {
                    delete(oldEmrRecord['打印时间']);
                  }
                  var one = {
                    newEmrRecord: newEmrRecord,
                    oldEmrRecord: oldEmrRecord
                  }
                  replaceList.push(one);
                }else{
                  this.templateUpdateService.getHospitalPrams(searchParams).then(param=>{
                    this.replaceDataService.replaceUpdateRecordByEmrInfo(body,emrInfo['病历内容'],param);
                    fullRecordMap[key]["file"] = body.prop('outerHTML').replace('<section', '<body').replace('</section>', '</body>');
                    var newEmrRecord = this.doStructuredEmrRecord(fullRecordMap[key]);
                    const oldEmrRecord = Object.assign({}, fullRecordMap[key]);
                    oldEmrRecord['区域编码'] = 'guangdong_jy';
                    oldEmrRecord["file"] = null;
                    if ( !oldEmrRecord['记录时间']) {  // 防止该字段没值的时候，传到后端解析报错
                      delete(oldEmrRecord['记录时间']);
                    }
                    if (!oldEmrRecord['打印时间']) {
                      delete(oldEmrRecord['打印时间']);
                    }
                    var one = {
                      newEmrRecord: newEmrRecord,
                      oldEmrRecord: oldEmrRecord
                    }
                    replaceList.push(one);
                  }); 
                }
              });
              if(replaceList.length!=0){
                this.templateUpdateService.replaceCurEmrRecord(replaceList).then((res) => {
                  if (res['code'] == '10000') {
                    if(res['data']){
                      var info = res['data']['success'].length>0?res['data']['success'].length+"份病历，病历ID："+res['data']['success']+"更新成功！":"";
                      info = info + "<br>" + (res['data']['error'].length>0?res['data']['error'].length+"份病历，病历ID："+res['data']['error']+"更新失败！":"");
                      if(noDataRecord.length>0){
                        console.log(noDataRecord);
                        info = info + "<br>" + noDataRecord.join("<br>");
                      }
                      this.showMessage('info', '', info);
                      this.searchTemplateInfo();
                      this.loadingService.loading(false);
                    }
                  }else {
                    this.showMessage('error', '', res['msg'] || '替换病历文件失败');
                  }
                });
              }
            }
          });
        }
      }
    })
  }

  doStructuredEmrRecord(record: any) {
    var emrRecord = {};
    emrRecord['区域编码'] = 'guangdong_jy';
    emrRecord['医院编码'] = record.hosNum;
    emrRecord['院区编码'] = record.nodeCode;
    emrRecord['用户ID'] = this.currentUserInfo.userId;

    emrRecord['创建人ID'] = this.currentUserInfo.userId;
    emrRecord['创建人姓名'] = this.currentUserInfo.userName;

    emrRecord['住院号'] = record['住院号'] || '';
    emrRecord['患者ID'] = record['患者ID'];

    emrRecord['病历类型'] = this.currentUserInfo.userTypeCH;
    //emrRecord['病历存储路径'] = this.selectedTemplate['模板存储地址'];
    emrRecord['病历名称'] = this.selectedTemplate['模板名称'];
    emrRecord['门诊号'] = record['门诊号'] || '';
    emrRecord['模板ID'] = this.selectedTemplate['模板ID'];
    emrRecord['操作人'] = this.currentUserInfo.userName;
    // emrRecord['操作时间'] = new Date();
    
    emrRecord['file'] = record.file;
    return emrRecord;
  }

  confirmReplaceOrNot(template) {
    this.replaceTemplate = template;
    this.confirmReplace = true;
  }

  cancelReplaceTemplate() {
    this.confirmReplace = false;
    this.replaceTemplate = null;
  }

  confirmReplaceTemplate() {
    this.showMessage('info', '', '正在替换病历模板，批量替换成功后会重新查询结果，请稍后操作！');
    this.batchReplaceTemplate(this.replaceTemplate);
    this.confirmReplace = false;
    this.onClose();
    this.newRecordDialogDisplay = false;
  }



  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }

}