import { DateUtil } from './../../../../basic/common/util/DateUtil';
import { ConfirmationService } from 'portalface/widgets';
import { LoadingService } from 'portalface/services';
import { GrowlMessageService } from './../../../../common/service/growl-message.service';
import { AuthTokenService } from './../../../../basic/auth/authToken.service';
import { ScoreService } from './../../score-service';
import { SysParamService } from './../../../sys-param/sys-param.service';
import { Consistency } from './../model/consistency.model';
import { DeadLine } from './../model/deadline.model';
import { PageClazz } from './../../../../common/model/page-clazz';
import { ChildScoreComponent } from './../model/child-score/child-score.component';
import { Completeness } from './../model/completeness.model';
import { ContentQuality } from './../model/content-quality.model';
import { CurrentUserInfo } from './../../../../basic/common/model/currentUserInfo.model';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Score } from '../model/score.model';

@Component({
  selector: 'kyee-score-config',
  templateUrl: './score-config.component.html',
  styleUrls: ['./score-config.component.scss']
})
export class ScoreConfigComponent implements OnInit {
  @Input()
  currentUserInfo: CurrentUserInfo;
  @Input()
  currentAreaCode;
  @Input()
  currentHosCode;
  @Input()
  hosAreaCode;

  controlType: any = [];//质控类型
  selectedControl: Number;
  templateList: any = [];//模板列表
  statusType: any = [];//状态类型
  scoreType: any = [];//评分类型
  ruleDescription = '';
  sakelengent: String = '';
  status: Number;
  score: Number;
  
  tableLoadingFlag: any; // 表格加载loading状态
  searchResults: any = []; // 搜索结果列表
  paginateInfo: object = {
    totalNum: 0, // 记录总数
    pageSize: 15, // 每页显示数量
    pageNo: 1 // 当前页
  };
  @ViewChild('editorIframe') editorIframe: ElementRef;
  msgs: any; // 提示消息


  isShowContentQualityDialog: boolean;
  contentQualityHeader: string = '新建内容质控';
  contentQuality: ContentQuality = new ContentQuality();
  completeness: Completeness = new Completeness();
  @ViewChild(ChildScoreComponent) public childScore: ChildScoreComponent;
  displayDataSourceMsgDialog: boolean;
  dataSources: any[] = [];
  inputLimitList: any[] = [];
  selectedvalueRegex: string;
  lengthLimitVisible:boolean;
  rangeLimitVisible:boolean;
  valueLimitVisible:boolean;
  completenessLimitType:string = '必填项';
  dataSourceTypeArray:any[] = [];
  selectedDataSources:any;
  dataSourceTableLoadingFlag:boolean = false;
  dlgSearchParams = {
    key: '',
    scoreType: '',
    page: new PageClazz()
  }
  selectedRules: any = [];

  showTimeLimitFlag: Boolean = false; // 是否显示时限质控弹框
  timeLimitHeader: String= '新建时限质控';
  dialogTemplateList: any = []; // 弹框中病历列表
  consistencyTemplateList: any = []; // 选择一致性对应的模板病历列表
  eventTypeList: Object[];
  timeUnitList: Object[];
  manualScoreHeader: String = '新建手动质控规则';
  showManualScoreFlag: Boolean = false; // 是否显示手动质控弹框
  deadLine: DeadLine = new DeadLine();

  selectedTemplate: any;
  consistency: Consistency = new Consistency(); // 内容质控的完整性规则

  markTypeList: Object[];
  rejectLevelList: Object[];


  //valueLimit:Object = {type:'reg',name:'',value1:'',value2:''};
// reg 模糊，acc 精确， limit 范围 , range 时间范围
  valueType:string = 'reg';
  valueName:string;
  valueNameType:string;//选择的质控条件中数据元的类型
  value1:Object;
  value2:Object;
  accValueType: string = '';
  basKey: Object[];
  basLimitKey:Object[];
  isCompareTime:boolean = false;

  // 病历分类
  emrType:string;
  containMin:string = '0';
  containMax:string = '0';
  rangeValue:string = '2';

  containType:any=[
    { label: '不包含', value: "0" },
    { label: '包含', value: "1" }
  ];

  containRange:any=[
    { label: '大于', value: "0" },
    { label: '大于等于', value: "1" },
    { label: '等于', value: "2" },
    { label: '小于等于', value: "3" },
    { label: '小于', value: "4" }
  ]

  regType:string = 'reg-c';
  ruleDataSource:string;
  flag:boolean = false;
  constructor(
    protected sysParamService: SysParamService,
    protected scoreService: ScoreService,
    protected authTokenService: AuthTokenService,
    protected growlMessageService: GrowlMessageService,
    protected loadingService: LoadingService,
    protected confirmationService: ConfirmationService,
    protected el: ElementRef

  ) { }

