import { PageClazz } from './../../../common/model/page-clazz';
import { BusinessParamBean } from './model/businessParamBean';
import { Component, OnInit, ViewChild} from '@angular/core';
import { TreeNode } from 'portalface/widgets';
import { SysParamService } from "../sys-param.service";
import { Message } from "portalface/widgets/commons/message";
import { CurrentUserInfo } from "../../../basic/common/model/currentUserInfo.model";
import { AuthTokenService } from "../../../basic/auth/authToken.service";
import { LoadingService } from 'portalface/services';
import { paramsTree } from './model/hospitalParamsTree';
import { MessageService  } from "portalface/widgets/commons/messageservice";
import { TemplateService } from '../../console/template.service';
@Component({
  selector: 'kyee-bisiness-param',
  templateUrl: 'business-param.component.html',
  styleUrls: ['business-param.component.scss'],
  providers:[SysParamService,AuthTokenService,MessageService]
})
export class BusinessParamComponent implements OnInit {
  msgs: Message[] = [];
  selectedHospiral:TreeNode;
  hospitalParamsTree:TreeNode[];//医院参数树
  selectedParam:TreeNode;
  paramBean = new BusinessParamBean();
  hospitalParamsVisible:boolean = false;//医院参数列表区域
  hospitalParamsLoading: Boolean = false;
  hospitalParamList:any[] = [];//记录医院列表

  hospitalCode:string;
  nodeCode:string;
  paramsId:string;
  currentUserInfo:CurrentUserInfo;
  isSysAdmin:boolean;
  filterHospitalName:String = '';
  filterParamName:String = '';//医院参数查询条件
  paramsTreeList:any[] = [];

  //LOGO 以及Title名称相关

  config = {};

  wardInTimeArr:any[];
  wards:any[];

  //基础病历数据源当前操作的下标
  baseDataSouceContentIndex = -1;
  //点击选择数据源查询到的所有数据源
  templateDataSource=[];
  showTemplateDataSource = [];
  basedataSourceTableLoadingFlag = false;
  displaybaseDataSourceMsgDialog = false;
  filterbaseDataSourceStr = "";
  selectedBaseDataSources = [];
  selectedBaseDataSourceNames = [];
  alreadSelectedDataSourceNames = [];
  selectbaseDataSourceNames = [];
  basedlgSearchParams = {
    key: '',
    scoreType: '',
    page: new PageClazz()
  }
  templateChildLogo:string;

  loadAllDs = false;
  constructor(
    private sysParamService:SysParamService,
    private authTokenService:AuthTokenService,
    private loadingService:LoadingService,
    private messageService: MessageService,
    private templateService:TemplateService
  ) { }

  selectParamType: string = '';
  paramTypes: string[] = ['系统参数', '病历模板', '病历书写', '护理文书', '体温单', '病历质控', '病历查询', '病案管理', '病案借阅', 'PDA设置', '全文检索', '门诊病历书写'];
  selectedHospital:string = '';
  hospitals:any[]=[];
  paramTypeDisable = false;
  @ViewChild('systemParams') systemParams: any;
  @ViewChild('nursingParams') nursingParams: any;
  @ViewChild('qualityParams') qualityParams:any;
  @ViewChild('recordParams') recordParams:any;
  @ViewChild('recordManageParams') recordManageParams:any;
  @ViewChild('temperatureParams') temperatureParams:any;
  @ViewChild('templateParams') templateParams:any;
  ngOnInit() {
    paramsTree.forEach(item=>{
      this.paramsTreeList = this.paramsTreeList.concat(item.children);
    })
    this.currentUserInfo = this.sysParamService.getCurUser();
    this.selectParamType = '系统参数';
    if (!this.sysParamService.isAreaUser(this.currentUserInfo)) {
      this.isSysAdmin = false;
      this.hospitalCode = this.currentUserInfo['hosNum'];
      this.nodeCode = this.currentUserInfo['nodeCode'];
      this.hospitalParamsTree = [paramsTree[0]];
      this.sysParamService.getHospitalInfo(this.currentUserInfo.areaCode,this.hospitalCode,this.nodeCode).then(d => {
        this.hospitalParamList = [d['data'] || {}];
        this.initHospitalPrams(this.hospitalCode, this.nodeCode, () => {
          this.updateHospitalsParam();
          this.getEmrTemplates();
          this.getNursingTemplates()
        });
      });
      this.getWardList(this.currentUserInfo.areaCode);
    }else {
      this.isSysAdmin = true;
      this.getAreasAndHospitalsList();
    }
  }

   /**
   * 查询模板名称
   */
  initAllTemplateList(callback) {
    this.sysParamService.getAllTemplateList(this.hospitalCode+'-'+this.nodeCode).then(data => {
      if (data) {
        this.formatTemplateDirs(data);
      }
      if (callback) {
        callback();
      }
    },
    error => {
      this.msgs = [];
      this.msgs.push({severity: 'error', detail: '获取另页打印设置模板列表失败！'});
    });
  }

  formatTemplateDirs(data: any) {
    this.recordParams.templateList = [];
    this.recordParams.allTemplates = [{"label":"请选择","value":""}];
    let dirs = ['病程记录', '术后首次病程', '新生儿病程记录'];
    let mangeDirs = ['病程记录', '术后首次病程', '新生儿病程记录','体温单', '护理表单'];
    data.forEach((item: any) => {
      if (dirs.includes(item['模板目录'])) {
        this.recordParams.templateList.push({ label: item['模板名称'], value: item['模板名称'] });
      }
      if(!mangeDirs.includes(item['模板目录'])) {
        this.recordManageParams.emrMangeTemplates.push({ label: item['模板名称'], value: item['模板名称'] });
      }
      this.recordParams.allTemplates.push({ label: item['模板名称'], value: item['模板名称'] });
    });
  }