  ngOnInit() {
    this.controlType = [
      { label: '质控类型', value: "" },
      { label: '时限质控', value: "时限质控" },
      { label: '内容质控', value: "内容质控" },
      { label: '逻辑质控', value: "逻辑质控" },
      { label: '手动质控', value: "手动质控" }
    ];
    this.statusType = [
      { label: '状态', value: "" },
      { label: '启用', value: "启用" },
      { label: '停用', value: "停用" }
    ];
    this.inputLimitList = [
      { label: '身份证号码', value: '身份证号码' },
      { label: '联系电话', value: '联系电话' },
      { label: '邮政编码', value: '邮政编码' },
      { label: '费用类型', value: '费用类型' },
      { label: '纯数字', value: '纯数字' },
      { label: '其它', value: '其它' }
    ];
    this.scoreType = [
      { label: '全部', value: "" },
      { label: '完整性', value: "完整性" },
      { label: '一致性', value: "一致性" },
      { label: '互斥性', value: "互斥性" },
      { label: '时限性', value: "时限性" },
      { label: '逻辑性', value: "逻辑性" }
    ];
    this.timeUnitList = [
      {'label': '天', 'value': '天'},
      {'label': '小时', 'value': '小时'},
      {'label': '分钟', 'value': '分钟'}
    ];
    this.rejectLevelList = [
      {'label': '乙级', 'value': '乙级'},
      {'label': '丙级', 'value': '丙级'}
    ];
    this.markTypeList = [
      {'label': '单项扣分', 'value': '单项扣分'},
      {'label': '单次扣分', 'value': '单次扣分'}
    ];
    this.dataSourceTypeArray= [
      {name: '文本输入框', code: 'textbox', hasItems: false, placeHolder: ''},
      {name: '新文本输入框', code: 'newtextbox', hasItems: false, placeHolder: ''},
      {name: '数字控件', code: 'numbox', hasItems: false, placeHolder: ''},
      {name: '文本控件', code: 'textboxwidget', hasItems: false, placeHolder: ''},
      {name: '单选', code: 'radiobox', hasItems: true, placeHolder: '选项1#选项2'},
      {name: '多选', code: 'checkbox', hasItems: true, placeHolder: '选项1#选项2'},
      {name: '下拉菜单', code: 'dropbox', hasItems: true, placeHolder: '显示1(内容1)#显示2(内容2)'},
      {name: '单元', code: 'cellbox', hasItems: false, placeHolder: ''},
      {name: '搜索', code: 'searchbox', hasItems: false, placeHolder: ''},
      {name: '时间', code: 'time', hasItems: false, placeHolder: ''},
      {name: '日期', code: 'date', hasItems: false, placeHolder: ''},
      {name: '月/日', code: 'month_day', hasItems: false, placeHolder: ''},
      {name: '日期 时间', code: 'datetime', hasItems: false, placeHolder: ''},
      {name: '时:分:秒', code: 'fullTime', hasItems: false, placeHolder: ''},
      {name: '年-月-日 时:分:秒', code: 'fullDateTime', hasItems: false, placeHolder: ''},
      {name: 'yyyy年MM月dd日', code: 'date_han', hasItems: false, placeHolder: ''},
      {name: 'yyyy年MM月dd日HH时mm分', code: 'datetime_han', hasItems: false, placeHolder: ''},
      {name: '按钮', code: 'button', hasItems: false, placeHolder: ''},
      {name: '文本时间', code: 'timetext', hasItems: false, placeHolder: ''}
    ];
    this.basLimitKey = [
      {'label': '选择基本信息', 'value': ''},
      {'label': '年龄', 'value': '年龄'},
      {'label': '实际住院', 'value': '实际住院天数'}
    ];
    this.basKey = [
      {'label': '选择基本信息', 'value': ''},
      {'label': '住院号', 'value': '住院号'},
      {'label': '民族', 'value': '民族'},
      {'label': '性别', 'value': '性别'},
      {'label': '国籍', 'value': '国籍'},
      {'label': '科室名称', 'value': '科室名称'},
      {'label': '病区名称', 'value': '病区名称'}
    ];
    this.initEventTypeList();
    this.inittemplateList(this.currentHosCode+'-'+this.hosAreaCode);
    this.search();
 

  }

  /**
   * 查询模板名称
   */
  inittemplateList(hosnum) {
    this.scoreService.inittemplateList(hosnum).then(data => {
      if (!data) {
        return;
      }
      this.formatTemplateDirs(data);
    });
  }


  /**
   * 模板数据处理
   * @param data
   */
  formatTemplateDirs(data) {
    this.dialogTemplateList = [];
    this.consistencyTemplateList = [];
    this.templateList = [{ label: '所有病历', value: '' }];
    data.forEach(item => {
      this.templateList.push({ label: item['模板名称'], value: item['模板名称'] });
      this.dialogTemplateList.push({label: item['模板名称'], value: item['模板名称']});
      if (item['禁止多份'] === '1') {
        this.consistencyTemplateList.push({label: item['模板名称'], value: item['模板名称']});
      }
    });
  }



  /**
   * 执行搜索
   */
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
  paginate(event) {
    if ((event.page + 1) !== this.paginateInfo['pageNo'] || this.paginateInfo['pageNo'] === 1) {
      this.paginateInfo['pageNo'] = event.page + 1;
      this.search();
    }
  }


  showloading(flag) {
    let back = document.getElementsByClassName("kyee-loading-backdrop")[0],
      icon = document.getElementsByClassName("kyee-loading-container")[0];
    if (back && icon) {
      if (flag) {
        back.removeAttribute('hidden');
        icon.removeAttribute('hidden');
      } else {
        back.setAttribute('hidden', "hidden")
        icon.setAttribute('hidden', "hidden")
      }
    }
  }
  /**
  *  执行搜索
  */
  search() {
    this.tableLoadingFlag = true;
    let firstMenu = this.selectedControl || this.controlType[0].value;
    //let secondMenu = this.sakelengent || this.templateList[0].value;
    let secondMenu = this.sakelengent || '';
    let statusValue = this.status || this.statusType[0].value;

    const params = {
      '医院编码': this.currentHosCode,
      '院区编码': this.hosAreaCode,
      'areaCode': this.currentAreaCode,
      'ruleType': firstMenu,
      'templateName': secondMenu,
      'ruleDescription': this.ruleDescription,
      'status': statusValue,
      'pageNo': this.paginateInfo['pageNo'],
      'pageSize': this.paginateInfo['pageSize'],
      'ruleDataSource':this.ruleDataSource || '',
      'flag':this.flag
    };
    this.showloading(true);
    this.scoreService.queryScoreHistory(params).then((data) => {
      this.tableLoadingFlag = false;
      if(data && data.scoredList){
        this.searchResults = data.scoredList.map(v => {
          v.singleReject = v.score.singleReject ? "是" : "否";
          if(v.singleReject == '否'){
            v.score.rejectLevel = '--';
          }
          if ('内容质控' == v.ruleType) {
            v.rule.commitCheckedType = v.rule.commitCheckedType || '提交时仅显示';
          }
          return v;
        }) || [];
        this.paginateInfo['totalNum'] = parseInt(data.total || 0);
      }else{
        this.searchResults = [];
        this.paginateInfo['totalNum'] = 0;
      }
      this.showloading(false);
    }, error => {
      this.tableLoadingFlag = false;
      this.searchResults = [];
      this.paginateInfo['totalNum'] = 0;
      this.showMessage('error', '异常', error.message || '网络异常');
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
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }




  /**
   * 显示新增内容质控弹框
   */
  showContentQualityDialog() {
    this.resetValueLimit();
    this.resetContentQuality();
    this.isShowContentQualityDialog = true;
  }

  /**
   * 重置内容质控弹框内容
   */
  resetContentQuality() {
    this.contentQuality = new ContentQuality();
    this.completeness = new Completeness();
    this.consistency = new Consistency();
    this.childScore.score = new Score();
    this.childScore.createScoreCriteria = false;
    this.contentQualityHeader = '新建内容质控';
    this.contentQuality.scoreType = '完整性';
    this.completenessLimitType = '必填项';
    this.completeness.required = true;
    this.selectedvalueRegex = '身份证号码';
    this.lengthLimitVisible = false;
    this.rangeLimitVisible = false;
    this.valueLimitVisible = false;
    this.selectedTemplate = '';
    this.isCompareTime = false;
  }

  clickScoreType(type) {
    // this.completenessLimitType = '必填项';
    // this.completeness = new Completeness();
    // this.lengthLimitVisible = false;
    // this.rangeLimitVisible = false;
    // this.valueLimitVisible = false;
    // switch (type) {
    //   case '完整性':
    //     // this.completenessLimitType = '必填项';
    //     // this.completeness = new Completeness();
    //     // this.lengthLimitVisible = false;
    //     // this.rangeLimitVisible = false;
    //     // this.valueLimitVisible = false;
    //     break;
    //   case '一致性':
    //     break;
    // }
  }

  /**
   * 新增内容质控Dialog确认操作
   */
  confirmContentQuality() {
    if (!this.selectedTemplate) {
      this.growlMessageService.showWarningInfo('请选择病历！再保存');
      return;
    }
    if (this.contentQuality.dataSources.length < 1) {
      this.growlMessageService.showWarningInfo('请选择数据元！再保存');
      return;
    }
    if (!this.contentQuality.ruleDescription) {
      this.growlMessageService.showWarningInfo('请填写规则描述！再保存');
      return;
    }

   let msg = this.checkValueLimit();
   if(msg){
    this.growlMessageService.showWarningInfo(msg);
     return;
   }

    if ('完整性' === this.contentQuality.scoreType) {
      this.updateCompletenessData();
      if (this.selectedvalueRegex != '其它') {
        this.completeness.valueRegex =  this.selectedvalueRegex;
      }
      if (!this.checkCompletenessRule()) {
        return;
      }
      this.completeness.minLength += '';
      this.completeness.maxLength += '';
      this.contentQuality.rule = this.completeness;
    }else {
        this.clearIntegrityRuleContent();
        if (!this.consistency.templateName) {
          this.growlMessageService.showWarningInfo('请选择一致性规则的病历模板');
          return;
        }
        if (!this.consistency.datasourceName) {
          this.growlMessageService.showWarningInfo('请选择一致性规则的病历模板中数据元');
          return;
        }
        this.contentQuality.rule = this.consistency;
    }
    this.childScore.score.value += '';
    this.contentQuality.score = this.childScore.score;
    this.contentQuality.createScoreCriteria = this.childScore.createScoreCriteria;
    this.contentQuality.ruleType = '内容质控';
    this.contentQuality.autoOrHand = '自动评分';
    if(this.isCompareTime){
      this.contentQuality.rule['required'] = false;
      this.contentQuality.rule['timeLimit'] = true;
    }else{
      this.contentQuality.rule['timeLimit'] = false;
    }
    // if(this.emrType){
    //   this.contentQuality.type = this.emrType;
    // }
    if (this.valueName) {
      if(this.valueType != 'reg' && this.valueType != 'range' && this.valueType != 'acc' && this.valueType != 'limit'){
        this.valueType = '';
      }
      let regType = this.regType;
      this.contentQuality.valueLimit = {type:this.valueType,name:this.valueName,value1:this.value1,value2:this.value2,containMin:this.containMin,containMax:this.containMax, accValueType: this.accValueType,regType:regType,rangeValue:this.rangeValue};
    }
    this.saveScoreCriteria(() => {
      this.isShowContentQualityDialog = false;
    });
  }

  /**
   * 内容质控的完整性规则校验
   */
  checkCompletenessRule() {
      if (this.completeness.lengthLimit) {
        if (!this.completeness.minLength) {
          this.growlMessageService.showWarningInfo('请填写长度限制大于0的最小值!');
          return false;
        }
        if (!this.completeness.maxLength) {
          this.growlMessageService.showWarningInfo('请填写长度限制大于0的最大值!');
          return false;
        }
        if (parseFloat(this.completeness.minLength) >= parseFloat(this.completeness.maxLength)) {
          this.growlMessageService.showWarningInfo('最大值必须大于最小值！');
          return false;
        }
      }
      if (this.completeness.rangeLimit && !this.completeness.valueRange) {
        this.growlMessageService.showWarningInfo('请填写值域限定，再保存');
        return false;
      }
      if (this.completeness.valueLimit && !this.completeness.valueRegex) {
        this.growlMessageService.showWarningInfo('请填写自定义正则表达式，再保存');
        return false;
      }
      if (this.childScore.createScoreCriteria && !this.childScore.score.value) {
        this.growlMessageService.showWarningInfo('扣分值必须是大于0的数');
        return false;
      }
      return true;
  }

  /**
   * 当选择一致性时，清空完整性规则内容
   */
  clearIntegrityRuleContent() {
    this.completenessLimitType = '';
    this.completeness = new Completeness();
    this.lengthLimitVisible = false;
    this.rangeLimitVisible = false;
    this.valueLimitVisible = false;
  }

  /**
   * 更新内容质控类型对应数据
   */
  updateCompletenessData() {
    if (this.completeness.required) {
      this.completeness.minLength = '';
      this.completeness.maxLength = '';
      this.completeness.valueRange = '';
      this.selectedvalueRegex = '';
    }else if (this.completeness.lengthLimit) {
      this.completeness.valueRange = '';
      this.selectedvalueRegex = '';
    }else if (this.completeness.rangeLimit) {
      this.completeness.minLength = '';
      this.completeness.maxLength = '';
      this.selectedvalueRegex = '';
    }else if (this.completeness.valueLimit) {
      this.completeness.minLength = '';
      this.completeness.maxLength = '';
      this.completeness.valueRange = '';
    }
  }

  /**
   * 禁止chips组件自由键入
   * @param event
   */
  preventChipsInput(event) {
    event.returnValue = true;
    return false;
  }
  preventChipsDlg(event) {
    event.originalEvent.stopPropagation();
  }

  clickLimitTypeOpt(type){
    // if (this.contentQualityHeader === '编辑内容质控') {
    //   return;
    // }
    this.lengthLimitVisible = false;
    this.rangeLimitVisible = false;
    this.valueLimitVisible = false;
    this.completeness.required = false;
    this.completeness.lengthLimit = false;
    this.completeness.rangeLimit = false;
    this.completeness.valueLimit = false;
    switch (type) {
      case 'required':
        this.completeness.required = true;
        break;
      case 'lengthLimit':
        this.lengthLimitVisible = true;
        this.completeness.lengthLimit = true;
        break;
      case 'rangeLimit':
        this.rangeLimitVisible = true;
        this.completeness.rangeLimit = true;
        break;
      case 'valueLimit':
        this.valueLimitVisible = true;
        this.completeness.valueLimit = true;
        break;
    }
  }

  setCompletenessLimit(completeness){
    if(completeness.required){
      this.completenessLimitType = '必填项';
    }
    if(completeness.lengthLimit){
      this.completenessLimitType = '长度限制';
      this.lengthLimitVisible = true;
    }
    if(completeness.rangeLimit){
      this.completenessLimitType = '值域限制';
      this.completeness.rangeLimit = true;
      this.rangeLimitVisible = true;
    }
    if(completeness.valueLimit){
      this.completenessLimitType = '输入限制';
      this.valueLimitVisible = true;
      for(let i=0;i<this.inputLimitList.length;i++){
        if(this.inputLimitList[i].value == completeness.valueRegex){
          this.selectedvalueRegex = completeness.valueRegex;
          return;
        }else{
          this.selectedvalueRegex = '其它';
        }
      }
    }
  }

  changeValueRegex(){
    if(this.selectedvalueRegex == '其它'){
      this.completeness.valueRegex ='';
    }
  }

  /**
   * 选择数据源
   */
  showDataSourceMsgDialog(event: any, scoreType: string) {
    this.dlgSearchParams.scoreType = scoreType;
    this.selectedDataSources = null;
    this.dlgSearchParams.key = '';
    if (scoreType === '一致性') {
      if (!this.consistency.templateName) {
        this.growlMessageService.showWarningInfo('请先选择一致性类型的病历模版！');
        return;
      }
    }else {
      if (!this.selectedTemplate) {
        this.growlMessageService.showWarningInfo('请先选择病历模版！');
        return;
      }
    }
    event.target.blur();
    this.getDataSources();
    setTimeout(() => {
      this.displayDataSourceMsgDialog = true;
    }, 0);
  }

  /**
   * 关闭数据元弹框时，清除数据
   */
  clearDataSourceData() {
    this.dlgSearchParams.key = '';
    this.dlgSearchParams.scoreType = '';
    this.dlgSearchParams.page = new PageClazz();
  }

  getDataSources() {
    let params = {
      templateNameList: [this.selectedTemplate],
      key: this.dlgSearchParams.key,
      pageSize: this.dlgSearchParams.page.pageSize,
      currentPage: this.dlgSearchParams.page.currentPage
    };
    if (this.dlgSearchParams.scoreType === '一致性') {
      params.templateNameList = [this.consistency.templateName];
    }
    this.dataSourceTableLoadingFlag = true;
    let me = this;
    this.scoreService.searchDataSourceListByParams(params)
      .then(
      data => {
        if (data.code == '10000') {
          this.dataSources = data.data.dataElementList;
          if(this.dataSources.length>0){
            this.dataSources.forEach(item => {
              if(item.createDate){
                item.createDate = DateUtil.format(item.createDate,"yyyy-MM-dd HH:mm");
              }
              for(let i=0;i<this.dataSourceTypeArray.length;i++){
                if(this.dataSourceTypeArray[i].code == item.typeCode){
                  item.typeName = this.dataSourceTypeArray[i].name;
                }
              }
              if(this.dlgSearchParams.scoreType === '完整性'){
              for(let i=0;i<this.contentQuality.dataSources.length;i++){
                if(this.contentQuality.dataSources[i] == item.dataSourceName){
                  this.selectedDataSources = item;
                }
              }
            }


              if(this.dlgSearchParams.scoreType === '质控条件' && this.valueName && this.valueName == item.dataSourceName){
                this.selectedDataSources = item;
              }
              if(this.dlgSearchParams.scoreType === '一致性' && this.consistency.datasourceName == item.dataSourceName){
                this.selectedDataSources = item;
              }
            });
          }
          if(data.data.page.totalRecords > 5){
            me.el.nativeElement.querySelector('#datasourcedialog').firstElementChild.style.top = '0';
          }else{
            me.el.nativeElement.querySelector('#datasourcedialog').firstElementChild.style.top = '200px';
          }
          this.dlgSearchParams.page = data.data.page;
        } else {
          this.showMessage('error', '获取数据元列表失败', data.msg);
        }
        this.dataSourceTableLoadingFlag = false;
      },
      err => {
        this.dataSourceTableLoadingFlag = false;
        this.showMessage('error', '获取数据元列表失败', err);
      });
  }

  confirmDataSourceDialog() {
    let dataSourceName = this.selectedDataSources ? this.selectedDataSources.dataSourceName : '';
    if (this.dlgSearchParams.scoreType === '一致性') {
      this.consistency.datasourceName = dataSourceName;
    }else if(this.dlgSearchParams.scoreType === '质控条件'){
      this.valueName = dataSourceName;
    }else {
      this.contentQuality.dataSources = [dataSourceName];
    }
    this.displayDataSourceMsgDialog = false;
  }

  searchDataSourcePaginate(event) {
    if ((event.page + 1) !== this.dlgSearchParams.page['currentPage'] || this.dlgSearchParams.page['currentPage'] === 1) {
      this.dlgSearchParams.page['currentPage'] = event.page + 1;
      this.getDataSources();
    }
  }

  changeContentQualityTemplates(){
    this.contentQuality.dataSources = [];
  }

  /**
   * 一致性类型模板更新时，清除对应数据元值
   */
  changeConsistencyTemplates() {
    this.consistency.datasourceName = '';
  }

  delete(status){
    let selectedRows = this.selectedRules;
    if (selectedRows == undefined || selectedRows.length <= 0) {
      this.growlMessageService.showWarningInfo("请至少选择一条质控规则");
      return;
    }
    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除质控规则？',
      accept: () => {
        this.update(status);
      }
    });
  }
  update(status) {
    let selectedRows = this.selectedRules;
    if (selectedRows == undefined || selectedRows.length <= 0) {
      this.growlMessageService.showWarningInfo("请至少选择一条质控规则");
      return;
    }
    let objectIds = [];
    for (let row of selectedRows) {
      objectIds.push(row['_id']);
    }
    let updateInfo = {
      ids: objectIds,
      status: status
    };
    this.loadingService.loading(true);
    this.scoreService.updateScoreCriteriaStatus(updateInfo).subscribe(
      apiResult => {
        if (apiResult.code == 10000) {
          this.growlMessageService.showSuccessInfo(apiResult.data);
          this.selectedRules = [];
          this.search();
        }
        this.loadingService.loading(false);
      },
      error => {
        this.growlMessageService.showWarningInfo("网络异常，请稍后重试。");
        this.loadingService.loading(false);
      }
    );
  }