  /**
   * 根据参数名过滤医院参数
   * */
  filterParamByName(){
    if(""!= this.filterParamName){
      this.hospitalParamsTree = paramsTree;
      let oldParamTree = this.hospitalParamsTree;
      let filterParamTree: TreeNode[] = [];
      for(let treeNode of oldParamTree){
        let oldChildren = treeNode.children;
        let newChildren:TreeNode[] = [];
        for(let oldChild of oldChildren){
          let label = oldChild.label;
          if(label.indexOf(this.filterParamName.toString()) != -1 ){
            newChildren.push(oldChild);
          }
        }
        if(newChildren.length > 0){
          let neWTreeNode:TreeNode = {};
          neWTreeNode.label = treeNode.label;
          neWTreeNode.data = treeNode.data;
          neWTreeNode.expanded = true;
          neWTreeNode.children = newChildren;
          filterParamTree.push(neWTreeNode);
        }
      }
      this.hospitalParamsTree = filterParamTree;
      if(filterParamTree.length <=0){ // 当过滤结果为空时，隐藏掉右侧的参数配置区域
        this.msgs = [];
        this.msgs.push({severity:'info',detail:'无该医院参数，请重新输入。'});
      }
      //过滤时，左侧参数选择禁用
      this.paramTypeDisable = true;
    }else {
      this.hospitalParamsTree =  [paramsTree[0]];
      this.paramTypeDisable = false;
    }
    this.updateHospitalsParam();
  }