  /**
   * 获取事件类型数据
   */
  initEventTypeList() {
    this.eventTypeList = [
        {label: '入院', value: '入院'},
        {label: '24小时内入出院', value: '24小时内入出院'},
        {label: '24小时内入院死亡', value: '24小时内入院死亡'},
        {label: '抢救', value: '抢救'},
        {label: '交班', value: '交班'},
        {label: '转出', value: '转出'},
        {label: '转入', value: '转入'},
        {label: '手术', value: '手术'},
        {label: '出院', value: '出院'},
        {label: '死亡', value: '死亡'},
        {label: '普通会诊', value: '普通会诊'},
        {label: '急会诊', value: '急会诊'},
    ];
  }

  /**
   * 显示时限质控新增或编辑弹框
   */
  showTimeLimitDialog() {
    this.resetValueLimit();
    this.timeLimitHeader = '新建时限质控';
    this.showTimeLimitFlag = true;
  }

  /**
   * 确认保存更新时限控制
   */
  confirmTimeLimitDialog() {
    if (!this.selectedTemplate) {
      this.growlMessageService.showWarningInfo('请选择病历！再保存');
      return;
    }
    if (!this.deadLine.event) {
      this.growlMessageService.showWarningInfo('请选择事件类型！再保存');
      return;
    }
    if (!this.deadLine.conditions) {
      this.growlMessageService.showWarningInfo('请选择事件发生时限限制！再保存');
      return;
    }
    if (!this.deadLine.timeValue) {
      this.growlMessageService.showWarningInfo('请填写大于0的事件时间限制！');
      return;
    }
    if (this.deadLine.isCycle && !this.deadLine.frequency) {
      this.growlMessageService.showWarningInfo('请填写大于0周期频次！');
      return;
    }
    if (this.deadLine.isCycle && !this.deadLine.frequercyTime) {
      this.growlMessageService.showWarningInfo('请填写大于0周期频次时间！');
      return;
    }
    if (!this.contentQuality.ruleDescription) {
      this.growlMessageService.showWarningInfo('请填写评分标准，再保存');
      return;
    }
    if (this.contentQuality.createScoreCriteria && !this.contentQuality.score.value) {
      this.growlMessageService.showWarningInfo('扣分值必须是大于0的数!');
      return;
    }
    let msg = this.checkValueLimit();
    if(msg){
      this.growlMessageService.showWarningInfo(msg);
      return;
    }
    this.deadLine.frequency +='';
    this.deadLine.frequercyTime +='';
    this.deadLine.timeValue +='';
    this.contentQuality.score.value +='';
    this.contentQuality.rule = this.deadLine;
    this.contentQuality.ruleType = '时限质控';
    this.contentQuality.autoOrHand = '自动评分';
    if(this.emrType){
      this.contentQuality.type = this.emrType;
    }
    if(this.valueName){
      this.contentQuality.valueLimit = {type:this.valueType,name:this.valueName,value1:this.value1,value2:this.value2,containMin:this.containMin,containMax:this.containMax};
    }
    this.saveScoreCriteria(() => {
      this.showTimeLimitFlag = false;
    });
  }

  /**
   * 显示手动评分新增或编辑弹框
   */
  showManualScoreDialog() {
    this.manualScoreHeader = '新建手动质控';
    this.showManualScoreFlag = true;
  }

  /**
   * 确认保存更新手动评分规则
   */
  confirmManualScoreDialog() {
    if (!this.selectedTemplate) {
      this.growlMessageService.showWarningInfo('请选择病历！再保存');
      return;
    }
    if (!this.contentQuality.ruleDescription) {
      this.growlMessageService.showWarningInfo('请填写评分标准，再保存');
      return;
    }
    if (!parseFloat(this.contentQuality.score.value)) {
      this.growlMessageService.showWarningInfo('扣分值必须是大于0的数!');
      return;
    }
    this.contentQuality.score.value +='';
    this.contentQuality.ruleType = '手动质控';
    this.contentQuality.autoOrHand = '手动评分';
    this.saveScoreCriteria(() => {
      this.showManualScoreFlag = false;
    });
  }

  /**
   * 清除质控内容对象
   */
  clearContentQulity() {
    this.contentQuality = new ContentQuality();
    this.deadLine = new DeadLine();
    this.selectedTemplate = '';
  }

  vertifyNumber(evt: any, type: string) {
    let value = evt.target.value ? evt.target.value.toString() : '';
    value = (value.length === 1) ? value.replace(/[^0-9]/g, '') : value.replace(/\D/g, '').replace(/\./g, '');
    evt.target.value = value;
    switch (type) {
      case 'frequency':
        this.deadLine.frequency = value;
        break;
      case 'timeValue':
        this.deadLine.timeValue = value;
        break;
      case 'frequercyTime':
        this.deadLine.frequercyTime = value;
        break;
      case 'minLength':
        this.completeness.minLength = value;
        break;
      case 'maxLength':
        this.completeness.maxLength = value;
        break;
    }
  }