  getAreasAndHospitalsList(){
    this.loadingService.loading(true);
    this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
      apiResult =>{
        if(apiResult.code == 10000 && apiResult.data){
          let hospitalList = [];
          let interfaceResult = apiResult.data;
          for(let item of interfaceResult){
            this.hospitalParamList = item.hospitalParam;
            let hospitals = item['hospitalParam'];
            if(hospitals.length > 0){
              for (let hospital of hospitals){
                hospital['label'] = hospital['医院名称'];
                hospital['data'] = hospital['医院编码'];
                hospital['院区编码'] = hospital['院区编码'];
                hospital['areaCode'] = item['areaCode'].toString();
                hospitalList.push({label:hospital['医院名称'],value:hospital})
              }
            }
          }
          this.hospitals = hospitalList;
          if (this.hospitals && this.hospitals.length > 0) {
            this.selectedHospiral = this.hospitals[0]['value'];
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
    );
  }

  /**
   * 更新区域对应的院级参数列表
   */
  updateHospitalsParamsList() {
    this.hospitalParamsLoading = true;
    this.hospitalParamsTree = [];
    let timeIndex = setTimeout(() => {
      this.filterParamName = '';
      this.filterParamByName();
      this.hospitalParamsLoading = false;
      clearTimeout(timeIndex);
    }, 300);
  }

  updateHospitalsParam() {
    if (this.hospitalParamsTree && this.hospitalParamsTree.length > 0) {
      this.selectedParam = (this.hospitalParamsTree[0].children.length > 0 ? this.hospitalParamsTree[0].children[0] : null);
    }else {
      this.selectedParam = null;
    }
    this.selectParam();
  }

  hospitalSelect(){
    if(this.selectedHospiral['医院名称'] == undefined || this.selectedHospiral['医院名称']== null || this.selectedHospiral['医院名称'] == ""){
      this.msgs = [];
      this.msgs.push({severity:'warn',detail:'请选择区域下的平台'});
    }else {
      this.updateHospitalsParamsList();
      this.hospitalCode = this.selectedHospiral['医院编码'];
      this.nodeCode = this.selectedHospiral['院区编码'];
      this.initHospitalPrams(this.hospitalCode,this.nodeCode, () => {
        this.updateHospitalsParam();
      });
      this.getEmrTemplates();
      this.getWardList(this.selectedHospiral['areaCode']);
    }
  }

  setAllParamVisibleFalse(){
    for(let i=0;i<this.paramsTreeList.length;i++){
      this.paramsTreeList[i].visible = false;
    }
  }

  /**
   * 选择某一医院参数后，右侧隐藏于显示相应的参数配置信息
   * */
  selectParam(){
    if (!this.selectedParam) {
      return;
    }
    this.setAllParamVisibleFalse();
    for (let i = 0; i < this.paramsTreeList.length; i++) {
      if (this.selectedParam['model'] == this.paramsTreeList[i]['model']) {
        this.paramsTreeList[i]['visible'] = true;
        if (this.selectedParam['parent']) {
          this.selectParamType = this.selectedParam['parent']['label']
        } else {
          paramsTree.forEach(item => {
            item.children.forEach(childItem => {
              if (childItem['model'] === this.selectedParam['model']) {
                this.selectParamType = item['label']
              }
            })
          })
        }
      }
    }

    if (this.showOtherProperty('visible','体温单配置')) {
      this.config = this.paramBean['体温单配置'];
      this.downloadPic();
    }
    if(this.showOtherProperty('visible','新生儿体温单配置')) {
      this.config = this.paramBean['新生儿体温单配置'];
      this.downloadPic();
    }
    if(!this.config['logo']||JSON.stringify(this.config['logo'])=='{}'){
      this.config['logo'] = {};
      this.config['logo']['open'] = false;
      this.config['logo']['图标'] = null;
    }
    if (this.config['painConfig'] && this.config['painConfig'].length>0) {
      this.temperatureParams.enableConfig['pain'] = true;
    } else {
      this.temperatureParams.enableConfig['pain'] = false;
    }
    if (this.config['breathConfig'] && JSON.stringify(this.config['breathConfig']) != "{}") {
      this.temperatureParams.enableConfig['breath'] = true;
    } else {
      this.temperatureParams.enableConfig['breath'] = false;
    }
    this.temperatureParams.showItems = [];
    if (this.config['onceConfigs'] && this.config['onceConfigs'].length>0) {
      this.config['onceConfigs'].forEach(element => {
        if (element['checkField']) {
          this.temperatureParams.showItems.push({
            'displayName':element['displayName'],
            'code':element['code'],
            'checkField':element['checkField'],
            'checkRule':element['checkRule']
          })
        }
      });
    }
    if (this.config['eventData'] && this.config['eventData'].length>0) {
      this.config['eventData'].forEach(element => {
        if (element['是否绘制竖线']==undefined) {
          element['是否绘制竖线'] = true;
        }
      });
    }
    if (this.showOtherProperty('visible','是否使用httpPrinter打印')) {
      this.nursingParams.nursingTemplateMaps = this.paramBean['是否使用httpPrinter打印']['httpPrinter模板字段映射'];
    }
    if (!this.config['dictionary']) {
      this.config['dictionary'] = [];
    }
    if (this.showOtherProperty('visible', '病案首页默认值设置')) {
      if (this.paramBean['病案首页默认值设置'] && this.paramBean['病案首页默认值设置'].trim().length > 0) {
        var defaultValuesStr = this.paramBean['病案首页默认值设置'].replace(/，/g, ","); //将逗号统一以防用户输入不一致
        var defaultValuesList = defaultValuesStr.split(",");
        var depValues = [];
        var hosValues = '';
        defaultValuesList.forEach(function (list) {
          var items = list.split("&");
          var index = items.findIndex(function (item) {
            return item.indexOf('科室ID=') > -1 || item.indexOf('医院编码') > -1;
          })
          var typeStr = items[index];
          var typeName = typeStr.split("=")[0];
          var Id = typeStr.split("=")[1] || "";
          if (typeName === '科室ID') {
            items.splice(index, 1);
            var value = items.join('&');
            depValues.push({ value: value, '科室ID': Id })
          } else if (typeName === '医院编码') {
            items.splice(index, 1);
            hosValues = items.join('&');
          }
        });
        this.recordParams.homePageDefaultValue = {
          depValues: depValues,
          hosValues: hosValues
        }
      }
    }
  }

  showOtherProperty(type,model){
    if(model == '基础病历数据源配置' && !this.loadAllDs){
      this.loadAllDs = true;
      this.recordParams.initDs()
    }
    if(model == 'pda'){
      model = (this.selectedParam || {})['model'];
    }
    for(let i=0;i<this.paramsTreeList.length;i++){
      if(model == this.paramsTreeList[i].model){
        if(type == 'visible'){
          return this.paramsTreeList[i].visible;
        }
        if(type == 'options'){
          return this.paramsTreeList[i].options;
        }
      }
    }
  }

  showOptionsLabel(list,value){
    for(let i=0;i<list.length;i++){
      if(value == list[i].value){
        return list[i].label;
      }
    }
  }

  initHospitalPrams(hospitalCoe, nodeCode, callback) {
    let searchParams = {
      '医院编码': hospitalCoe　|| '',
      '院区编码': nodeCode || ''
    };
    if(this.recordParams.templateList.length > 0) {

      this.getHospitalParam(searchParams,(d) => {

        let data = d;
          this.searchDataToView(data);
          if(data['科室查询参数绑定'] == null){
            this.templateParams.csList = [];
          }else{
            this.templateParams.csList = data['科室查询参数绑定'];
          }
          this.nursingParams.nursingFieldSignDictMaps = [];
          if(data['表单录入同步新版体温单字段映射']){
            var keys = Object.keys(data['表单录入同步新版体温单字段映射']);
            keys.forEach(key=>{
              this.nursingParams.nursingFieldSignDictMaps.push({"name":key,"fieldMapping":data['表单录入同步新版体温单字段映射'][key]});
            });
          }
          this.recordManageParams.emrManageExcelFieldFormat = [];
          if(data['病案管理导出EXCEL时间字段格式化形式']){
            var keys = Object.keys(data['病案管理导出EXCEL时间字段格式化形式']);
            keys.forEach(key=>{
              this.recordManageParams.emrManageExcelFieldFormat.push({"name":key,"format":data['病案管理导出EXCEL时间字段格式化形式'][key]});
            });
          }
          this.recordParams.baseRecordDataSourceGroup = data['基础病历数据源配置'] || [];
          this.nursingParams.todoReminderList = [];
          if(data['待办提醒事项设置']){
            var keys = Object.keys(data['待办提醒事项设置']);
            keys.forEach(key=>{
              this.nursingParams.todoReminderList.push({"reminderType":key,"todoReminderList":data['待办提醒事项设置'][key]});
            });
          }
          this.nursingParams.signEntryPageArr = [];
          if(data['护理表单数据分页数量']){
            var pageingNums = data['护理表单数据分页数量'];
            var keys = Object.keys(pageingNums);
            keys.forEach(key=>{
                this.nursingParams.signEntryPageArr.push({name:key,pageNum:pageingNums[key]});
            });
          }
          if(data['质控流程列表']){
            var list = data['质控流程列表'];
            this.qualityParams.statusList = [];
            for(var index = 0;index<list.length;index++){
              var status = list[index];
              if(index<list.length-1 && list[index]['code'].indexOf('TH')<0 && list[index+1]['code'].indexOf('TH')>-1){
                continue;
              }
              this.qualityParams.statusList.push({label:status['value'],value:status['code']});
            }
          }
          if (callback) {
            callback();
          }
          this.hospitalParamsVisible = true;

      })
    }else {
      this.initAllTemplateList(() => {
        this.getHospitalParam(searchParams,
          (d) => {
            let data = d;
            this.searchDataToView(data);
            if(data['科室查询参数绑定'] == null){
              this.templateParams.csList = [];
            }else{
              this.templateParams.csList = data['科室查询参数绑定'];
            }
            this.nursingParams.nursingFieldSignDictMaps = [];
            if(data['表单录入同步新版体温单字段映射']){
              var keys = Object.keys(data['表单录入同步新版体温单字段映射']);
              keys.forEach(key=>{
                this.nursingParams.nursingFieldSignDictMaps.push({"name":key,"fieldMapping":data['表单录入同步新版体温单字段映射'][key]});
              });
            }
            this.recordManageParams.emrManageExcelFieldFormat = [];
            if(data['病案管理导出EXCEL时间字段格式化形式']){
              var keys = Object.keys(data['病案管理导出EXCEL时间字段格式化形式']);
              keys.forEach(key=>{
                this.recordManageParams.emrManageExcelFieldFormat.push({"name":key,"format":data['病案管理导出EXCEL时间字段格式化形式'][key]});
              });
            }
            this.recordParams.baseRecordDataSourceGroup = data['基础病历数据源配置'] || [];
            this.nursingParams.todoReminderList = [];
            if(data['待办提醒事项设置']){
              var keys = Object.keys(data['待办提醒事项设置']);
              keys.forEach(key=>{
                this.nursingParams.todoReminderList.push({"reminderType":key,"todoReminderList":data['待办提醒事项设置'][key]});
              });
            }
            this.nursingParams.signEntryPageArr = [];
            if(data['护理表单数据分页数量']){
              var pageingNums = data['护理表单数据分页数量'];
              var keys = Object.keys(pageingNums);
              keys.forEach(key=>{
                  this.nursingParams.signEntryPageArr.push({name:key,pageNum:pageingNums[key]});
              });
            }
            if(data['质控流程列表']){
              var list = data['质控流程列表'];
              this.qualityParams.statusList = [];
              for(var index = 0;index<list.length;index++){
                var status = list[index];
                if(index<list.length-1 && list[index]['code'].indexOf('TH')<0 && list[index+1]['code'].indexOf('TH')>-1){
                  continue;
                }
                this.qualityParams.statusList.push({label:status['value'],value:status['code']});
              }
            }
            if (callback) {
              callback();
            }
            this.hospitalParamsVisible = true;

          });
      });
    }
    this.templateParams.ksList = [];
    var hospList = [];
    for(var i =0; i < this.hospitalParamList.length; i++){
      if(this.hospitalParamList && this.hospitalParamList[i] && this.hospitalParamList[i].医院编码 && this.hospitalParamList[i].科室列表){
        if(this.hospitalParamList[i].医院编码 == this.hospitalCode && this.hospitalParamList[i].院区编码 == this.nodeCode){
          //this.templateParams.ksList = this.hospitalParamList[i].科室列表;
          hospList = this.hospitalParamList[i].科室列表;
        }
      }
    }
    if(hospList.length > 0){
      for(var l =0;l<hospList.length; l++){
        var obj = {
          label:hospList[l].科室名称,
          value:hospList[l].科室ID,
          disabled:true,
        }
        this.templateParams.ksList.push(obj);
      }
    }
    console.log(this.templateParams.ksList);
  }

  getHospitalParam(param,callback){
    this.sysParamService.getHospitalPrams(param).then(d => {
      if(!d['pda全局设置']){
        this.initPdaParam(param['医院编码'],param['院区编码'],(pdaConfig) => {
          d['pda全局设置'] = pdaConfig;
          callback(d);
        })
      }else{
        callback(d);
      }
    },
    error => {
      this.msgs = [];
      this.msgs.push({severity:'warn',detail:'获取医院参数失败，请稍后重试。'})
    });
  }
  downloadPic(){
    this.temperatureParams.templateLogo = '';
    let templateLogo = (this.config || {})['logo'] || {};
    if(templateLogo['open'] && templateLogo['图标']){
      let fid = templateLogo['图标'];
      this.sysParamService.getPicFile(fid).then(u => {
        this.temperatureParams.templateLogo = u;
      })
    }
  }
  searchDataToView(hospitalParams){
    this.setTempatureItemsOptions(hospitalParams);
    this.initConfigPro(hospitalParams);
    this.paramBean = new BusinessParamBean();
    this.paramsId = hospitalParams['_id'];
    this.paramBean['createTime'] = hospitalParams['createTime'];
    this.paramBean['modifyTime'] = hospitalParams['modifyTime'];
    this.setBusinessDataToView(hospitalParams);
    this.paramBean['护理表单默认分页数'] = hospitalParams['护理表单默认分页数'];
    this.paramBean['快捷页面名称'] = hospitalParams['快捷页面名称'] || 'quickInputHTML';
    this.paramBean['需要以病历名称排序的成组病历目录'] = hospitalParams['需要以病历名称排序的成组病历目录'] || '';
    let wardTime = hospitalParams['病区启用新版体温单时间节点'] || {};

    this.wardInTimeArr = [];
    Object.keys(wardTime).forEach(wt => {
      let t = wardTime[wt];
      let d;
      if(t instanceof Date){
        d = t;
      }else{
        d = new Date(t);
      }
      this.wardInTimeArr.push({"病区ID":wt,"时间":d});
    });
    if(this.wardInTimeArr.length == 0){
      let wt = {"病区ID":'',"时间":null};
      this.wardInTimeArr.push(wt);
    }
  }

  setTempatureItemsOptions(hospitalParams: any) {
    this.sysParamService.getAllOnceConfigItems(hospitalParams['医院编码'], hospitalParams['院区编码']).then(res => {
      if(res.code == 10000) {
        this.temperatureParams.tempatureItemsOptions = [];
        const configs = res.data || [];
        configs.forEach(element => {
          this.temperatureParams.tempatureItemsOptions.push({
            'label': element.displayName + '(' + element.code + ')',
            'value': element.code
          });
        });
      }
    });
  }

  setBusinessDataToView(hospitalParams){
    let list = this.paramsTreeList;
    let me = this;
    let tmpHospitalParams = Object.assign({}, hospitalParams);
    delete tmpHospitalParams['_id'];
    delete tmpHospitalParams['createTime'];
    delete tmpHospitalParams['modifyTime'];
    delete tmpHospitalParams['医院编码'];
    delete tmpHospitalParams['院区编码'];

    let padSetting = tmpHospitalParams['pda全局设置'] || [];
    padSetting.forEach(e => {
      if(e['DEFAULT_VALUE'] == 'false'){
        e['DEFAULT_VALUE'] = false;
      }
      if(e['DEFAULT_VALUE'] == 'true'){
        e['DEFAULT_VALUE'] = true;
      }
    });
    me.paramBean['pda全局设置'] = padSetting;


    Object.keys(tmpHospitalParams).forEach(function(key){
      for(let i =0;i<list.length;i++){
        if(key == list[i].model){
          if(list[i].type == 'input' || list[i].type == 'check-multiselect' || list[i].type == 'switch-many' ||  list[i].type == 'multiSelect'){
            if(tmpHospitalParams[key]){
              me.paramBean[key] = tmpHospitalParams[key];
            }
          }
          else if(list[i].type == 'switch') {
            if (!tmpHospitalParams[key]
              && (
                key == '护理表单生成病历是否弹出打印界面'
                || key == '是否显示区域模板'
                || key == '过期模板是否可新建病历'
                || key == '护理表单保存是否同步生成病历'
                || key == '体温单手术天数是否显示0天'
                || key == '是否实时计算年龄'
                || key == '新生儿是否走质控流程'
                || key == '是否可以查看已归档病历'
                || key == '病历打印前是否自动保存'
                || key == '病案质控是否显示空病历患者'
                || key == '病案首页是否同步手术信息'
                || key == '登陆立即进行质控提示'
                || key == '是否显示个人收藏模板')
            ) {
              me.paramBean[key] = true;
            }else {
              me.paramBean[key] = tmpHospitalParams[key] == 'Y' ? true : false;
            }
          }
          else if(list[i].type == 'switch-input'){
            me.systemParams.signature = me.paramBean['签名设置'];
            me.systemParams.thirdCatalogs = me.paramBean['第三方目录集成'];
            if (key == '第三方目录集成' && tmpHospitalParams[key]) {
              tmpHospitalParams[key].forEach(item => {
                item['status'] = item['status'] == 'Y' ? true : false;
              })
              me.paramBean[key] = tmpHospitalParams[key];
              me.systemParams.thirdCatalogs = me.paramBean[key];
            }
            if(tmpHospitalParams[key]){
              me.paramBean[key] = tmpHospitalParams[key];
              if(key != '自动质控设置'){
                me.paramBean[key]['启用'] = me.paramBean[key]['启用']=='Y'?true:false;
              }
              if(key == '实时编辑分页'){
                me.paramBean[key]['打开病历时分页'] = me.paramBean[key]['打开病历时分页'] == 'Y'?true:false;
              }
              if(key == '成组病历设置'){
                me.paramBean[key]['成组病历合并打印'] = me.paramBean[key]['成组病历合并打印'] == 'Y'?true:false;
              }
              if(key == 'cdss对接设置'&&!me.paramBean[key]){
                me.paramBean[key] = { '启用': false, 'ip': '', 'port': '' };
              }
              if(key == '水印设置'){
                me.paramBean[key]['打印显示水印'] = me.paramBean[key]['打印显示水印'] == 'Y'?true:false;
              }
            }
          }
          else if(list[i].type == 'select'){

              let options = me.showOtherProperty('options',key);
              me.paramBean[key] = options[0].value;
              if(tmpHospitalParams[key]){
                for (let i=0;i<options.length;i++) {
                  if (tmpHospitalParams[key] == options[i].value) {
                    me.paramBean[key] = options[i].value;
                    break;
                  }
                }
              }


          }else if(list[i].type == 'switch-select'){
            if(tmpHospitalParams[key] && Object.keys(tmpHospitalParams[key]).length > 0){
              me.paramBean[key] = JSON.parse(JSON.stringify(tmpHospitalParams[key]));
              me.paramBean[key]['启用'] = tmpHospitalParams[key]['启用'] == 'Y' ? true : false;
            }
          }
        }
      }
      me.paramBean['基础病历数据源配置'] = me.baseEmrDsConfigRecover(tmpHospitalParams['基础病历数据源配置'] || []);
    });
    this.paramBean['收藏科室模版是否需要审核'] = tmpHospitalParams['收藏科室模版是否需要审核'] == 'Y' ? true : false;
  }


  saveHospitalParams(){
    let businessParamBean = new BusinessParamBean();
    if (this.paramBean['另页打印设置']['checkedType'].includes('another') && this.paramBean['另页打印设置']['anotherTemplates'].length == 0){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: '请选择需要另起一页打印的模板并保存！'});
      return ;
    }
    if (this.paramBean['另页打印设置']['checkedType'].includes('alone') && this.paramBean['另页打印设置']['aloneTemplates'].length == 0){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: '请选择需要单独一页打印的模板并保存！'});
      return ;
    }
    let _tempalte = this.checkedTemplateAlone();
    if (_tempalte) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: '一份病历只能使用一种规则，模板【' + _tempalte + '】选择重复!'});
      return ;
    }
    if (this.paramBean['自动新建病历设置']['启用'] && ((this.paramBean['自动新建病历设置']['病历'] || []).length == 0 && (this.paramBean['自动新建病历设置']['文书病历'] || []).length == 0)){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: '请选择病历并保存！'});
      return ;
    }

    if(this.paramBean['是否使用httpPrinter打印']['启用'] && this.nursingParams.nursingTemplateMaps){
      this.nursingParams.nursingTemplateMaps = this.nursingParams.nursingTemplateMaps.filter(mapping=>mapping['name'] != '');
      this.paramBean['是否使用httpPrinter打印']['httpPrinter模板字段映射'] = this.nursingParams.nursingTemplateMaps;
    }

    if(this.paramBean['全文检索跳转患者360页面设置']['360页面'] == 'his360' && !this.paramBean['全文检索跳转患者360页面设置']['his360地址']){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: '请填写his360地址！'});
      return;
    }else if(this.paramBean['全文检索跳转患者360页面设置']['360页面'] == '集成平台360' && !this.paramBean['全文检索跳转患者360页面设置']['集成平台360地址']){
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: '请填写集成平台360地址！'});
      return;
    }
    this.beforeSavaParams(businessParamBean,this.paramBean);
    businessParamBean['_id'] = this.paramsId;
    businessParamBean['createTime'] = this.paramBean['createTime'];
    businessParamBean['modifyTime'] = this.paramBean['modifyTime'];
    businessParamBean['医院编码'] = this.hospitalCode;
    businessParamBean['院区编码'] = this.nodeCode;
    businessParamBean['科室查询参数绑定'] = this.templateParams.csList;
    businessParamBean['cdss对接设置'] = this.paramBean['cdss对接设置'];
    businessParamBean['需要以病历名称排序的成组病历目录'] = this.paramBean['需要以病历名称排序的成组病历目录'];
    if(this.nursingParams.nursingFieldSignDictMaps&&this.nursingParams.nursingFieldSignDictMaps.length>0){
      businessParamBean['表单录入同步新版体温单字段映射'] = {};
      for(var index=0;index<this.nursingParams.nursingFieldSignDictMaps.length;index++){
        businessParamBean['表单录入同步新版体温单字段映射'][this.nursingParams.nursingFieldSignDictMaps[index]['name']] = this.nursingParams.nursingFieldSignDictMaps[index]['fieldMapping'];
      }
    }
    if(this.recordManageParams.emrManageExcelFieldFormat&&this.recordManageParams.emrManageExcelFieldFormat.length>0){
      businessParamBean['病案管理导出EXCEL时间字段格式化形式'] = {};
      for(var index=0;index<this.recordManageParams.emrManageExcelFieldFormat.length;index++){
        businessParamBean['病案管理导出EXCEL时间字段格式化形式'][this.recordManageParams.emrManageExcelFieldFormat[index]['name']] = this.recordManageParams.emrManageExcelFieldFormat[index]['format'];
      }
    }
    this.removeDropDpVal(this.recordParams.baseRecordDataSourceGroup || []);
    businessParamBean['基础病历数据源配置'] = this.recordParams.baseRecordDataSourceGroup || [];

    businessParamBean['待办提醒事项设置'] = {};
    this.nursingParams.todoReminderList.forEach(item=>{
      businessParamBean['待办提醒事项设置'][item['reminderType']] = item['todoReminderList'];
    });
    businessParamBean['护理表单数据分页数量'] = {};
    if(this.nursingParams.signEntryPageArr && this.nursingParams.signEntryPageArr.length > 0){
      this.nursingParams.signEntryPageArr.forEach(item=>{
        businessParamBean['护理表单数据分页数量'][item['name']] = Number(item['pageNum']);
      })
    }
    businessParamBean['护理表单默认分页数'] = this.paramBean['护理表单默认分页数'];
    this.sysParamService.saveHospitalParams(businessParamBean,this.selectedParam['model']).subscribe(
      apiResult =>{
        this.recordParams.baseRecordDataSourceGroup = this.baseEmrDsConfigRecover(this.recordParams.baseRecordDataSourceGroup || []);
        if(apiResult.code==10000){
          this.msgs = [];
          this.msgs.push({severity:'info',detail:'医院参数配置成功'});
          this.initHospitalPrams(this.hospitalCode,this.nodeCode, undefined);
        }
      },
      error =>{
        this.recordParams.baseRecordDataSourceGroup = this.baseEmrDsConfigRecover(this.recordParams.baseRecordDataSourceGroup || []);
        this.msgs = [];
        this.msgs.push({severity:'error',detail:'医院参数配置失败，请稍重试。'});
      }
    )
  }

  baseEmrDsConfigRecover(d){
    return d.reduce((p,c) => {
      c['renameDatasourceObj'] = {"code":'',"name":c['renameDatasource']};
      c['realtimeSync'] = (c['realtimeSync']=='Y' || c['realtimeSync']==true)?true:false;
      p.push(c);
      return p;
    },[]);
  }
  removeDropDpVal(d){
    d.forEach(element => {
      delete element['renameDatasourceObj'];
    });
  }
  saveHosParamByKey(key){
    let me = this;

    if(key == '病区启用新版体温单时间节点'){
      let wt = {};
      this.wardInTimeArr.forEach(wit => {
        if(wit['病区ID'] && wit['时间']){
          wt[wit['病区ID']] = wit['时间'];
        }
      })
      this.paramBean['病区启用新版体温单时间节点'] = wt;
    }


    let businessParamBean = new BusinessParamBean();
    this.beforeSavaParams(businessParamBean,this.paramBean);
    businessParamBean['_id'] = this.paramsId;
    businessParamBean['createTime'] = this.paramBean['createTime'];
    businessParamBean['modifyTime'] = this.paramBean['modifyTime'];
    businessParamBean['医院编码'] = this.hospitalCode;
    businessParamBean['院区编码'] = this.nodeCode;

    this.sysParamService.saveHospitalParams(businessParamBean,key).subscribe(
      apiResult =>{
        if(apiResult.code==10000){
          this.msgs = [];
          this.msgs.push({severity:'info',detail:'医院参数配置成功'});
          this.initHospitalPrams(this.hospitalCode,this.nodeCode, undefined);
        }
      },
      error =>{
        this.msgs = [];
        this.msgs.push({severity:'error',detail:'医院参数配置失败，请稍重试。'});
      }
    )
  }
  checkedTemplateAlone() {
    if (!this.paramBean['另页打印设置']) {
      return '';
    }
    let anotherTemplates = this.paramBean['另页打印设置']['anotherTemplates'];
    let aloneTemplates = this.paramBean['另页打印设置']['aloneTemplates'];
    let aloneWriteTemplates = this.paramBean['另页打印设置']['aloneWriteTemplates'] || [];
    let templates1 = [];
    let templates2 = [];
    if (aloneTemplates.length < anotherTemplates.length) {
      templates1 = aloneTemplates;
      templates2 = anotherTemplates;
    }else {
      templates1 = anotherTemplates;
      templates2 = aloneTemplates;
    }
    for (let i = 0; i < templates1.length; i++) {
      if (templates2.includes(templates1[i])) {
        return templates1[i];
      }
    }
    if (aloneWriteTemplates === null || aloneWriteTemplates === undefined) {
      return '';
    }
    for(let i =0 ;i < aloneWriteTemplates.length; i++) {
      if(anotherTemplates.includes(aloneWriteTemplates[i])) {
        return aloneWriteTemplates[i];
      }
      if(anotherTemplates.includes(aloneWriteTemplates[i])) {
        return aloneWriteTemplates[i];
      }
    }
    return '';
  }
  beforeSavaParams(businessParamBean,paramBean){
    let list = this.paramsTreeList;
    Object.keys(paramBean).forEach(function(key){
      for(let i =0;i<list.length;i++){
        if(key == list[i].model){
          if(list[i].type == 'input' || list[i].type == 'select' || list[i].type == 'check-multiselect' || list[i].type == 'switch-many' || list[i].type == 'multiSelect'){
            if(paramBean[key]){
              businessParamBean[key] = paramBean[key];
            }
          }
          else if(list[i].type == 'switch'){
            businessParamBean[key] = paramBean[key] == true ? 'Y' : 'N';
          }
          else if(list[i].type == 'switch-input'){
            if(paramBean[key]){
              if(key != '自动质控设置'){
                paramBean[key]['启用'] = paramBean[key]['启用'] == true?'Y':'N';
              }
              if(key == '实时编辑分页'){
                paramBean[key]['打开病历时分页'] = paramBean[key]['打开病历时分页'] == true?'Y':'N';
              }
              if (key == '第三方目录集成') {
                paramBean[key].forEach(item => {
                  item['status'] = item['status'] == true ? 'Y' : 'N';
                })
              }
              if(key == '成组病历设置'){
                paramBean[key]['成组病历合并打印'] = paramBean[key]['成组病历合并打印'] == true?'Y':'N';
              }
              if(key == '水印设置'){
                paramBean[key]['打印显示水印'] = paramBean[key]['打印显示水印'] == true?'Y':'N';
              }
              if(key == '签名设置'){
                let obj =  paramBean[key].filter(function(item){
                      return item['module']=='病历书写';
                  })[0];
                  obj['本人是否密码校验'] = obj['密码校验'] == true?obj['本人是否密码校验']:false;
              }
              businessParamBean[key] = paramBean[key];
            }
          }else if(list[i].type == 'switch-select'){
            if(paramBean[key] && key == '护理表单签名及修改权限设置'){
              businessParamBean[key]['启用'] = paramBean[key]['启用'] == true ? 'Y' : 'N';
              businessParamBean[key]['可以修改他人记录'] = paramBean[key]['启用'] != true ? 'N' : paramBean[key]['可以修改他人记录'];
              businessParamBean[key]['修改是否可以变更签名'] = paramBean[key]['启用'] != true ? 'N' : paramBean[key]['修改是否可以变更签名'] || 'N';
              businessParamBean[key]['密码校验'] = (paramBean[key]['启用'] != true || paramBean[key]['可以修改他人记录'] == 'Y') ? 'N' : paramBean[key]['密码校验'] || 'N';
            }
          }
        }
      }
    });
    businessParamBean['快捷页面名称'] = paramBean['快捷页面名称'];

    if(((this.selectedParam || {})['model'] || '').indexOf('pda') > -1){
      let k = 'pda全局设置';

      let pdaConfig = JSON.parse(JSON.stringify(paramBean[k] || []));
      pdaConfig.forEach(e => {
        if(e['DEFAULT_VALUE'] === false){
          e['DEFAULT_VALUE'] = 'false';
        }
        if(e['DEFAULT_VALUE'] === true){
          e['DEFAULT_VALUE'] = 'true';
        }
      });
      businessParamBean[k] = pdaConfig;
    }
    businessParamBean['收藏科室模版是否需要审核'] = paramBean['收藏科室模版是否需要审核'] == true ? 'Y' : 'N';
  }

  /**
   * 输入框校验
   * @param evt
   * @param type
   */
  vertifyNumber(evt: any, type: string) {
    let value = evt.target.value;
    value = (value.length === 1) ? value.replace(/[^0-9]/g, '').replace(/\./g, '') : value.replace(/\D/g, '').replace(/\./g, '');
    if(type == '阈值' && value == '0'){
      value = '';
    }
    evt.target.value = value;
    switch (type) {
      case '期限':
        this.paramBean['借阅归还时限']['期限'] = value;
        break;
      case '时间间隔':
        this.paramBean['书写自动保存']['时间间隔'] = value;
        break;
      case '院级质控自动通过天数':
        this.paramBean['自动质控设置']['院级质控自动通过天数'] = value;
        break;
      case '病案室自动归档天数':
        this.paramBean['自动质控设置']['病案室自动归档天数'] = value;
        break;
      case '出院后未提交质控时间':
        this.paramBean['逾期锁定病历设置']['出院后未提交质控时间'] = value;
        break;
      case '解锁后再次锁定时间':
        this.paramBean['逾期锁定病历设置']['解锁后再次锁定时间'] = value;
        break;
      case '逾期时长起算天数':
        this.paramBean['逾期锁定病历设置']['逾期时长起算天数'] = value;
        break;
      case '出院后提交天数':
        this.paramBean['逾期天数设置']['出院后提交天数'] = value;
        break;
      case '出院后归档天数':
        this.paramBean['逾期天数设置']['出院后归档天数'] = value;
        break;
      case '自动提交病案天数':
        this.paramBean['自动质控设置']['自动提交病案天数'] = value;
        break;
      case '再次自动提交病案天数':
        this.paramBean['自动质控设置']['再次自动提交病案天数'] = value;
        break;
    }
  }

  // 获取病案首页的模板列表
  getEmrTemplates(){
    this.recordParams.emrTemplates = [{label: '请选择', value: ''}];
    let params = {
      'areaCode': ((this.selectedHospiral == undefined)?this.currentUserInfo['areaCode']:this.selectedHospiral['areaCode']) || '',
      '医院编码': this.hospitalCode || '',
      '院区编码': this.nodeCode || '',
      '科室ID': '',
      'scope': 'hospital'
    };
    this.sysParamService.queryDirAndTemplateList(params)
    .then(
    data => {
      console.log(data);
      if(data.code == 10000){
        let list = data.data.filter(item => item['目录名称']=='病案首页');
        if (list.length>0) {
          list[0]['模板列表'].forEach((item: any) => {
            let templateName = this.getRealNameInfo(item['模板名称']);
            this.recordParams.emrTemplates.push({label: templateName, value: templateName});
          });
        }
      }
    },
    err => {
      this.msgs = [];
      this.msgs.push({severity:'error',detail:'获取数据元列表失败,请检查网络并稍后再试'});
    });

  }
  getNursingTemplates(){
    let showDir = ['护理表单','护理文书','评估单'];
    this.recordParams.emrNursingTemplate = [];
    this.templateService.getTemplateDirs(this.hospitalCode+'-'+this.nodeCode).then(d => {
      let ops = [];
      showDir.forEach(dir => {
        let list = (d || {})[dir] || [];
        list.forEach(e => {
          ops.push({"label":e['模板名称'],"value":e['模板名称']});
        });
      })
      if(ops.length > 0){
        this.recordParams.emrNursingTemplate = ops;
      }
    })
  }


  // 获取模板名称
  getRealNameInfo(templateName):string {
    if (templateName && templateName.indexOf('@') == -1) {
      const template_name=templateName;
      return template_name;
    }else{
      const nameNoVersion = templateName.split('@')[0];   //不包含版本
      const nameArray = nameNoVersion.split('.');//标准化命名之后，每个病历名称的长度是确定的
      const template_name = nameArray[nameArray.length - 1];
      return template_name;
    }
  }

  addWardTimeSet(){
    this.wardInTimeArr.push({"病区ID":'',"时间":null});
  }
  getWardList(areaCode){
    this.sysParamService.getWardList(areaCode,this.hospitalCode,this.nodeCode).then(
      d => {
        this.initWardlist(d['data'] || []);
      }
    )
  }
  initWardlist(depts){
    this.wards = [{"label":"请选择","value":''}];
    depts.forEach(d => {
      this.wards.push({"label":d['科室名称'],"value":d['科室ID']});
    });
  }

  searchRecordDataSource(i){
    let params = {
      templateNameList: [this.recordParams.baseRecordDataSourceGroup[i]['name']],
      key: this.basedlgSearchParams.key,
      pageSize: this.basedlgSearchParams.page.pageSize,
      currentPage: this.basedlgSearchParams.page.currentPage
    };
    this.baseDataSouceContentIndex = i;
    //查询该病历模板的所有数据源
    this.sysParamService.searchDataSourceListByParams(params)
    .then(
      data => {
        this.selectedBaseDataSources = [];
        this.templateDataSource = [];
        if (data.code == '10000') {
          this.templateDataSource = data.data.dataElementList;
          this.showTemplateDataSource = data.data.dataElementList;
          this.alreadSelectedDataSourceNames = (this.recordParams.baseRecordDataSourceGroup[i]['dataSources'] || "").split(",");
          if (this.alreadSelectedDataSourceNames.length > 0) {
            this.displaybaseDataSourceMsgDialog = true;
            this.templateDataSource.filter(item => {
              if (this.alreadSelectedDataSourceNames.includes(item['dataSourceName'])) {
                this.selectedBaseDataSources.push(item);
                return false;
              }
              return true;
            });
          }
          this.basedlgSearchParams.page = data.data.page;
        } else {
          this.msgs = [];
          this.msgs.push({severity:'error',detail:'未正确获取数据源，请联系运维人员！'});
      }
      this.basedataSourceTableLoadingFlag = false;
    },
    err => {
      this.basedataSourceTableLoadingFlag = false;
      this.msgs = [];
      this.msgs.push({severity:'error',detail:'获取数据元列表失败,请检查网络并稍后再试'});
    });
  }

  confirmbaseDataSourceDialog(){
    this.selectedBaseDataSourceNames = [];
    this.displaybaseDataSourceMsgDialog = false;
    (this.selectedBaseDataSources || []).forEach(item => {
      this.selectedBaseDataSourceNames.push(item['dataSourceName']);
    });
    this.selectedBaseDataSourceNames.forEach(item=>!this.selectedBaseDataSourceNames.includes(item)&&this.selectedBaseDataSourceNames.push(item));
    this.recordParams.baseRecordDataSourceGroup[this.baseDataSouceContentIndex]['dataSources'] = (this.selectedBaseDataSourceNames || []).join(',');
  }

  clearbaseDataSource(){
    this.basedlgSearchParams.key = '';
    this.basedlgSearchParams.scoreType = '';
    this.basedlgSearchParams.page = new PageClazz();
    this.displaybaseDataSourceMsgDialog = false;
    this.filterbaseDataSourceStr = '';
  }

  filterbaseDataSource(){
    if(this.filterbaseDataSourceStr){
      this.templateDataSource = this.showTemplateDataSource.filter(i => i['dataSourceName'].indexOf(this.filterbaseDataSourceStr) > -1);
    }else{
      this.templateDataSource = this.showTemplateDataSource;
    }
  }

  initConfigPro(parm){
    let allPro = (parm.质控状态列表 || []).filter(p => {return p['code'] != 'WTJ' && !p['back'];}).sort((a,b) => {return a['order'] < b['order']?-1:1;});
    this.qualityParams.processConfig = [];

    let len = allPro.length;
    let delPro = (parm['质控流程配置'] || {})['屏蔽流程'] || {};
    for(let i=0;i<len;i++){
      let cur = {"code":allPro[i]['code'],"name":allPro[i]['value']};
      if(i == 0){
        cur['type'] = 'require';
      }else if(delPro[cur['code']]){
       cur['type'] = 'del';
      }
      this.qualityParams.processConfig.push(cur);
    }
  }

  initPdaParam(hosnum,nodecode,callback){
    this.sysParamService.pdaParams(hosnum,nodecode).then(d => {
      callback(d || []);
    })
  }

  changeParamType(type) {
    if (this.paramTypeDisable) {
      return;
    }
    this.selectParamType = type;
    paramsTree.forEach(item => {
      if (item.label === type) {
        this.hospitalParamsTree = [item];
      }
    })
    this.updateHospitalsParam();
  }
}