  /**
   *
   * @param data 执行编辑操作
   */
  doEditOrViewRule(data: any, editType: string) {
    let content = (editType === '查看') ? data.data : data;
    content = Object.assign({}, content);
    this.structureNewcontentQuality(content || new ContentQuality());
    const ruleType = content.ruleType;
    this.resetValueLimit();
    this.emrType = data.type ||'';
    if(content.valueLimit){
      this.valueType = content.valueLimit.type || 'reg';
      this.valueName = content.valueLimit.name || '';
      this.accValueType = content.valueLimit.accValueType || '';
      this.value1 = content.valueLimit.value1 == '0'?'0': (content.valueLimit.value1|| '');
      this.value2 = content.valueLimit.value2 == '0'?'0': (content.valueLimit.value2|| '');
      this.containMin = content.valueLimit.containMin == '0'?'0': (content.valueLimit.containMin|| '');
      this.containMax = content.valueLimit.containMax == '0'?'0': (content.valueLimit.containMax|| '');
      this.rangeValue = content.valueLimit.rangeValue == '2'?'2' : (content.valueLimit.rangeValue|| '');
      if(this.valueType == 'reg'){
        this.regType = content.valueLimit.regType;
      }
    }
    switch (ruleType) {
      case '手动质控':
        this.manualScoreHeader = editType + '手动质控';
        this.showManualScoreFlag = true;
        break;
      case '内容质控':
        this.contentQualityHeader = editType + '内容质控';
        if (content.scoreType === '完整性') {
          this.completeness = Object.assign({}, content.rule);
        }else {
          this.consistency = Object.assign({}, content.rule);
        }
        this.childScore.createScoreCriteria = content.createScoreCriteria;
        this.childScore.score = Object.assign({}, content.score);
        this.setCompletenessLimit(this.completeness);
        this.isShowContentQualityDialog = true;
        if(this.valueType == 'range'){
          this.isCompareTime = true;
        }
        break;
      case '时限质控':
        this.timeLimitHeader = editType + '时限质控';
        this.deadLine = Object.assign({}, content.rule);
        this.showTimeLimitFlag = true;
        break;
    }
  }

  /**
   * 构造编辑的新数据对象
   */
  structureNewcontentQuality(data: any) {
    this.contentQuality._id = data._id;
    this.contentQuality.areaCode = data.areaCode;
    this.contentQuality.autoOrHand = data.autoOrHand;
    this.contentQuality.createScoreCriteria = data.createScoreCriteria;
    this.contentQuality.dataSources = [data.dataSourceName];
    this.contentQuality.rule = {};
    this.contentQuality.ruleDescription = data.ruleDescription;
    this.contentQuality.ruleType = data.ruleType;
    this.contentQuality.score = Object.assign({}, data.score);
    this.contentQuality.scoreType = data.scoreType;
    this.selectedTemplate = data.templateName;
    this.contentQuality.医院编码 = data.医院编码;
    this.contentQuality.院区编码 = data.院区编码;
    this.contentQuality.code = data.code;
  }

  /**
   * 保存评分标准数据
   */
  saveScoreCriteria(callback: Function) {
    this.contentQuality.areaCode = this.currentAreaCode;
    this.contentQuality.院区编码 = this.hosAreaCode;
    this.contentQuality.医院编码 = this.currentHosCode;
    this.contentQuality.templates = [this.selectedTemplate];
    this.scoreService.saveOrUpdateScoreCriteria(this.contentQuality).then(
      data => {
        if (data.code == 10000) {
          this.growlMessageService.showSuccessInfo(data.msg || '保存成功');
          this.search();
          if (callback) {
            callback();
          }
        }else {
          this.growlMessageService.showErrorInfo('', data.msg || '保存失败');
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

  /**
   * 更新是否显示周期
   */
  updateIsCycle(flag: Boolean) {
    if (flag) {
      this.deadLine.frequency = '1';
      this.deadLine.frequercyTime = '1';
      this.deadLine.frequencyUnit = '小时';
    }else {
      this.deadLine.frequency = '';
      this.deadLine.frequercyTime = '';
      this.deadLine.frequencyUnit = '';
    }
  }

/**
 * 更新是否创建评分标准时，同时更新里面的字段值
 * @param flag
 */
  updateScoreCriteria(flag: Boolean) {
    this.contentQuality.score.singleReject = false;
    this.contentQuality.score.value = '';
    this.contentQuality.score.rejectLevel = '';
    if (flag) {
      this.contentQuality.score.markType = '单次扣分';
    }else {
      this.contentQuality.score.markType = '';
    }
  }

  /**
   * 更新创建评分标准里面的是否单次否决
   * @param flag
   */
  updateSingleReject(flag: Boolean) {
    if (flag) {
      this.contentQuality.score.rejectLevel = '丙级';
    }else {
      this.contentQuality.score.rejectLevel = '';
    }
  }
  showScoreReportListFlag = false;
  // 扣分的病历
  scoreReportList = [
    {'目录':'入院记录','病历':'所有病历'},
    {'目录':'知情同意书','病历':'所有病历'},
    {'目录':'病案首页','病历':'病案首页、中医病案首页、住院病案首页'},
    {'目录':'首次病程记录','病历':'首次病程记录'},
    {'目录':'查房记录','病历':'上级医师首次查房记录、上级医师查房记录、上级医师日常查房记录'},
    {'目录':'一般病程记录','病历':'病重（病危）患者护理记录单、阶段小结、转科记录、交（接）班记录、抢救记录、疑难病历讨论记录、会诊记录、有创诊疗操作记录、有创诊疗操作记录、日常病程记录'},
    {'目录':'围手术期记录','病历':'麻醉术后访视记录、术后首次病程记录、手术清点记录单、手术安全核查记录、手术记录、麻醉记录单、麻醉术前访视记录、术前讨论记录、术前小结'},
    {'目录':'出院相关记录','病历':'出院记录、死亡记录、死亡病例讨论记录'}
  ];
  showScoreReportList(){
    this.showScoreReportListFlag = true;
  }
  resetValueLimit(){
    this.valueType = 'reg';
    this.regType = 'reg-c';
    this.valueName = '';
    this.accValueType = '';
    this.value1 = '';
    this.value2 = '';
    this.emrType = '';
    this.containMin = '0';
    this.containMax = '0';
  }
  clearValueLimit() {
    this.value2 = '';
    this.value1 = '';
    this.accValueType = '';
    this.valueName = '';
    if(this.valueType == 'range'){
      this.isCompareTime = true;
    }else{
      this.isCompareTime = false;
    }
  }
  checkValueLimit(){
    let _msg = {'reg-c':'包含值','reg-s':'以值开头','reg-e':'以值结尾','reg-b':'以值1开头以值2结尾'};
    let type = this.valueType;
    let msg = '';
    switch(type) {
      case 'reg':
        if(this.regType == 'reg-b'){
          // 全部有值、全部无值
          let allFlag = this.valueName && this.checkVal(this.value1) && this.checkVal(this.value2);
          let notAllFlag = !this.valueName && !this.checkVal(this.value1) && !this.checkVal(this.value2);

          if(!(allFlag || notAllFlag)){
            msg = '请填写数据源及值1和值2';
          }
        }else{
        if (this.valueName && !this.value1) {
          msg = `请填写${_msg[this.regType]}的选项类型值！`;
        }else if (!this.valueName && this.value1) {
          msg = `请选择${_msg[this.regType]}条件对应的选项类型！`;
        }
      }
        break;
      case 'limit':
        if (this.valueName && !this.value1 && !this.value2) {
          msg = '请填写值域范围对应的选项类型值！';
        }else if (!this.valueName && (this.value1 || this.value2)) {
          msg = '请选择值域范围对应的选项类型！';
        }
        break;
      case 'acc':
        if (this.isShowContentQualityDialog) {
          if (this.valueName && !this.accValueType) {
            msg = '请选择精确匹配对应数据元值类型！';
          }else if (!this.valueName && this.accValueType) {
            msg = '请选择精确匹配对应数据元！';
          }else if (this.valueName && this.accValueType == '固定值' && !this.value1) {
            msg = '请填写精确匹配对应数据元具体值！';
          }
        }else {
          if (this.valueName && !this.value1) {
            msg = '请填写模糊匹配的基本信息的值！';
          }else if (!this.valueName && this.value1) {
            msg = '请选择模糊匹配条件对应的基本信息！';
          }
        }
        break;
    }
    return msg;
  }
  checkVal(v){
    return v == '0' || v;
  }

  showLimitDataSourceMsgDialog(event) {
      if (!this.selectedTemplate) {
        this.growlMessageService.showWarningInfo('请先选择病历模版！');
        return;
      }
    event.target.blur();
    this.getDataSources();
    setTimeout(() => {
      this.displayDataSourceMsgDialog = true;
    }, 0);
  }


}
