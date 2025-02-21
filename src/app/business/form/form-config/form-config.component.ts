import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {
    TreeNode,
    TreetableWidgetModule,
    DatatableWidgetModule,
    TreeWidgetModule,
    FormWidgetsModule
} from 'portalface/widgets';
import {ReportWidget, Report, AssReport} from './form-config.interface';
import {FormConfigServices} from './form-config.services';
import {KyeeUtils} from 'portalface/utils/kyee-utils';
import {ConfirmationService} from 'portalface/widgets';
// import { DeploymentConfig } from '../../config/deployment-config';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { LoadingService } from 'portalface/services';
import { SysParamService } from '../../sys-param/sys-param.service';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
import { PublicCommService } from '../../../common/service/public-comm.service';


@Component({
    selector: 'kyee-form-config',
    templateUrl: './form-config.component.html',
    styleUrls: ['./form-config.component.scss'],
    providers: [FormConfigServices]
})
export class FormConfigComponent implements OnInit {
    hospitalCode: string; // 当前选中医院编码
    hosAreaCode: string; // 当前选中区域编码
    hosNodeCode: string; // 当前选中院区编码
    widgets: any = [];
    widgetsStateOptions: any = []; // 控件状态
    defaultTypeOptions: any = [];
    emptyOptions: any = []; // 可为空下拉列表
    widgetsTypeOptions: any = [];// 控件类型下拉选项
    widgetsfilter: TreeNode[] = []; // 表单配置项列表
    assWidgets: any[]; // 风险类表单明细记录
    reports: Report[] = []; // 护理类记录列表
    assReports: AssReport[] = []; // 风险评估类表单表
    selectedReport: TreeNode;
    reportsTree: TreeNode[] = [];
    showConfigTable: boolean; // 是否显示配置详细列表
    rptType: string; // 表单类型
    rptTitle: string; // 表单窗口标题
    rptDialog: Report; // 表单记录
    assRptDialog: AssReport; // 风险类表单记录
    rptDetailDialog: ReportWidget; // 表单明细弹出框数据集
    assRptDetailDlg: any; // 风险类表单明细弹出框
    displayRptDialog: boolean; // 是否显示表单窗口
    menuCom: any[]; // 菜单列表下拉框
    selectedRow: any; //
    dictArr: any[]; // 字典下拉框
    contextMenuItems: any[]; // 右键菜单数据集
    isShowComboxDialog: boolean; // 是否显示下拉框数据弹出框
    isshowpreview: boolean; // 是否显示预览弹出框
    dialogHeader: any[] = ['', '']; // 模态框标题
    comData: any[] = []; // 下拉框配置数据集
    yesNo: any[];
    yesnoObj: any;
    height: any[];
    selectComdata: any; // 选中的下拉框数据集
    isUseArr: any[]; // Y,N是否选项
    isUseArr1: any[];
    noteTypeArr: any[]; // 组件部分类型
    deploymentData: any;
    reportInfo: any = {
        reportName: '',
        reportId: '',
        reportType: '',
        reportVersion: '',
        reportCode: ''
    };
    // curReportName: string; //  用于表单预览
    // curReportId: any; //  用于表单预览
    // curReportType: string; //  用于表单预览
    // curReportCode: number; //  用于表单预览
    // curVersion: string; // 当前版本
    newVersion: string; // 新输入的版本号
    curTemplateCode: string; // 当前表单编号
    displayCopyDialog: boolean; // 显示复制窗口
    displayMeasureDialog: boolean; // 显示措施维护窗口
    hasHospitalRole: boolean; // 是否有操作当前医院的权限
    riskwidget = { // 新增评估配置表单 表单预览
        first: [],
    };
    isCanEdit: boolean;
    // isyulan: any;
    styleWatchTimer: any;
    // @ViewChild('dia') dia: ElementRef;
    cols = [];
    frozenCols = [];
    uploadUrl = '';
    // uploadUrl = DeploymentConfig.SERVER_URL + 'SystemManagement/Norm/FormConfig?Msg=UploadData';
    reportCount: any[] = [];
    AddSection: any; // 增加分段对话框
    curReportSection: any; // 当前表单分段
    sectionList: any = []; // 分段下拉框
    sectionListSub: any = []; // 去掉‘全部’选项的下拉框
    // chooseSection: any; // 选择的分段
    sectionName: any; //  分段名称
    sectionSort: any; // 分段排序
    EditSection: any; // 编辑分段
    selectedSection: any; // 选择的分段
    REPORT_TYPE: any ; // 分段的表单类型
    commonSource: any = false;
    // widgetSaveToDb: any = false;
    bigField: any = false;
    hospitalName: string; // 医院名称
    dictList: any[]= [] ; // 同源体征控件名下拉框
    curHosUser: any = false; // 是否是当前医院的用户（控制无法修改其他医院表单）
    isSysAdmin: boolean; // 是否是区域管理员
    currentUserInfo: CurrentUserInfo;
    filterHospitalName: String = '';
    areasAndHospitals: TreeNode[] = [];
    selectedNode: TreeNode;
    showDataTable: Boolean = false;
    configItemsSelectedData : any = [];
    constructor(private formConfigServices: FormConfigServices,
                public element: ElementRef,
                private confirmationService: ConfirmationService,
                private authTokenService: AuthTokenService,
                private loadingService: LoadingService,
                private sysParamService: SysParamService,
                private growlMessageService: GrowlMessageService,
                private publicCommService: PublicCommService) {
        this.formConfigServices.param = this;
        this.widgetsTypeOptions = [
            {'label': '复选框', 'value': 'CheckBox'},
            {'label': '文本框', 'value': 'EditText'},
            {'label': '文本框(只读)', 'value': 'TextView'},
            {'label': '下拉框', 'value': 'Spinner'},
            {'label': '可选可输', 'value': 'ComboBox'},
            {'label': '多选可输', 'value': 'MultiComBox'},
            {'label': '多选不可输', 'value': 'MultiComBoxNoInPut'},
            {'label': '时间', 'value': 'time'},
            {'label': '日期', 'value': 'Date'},
            {'label': '日期时间', 'value': 'datetime'},
            {'label': '按钮', 'value': 'Button'},
            {'label': '链接', 'value': 'skipCtrl'},
            {'label': '单选', 'value': 'RadioButton'},
            {'label': '自定义', 'value': 'custom'}
        ];
        this.emptyOptions = [
            {'label': '是','value': '1'},
            {'label': '否','value': '0'}
        ];
        this.defaultTypeOptions = [
            {'label': '请选择默认值','value': ' '},
            {'label': '护士ID','value': '护士ID'},
            {'label': '护士姓名','value': '签名'},
            {'label': '科室名称','value': '科室'},
            {'label': '病人姓名','value': '姓名'},
            {'label': '住院号','value': '住院号'},
            {'label': '病人年龄','value': '年龄'},
            {'label': '病人性别','value': '性别'},
            {'label': '地址','value': '地址'},
            {'label': '电话','value': '电话'},
            {'label': '护理级别','value': '护理级别'},
            {'label': '入院诊断','value': '入院诊断'},
            {'label': '入院时间','value': '入院时间'},
            {'label': '床号','value': '床号'},
            {'label': '入科时间','value': '入科时间'}
        ];
        this.widgetsStateOptions = [
            {'label': '可用','value': '0'},
            {'label': '不可编辑','value': '1'},
            {'label': '隐藏','value': '4'}
        ];
    }

    ngOnInit() {
        this.displayRptDialog = false;
        this.showConfigTable = false;
        this.displayCopyDialog = false;
        this.displayMeasureDialog = false;
        this.hospitalCode = null;
        this.isUseArr1 = [
            {label: '分值大等级高', value: 'Y'},
            {label: '分值小等级高', value: 'N'}];
        this.yesNo = [
            {label: '是', value: '1'},
            {label: '否', value: '0'}
        ];
        this.isUseArr = [
            {label: '是', value: 'Y'},
            {label: '否', value: 'N'}];
        this.yesnoObj = {
            '0': '否',
            '1': '是'
        };
        // this.noteTypeArr = [
        //     {label: '表格', value: '1'},
        //     {label: '表单', value: '2'}];

        this.currentUserInfo = this.sysParamService.getCurUser();
    if (!this.sysParamService.isAreaUser(this.currentUserInfo)) {
            this.isSysAdmin = false;
            this.hospitalCode = this.currentUserInfo['hosNum'];
            this.hosAreaCode = this.currentUserInfo['nodeCode'];
            this.hospitalName = this.currentUserInfo['hosName'];
            this.hosNodeCode = this.currentUserInfo['nodeCode'];
            let formInfo = this.getFormList()[0];
            this.reportInfo.reportName = formInfo.label;
            this.reportInfo.reportId = formInfo['data']['表单ID'];
            this.reportInfo.reportType = '1' ; // reportData.表单类型;
            this.curTemplateCode = formInfo['data']['表单版本']; // 当前表单的编号
            this.reportInfo.reportVersion = formInfo['data']['表单版本']; // 当前表单的版本信息
            this.loadReportDetailList();

        }else {
            this.isSysAdmin = true;
            this.getAreasAndHospitalsList();
        }

        // this.dealDictItemData();
        this.height = this.publicCommService.calcTableBodyHeight([true], [false], [20]);
        this.deploymentData = {
            childrenItems: {},
            hasDefaultWidgetsObj: {},
            tableTitle: [],
            maxLayer: 0
        };
        // this.chooseSection = 'all'; // 默认全部分段
         // 查询getDictInfoGrid字典中配置的同源项目
        // 查询字典数据
        // this.getNormalDict();
    }

    // dealDictItemData() {
    //     let data = [];
    //     let dictItemArr = [];
    //     let dictIdArr = ["100017","100018","100019","100020","100021","100022","100024","100026"];
    //     for (let i = 0; i < dictIdArr.length; i++) {
    //         let arr = [];
    //         data.forEach(item => {
    //             arr.push({label: item.itemName, value: item.itemCode, remark: item.备注});
    //         })
    //         dictItemArr.push(arr);
    //     }
    //     this.getCommonDictData(dictItemArr);
    // }

    // getNormalDict() {
    //         let data = [{
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120000.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "TW",
    //             "ITEM_NAME" : "体温",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 1.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:26",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : null
    //         }, {
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120001.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "MB",
    //             "ITEM_NAME" : "脉搏",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 2.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:26",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : null
    //         }, {
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120002.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "HX",
    //             "ITEM_NAME" : "呼吸",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 3.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:26",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : null
    //         }, {
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120003.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "XL",
    //             "ITEM_NAME" : "心率",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 4.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:26",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : null
    //         }, {
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120004.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "ZRL",
    //             "ITEM_NAME" : "总入量",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 5.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:26",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : "24h总入量"
    //         }, {
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120006.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "DBCS",
    //             "ITEM_NAME" : "大便次数",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 6.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:27",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : "24h总出量"
    //         }, {
    //             "SYS_FLAG" : null,
    //             "HOSNUM" : "KYEESYSCLOUD",
    //             "ITEM_ID" : 120005.0,
    //             "DICT_ID" : 34.0,
    //             "DICT_CODE" : "100034",
    //             "ITEM_CODE" : "ZCL",
    //             "ITEM_NAME" : "总出量",
    //             "P_ITEM_ID" : 0.0,
    //             "FLAG" : "S",
    //             "FLAG_TEXT" : "系统",
    //             "SORT" : 6.0,
    //             "CREATER" : "01",
    //             "CREATE_TIME" : "2019-05-05 17:04:27",
    //             "UPDATER" : null,
    //             "UPDATE_TIME" : null,
    //             "IS_USE" : "1",
    //             "IS_USE_TEXT" : "是",
    //             "REMARK" : "24h总出量"
    //         }
    //     ];
    //     for ( let i = 0 ; i < data.length; i++) {
    //         this.dictList.push({value: data[i].ITEM_CODE, label: data[i].ITEM_CODE });
    //     }
    // }

    getAreasAndHospitalsList(){
        this.loadingService.loading(true);
        this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
          apiResult => {
            if(apiResult.code == 10000 && apiResult.data) {
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

      updateHospitalInfo() {
        if (this.reportsTree && this.reportsTree.length > 0) {
          this.selectedReport = this.reportsTree[0].children[0].children ? (this.reportsTree[0].children[0].children[0] || {}) : {};
          this.reportsTree[0].children[0].expanded = true;
          this.selectedReport.parent = this.reportsTree[0].children[0];
          this.reportSelect();
        }
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
              let childrens = [];
              for (let hospital of hospitals){
                hospital['label'] = hospital['医院名称'];
                hospital['data'] = hospital;
                hospital['院区编码'] = hospital['院区编码'];
                // let depts = hospital['科室列表'];
                // if(depts.length > 0){
                //   for(let dept of depts){
                //     dept['label'] = dept['科室名称'];
                //     dept['data'] = dept['科室ID'];
                //   }
                // }
                hospital['children'] = this.getFormList();
              }
              area['children'] = hospitals;
            }
        }
        return interfaceResult;
      }

      selectNode() {
        if (this.selectedNode &&  this.selectedNode['parent'] == undefined && this.selectedNode['医院名称'] == null) {
          this.growlMessageService.showWarningInfo('请选择医院或科室');
          this.showDataTable = false;
          return;
        }else {
        }
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

    /**
     * 获取表单树成功回调
     * @param data
     */
    public getReportTreeSuccess(data) {
        this.reportsTree = data;
        this.hospitalCode = this.reportsTree[0].data;
        this.selectedReport = this.reportsTree[0];
        this.getReportCount();
    }

    /**
     * 公共方法回调函数
     * @param {any[]} dictArr
     */
    // public getCommonDictData(dictArr: any[]) {
    //     this.dictArr = dictArr;
    //     this.dictArr[3].unshift({value: ' ', label: '请选择默认值'});
    //     this.dictArr[5].unshift({value: ' ', label: '请选择默认值'});
    // }

    /**
     * 隐藏表单修改框
     */
    public doCancel() {
        this.displayRptDialog = false;
        this.rptDialog = null;
        this.assRptDialog = null;
        this.assRptDetailDlg = null;
        this.rptDetailDialog = null;
        this.displayCopyDialog = false;
        this.AddSection = false;
    }

    /**
     * 编辑数据界面
     */
    public doEdit() {
        this.isCanEdit = true;
        if (KyeeUtils.isEmpty(this.selectedRow)) {
            this.growlMessageService.showDefaultInfo('请选择要修改的记录！');
            return;
        }
        if (this.showConfigTable) {
            this.rptDetailDialog = JSON.parse(JSON.stringify(this.selectedRow.data));
            if(this.selectedRow.data.是否大文本字段 && this.selectedRow.data.是否大文本字段 == true){
                this.bigField = true;
            }
            else {
                this.bigField = false;
            }
            if(this.selectedRow.data.是否同源 && this.selectedRow.data.是否同源 == true){
                this.commonSource = true;
            }
            else {
                this.commonSource = false;
            }
            // if(this.selectedRow.data.widgetSaveToDb && this.selectedRow.data.widgetSaveToDb == true){
            //     this.widgetSaveToDb = true;
            // } else {
            //     this.widgetSaveToDb = false;
            // }
            this.rptTitle = '编辑护理类表单项目';
        } else {
            this.rptDialog = JSON.parse(JSON.stringify(this.selectedRow));
            this.rptTitle = '编辑护理类表单';
        }
        this.displayRptDialog = true;

    }

    /**
     * 删除按钮点击，区分删除表单和控件使用不通的services
     */
    deleteClick() {
        if (KyeeUtils.isEmpty(this.selectedRow)) {
            this.growlMessageService.showWarningInfo( '请选择需要删除的记录！');
            return;
        }
        this.confirmationService.confirm({
            message: '确定删除当前记录?',
            header: '提示',
            icon: 'fa fa-trash',
            accept: () => {
                // 删除记录
                this.deleteReport();
            },
            reject: () => {
                this.growlMessageService.showDefaultInfo( '取消删除！');
            }
        });
    }

    deleteReport() {
        let recrd_id = null;
        if (this.showConfigTable) {
            recrd_id = this.selectedRow.data._id;
        }
        this.formConfigServices.deleteReport(recrd_id).then(data => {
            if (data.code == 10000) {
                this.growlMessageService.showSuccessInfo('删除成功！');
                if (!this.showConfigTable) {
                    this.getReportInfo();
                    // this.getReportTree();
                }else {
                    this.getReportDetail();
                }
                this.selectedRow = null;
            }else {
                // 判断如果已经存在子记录时，提示不能删除！
                if ( data.msg.indexOf('子表有记录') !== -1) {
                    this.growlMessageService.showWarningInfo('当前记录已经使用，不允许删除！');
                } else {
                    this.growlMessageService.showDefaultInfo( data.msg);
                }
            }
        });
    }

    /**
     *  点击新增按钮，根据是否选中表单区分弹出添加表单对
     *   话框或者某个表单项目相关对话框
     */
    public addClick() {
        this.isCanEdit = false;
        this.displayRptDialog = true;
        this.commonSource = false;
        this.bigField = false;
        // this.widgetSaveToDb = false;
        if (!this.showConfigTable) {
            let newReport: Report = {
                表单ID: -1,
                // SYS_FLAG: this.publicCommService.getStorageCache('sysFlag'),
                医院编码: this.hospitalCode};
            this.rptTitle = '新增护理类表单';
            this.rptDialog = newReport;
        } else {
            // let newReportWidget = new ReportWidget({
            //     表单ID: this.selectedReport.data.表单ID,
            //     表单名称: this.selectedReport.data.表单名称,
            //     表单版本: this.selectedReport.data.表单版本,
            //     父控件ID: -1,
            //     医院编码: this.hospitalCode,
            //     // note: '1',
            //     所属部分: '2',
            //     bigField: '0' // 默认非clob字段
            // });
            let newReportWidget: ReportWidget = {
                _id: '',
                表单ID: this.reportInfo.reportId,
                表单名称: this.reportInfo.reportName,
                表单版本: this.reportInfo.reportVersion,
                父控件ID: '',
                医院编码: this.hospitalCode,
                // note: '1',
                所属部分: '2',
                是否大文本字段: '0' // 默认非clob字段
            };
            this.rptTitle = '新增护理类表单项目';
            this.rptDetailDialog = newReportWidget;
            // this.rptDetailDialog.note = this.chooseSection; // 新增时默认为外部下拉框中选择的段
        }
    }

    /**
     * 添加表单项目子节点
     */
    private addChildItem() {
        this.isCanEdit = false;
        let newReportWidget: ReportWidget = {
            _id: '',
            表单ID: this.reportInfo.reportId,
            父控件ID: this.rptDetailDialog._id,
            // SYS_FLAG: this.publicCommService.getStorageCache('sysFlag'),
            医院编码: this.hospitalCode,
            是否大文本字段: '0' // 默认非clob字段
        };
        this.rptTitle = '新增护理类表单子项目';
        this.rptDetailDialog = newReportWidget;
        this.displayRptDialog = true;
    }

    /**
     * 复制当前选中表单表当前医院中
     */
    public doCopy() {
        // 如果当前选中的是具体某个表单的节点
        if (!this.showConfigTable) {
            // 判断点击表单类型节点时，是否选中要复制的记录
            if (KyeeUtils.isEmpty(this.selectedRow)) {
                this.growlMessageService.showDefaultInfo( '请选择要复制的记录！');
                return;
            }
            this.reportInfo.reportId = this.selectedRow.表单ID;
            this.reportInfo.reportName = this.selectedRow.REPORT_NAME;
            this.reportInfo.reportVersion = this.selectedRow.VERSION_CODE;
            this.curTemplateCode = this.selectedRow.TEMPLATE_CODE;
        }
        this.newVersion = '';
        this.rptTitle = '复制表单';
        this.displayCopyDialog = true;
    }

    /**
     * 确认复制
     */
    public confirmCopy() {
        // 首先验证当前版本是否存在
        this.formConfigServices.verifyReportExist(this).then(data => {
            if (data.code == 10000) {
                if (data.data) {
                    // 复制记录
                    this.formConfigServices.copyReport(this, this.currentUserInfo.userId).then(res => {
                        if (res.code == 10000) {
                            // 复制成功后回调
                            // this.formConfigServices.getReportTree(this);
                            this.displayCopyDialog = false;
                            this.growlMessageService.showSuccessInfo('复制表单成功！');
                        }else {
                            this.growlMessageService.showErrorInfo('', data.msg);
                        }
                    });
                }else {
                    this.growlMessageService.showWarningInfo('当前版本已存在,请重新输入版本号！');
                }
            }else {
                this.growlMessageService.showErrorInfo('', data.msg);
            }
        });
        // this.formConfigServices.verifyReportExist(this, (flag) => {
        //     if (flag) {
        //         // 复制记录
        //         this.formConfigServices.copyReport(this,  (data) => {
        //             // 复制成功后回调
        //             this.formConfigServices.getReportTree(this);
        //             this.displayCopyDialog = false;
        //         });
        //     }else {
        //         this.publicCommService.showMsg('info', '提示', '当前版本已存在,请重新输入版本号！');
        //     }
        // });
    }

    /**
     * 点击右键菜单，显示下拉框数据源界面，根据记录数据处理相关下拉记录列表
     */
    private showComboxEditDlg() {
        this.rptTitle = '下拉框数据';
        this.dialogHeader = ['显示值', '隐藏值'];
        this.comData = [];
        // let showValues = this.rptDetailDialog.textPda;
        // let hideValues = this.rptDetailDialog.valuePda;
        let showArr = [];
        let hideArr = [];
        // if (KyeeUtils.isNotEmpty(showValues)) {
        //     showArr = showValues.split('$');
        // } else {
        //     showArr = [];
        // }
        // if (KyeeUtils.isNotEmpty(hideValues)) {
        //     hideArr = hideValues.split('$');
        // } else {
        //     hideArr = [];
        // }

        // 将对应字符串拆分并绑定到弹出框列表中
        for (let i = 0; i < showArr.length; i++) {
            this.comData.push({index: i, showValue: showArr[i], hideValue: hideArr[i]});
        }
        this.isShowComboxDialog = true;
    }

    /**
     * 点击右键菜单，显示约束项界面
     */
    public showBoundEditDlg() {
        this.rptTitle = '约束项数据';
        this.dialogHeader = ['组件名称', '是否显示'];
        this.comData = [];
        let showValues = this.rptDetailDialog.约束项;
        let hideValues = this.rptDetailDialog.约束项显示项;
        let showArr = [];
        let hideArr = [];
        if (KyeeUtils.isNotEmpty(showValues)) {
            showArr = showValues.split('$');
            hideArr = hideValues.split('$');
        } else {
            // 记录为空时，默认取同级节点下的所有控件
            if (this.selectedRow.parent) {
                // 存在父级
                for (let i of Object.keys(this.selectedRow.parent.children)) {
                    let sameLevel = this.selectedRow.parent.children[i].data;
                    if (sameLevel.wigetName === this.selectedRow.data.wigetName) {
                        continue;
                    }
                    showArr.push(sameLevel.wigetName);
                    hideArr.push('');
                }
            } else {
                // 无父级 从顶级查找
                for (let i of Object.keys(this.widgets)) {
                    let sameLevel = this.widgets[i].data;
                    if (sameLevel.wigetName === this.selectedRow.data.wigetName) {
                        continue;
                    }
                    showArr.push(sameLevel.wigetName);
                    hideArr.push(null);
                }
            }
            // showArr = [];
        }

        // 将对应字符串拆分并绑定到弹出框列表中
        for (let i = 0; i < showArr.length; i++) {
            this.comData.push({index: i, showValue: showArr[i], hideValue: hideArr[i]});
        }
        this.isShowComboxDialog = true;
    }

    /**
     * 约束项一键互斥
     */
    public setBoundOneKey() {
        for (let i of Object.keys(this.comData)) {
            this.comData[i].hideValue = 0;
        }
    }

    /**
     * 根据不同的数据加载不同的右键菜单
     * @param event
     */
    public onDetialSelect(event) {
        this.rptDetailDialog = event.node.data;
        this.contextMenuItems = [
            {label: '添加子项目', icon: 'fa-search', command: (event) => this.addChildItem()},
            {label: '修改下拉框', icon: 'fa-bars', command: (event) => this.showComboxEditDlg()}
        ];
        // 单选复选下拉框 可选可输 多选 可以配置约束项
        if (this.selectedRow.data.控件类型代码 === 'RadioButton' || this.selectedRow.data.控件类型代码 === 'CheckBox' || this.selectedRow.data.控件类型代码 === 'Spinner' ||
            this.selectedRow.data.控件类型代码 === 'ComboBox' || this.selectedRow.data.控件类型代码 === 'MultiComBox' || this.selectedRow.data.控件类型代码 === 'MultiComBoxNoInPut') {
            this.contextMenuItems.push({
                label: '修改约束项',
                icon: 'fa-adjust',
                command: (event) => this.showBoundEditDlg()
            });
        }
    }

    /**
     * 保存表单明细或者表单记录
     */
    public doSave() {
        if (!this.CheckDataValidation()) {
            this.growlMessageService.showWarningInfo('有无效的输入，请更改后再保存！');
            return;
        }
        if (!this.checkDialogData()) {
            this.growlMessageService.showWarningInfo('请将信息输入完整！');
            return;
        }
        if (this.checkRepeatName()) {
            this.growlMessageService.showWarningInfo('表单名称已存在！');
            return;
        }
        this.rptDetailDialog.控件类型名称 = this.getWidgetNameByCode(this.rptDetailDialog.控件类型代码);
        if (this.isCanEdit === true) {// 如果是修改
            this.saveReport();
        } else {  //  如果是新增，验证控件名是否重复
            let saveData = null;
            if (this.showConfigTable) { // 保存表单中的控件需要验证Tag
                saveData = this.rptDetailDialog;
                delete(saveData['_id']);
                this.formConfigServices.verifyTagName(this, saveData).then(data => {
                    if (data.code == 10000) {
                        if (data.data) {
                            this.saveReport();
                        }else {
                            this.growlMessageService.showWarningInfo('控件名有重复不允许保存！');
                        }
                    } else {
                        this.growlMessageService.showErrorInfo('', '控件名重复验证失败！');
                    }
                });
            } else { // 如果保存表单不用验证
                this.saveReport();
            }
        }
    }

    /**
     * 通过code获取控件类型名称
     */
    getWidgetNameByCode(widgetTypeCode: string) {
        let data = this.widgetsTypeOptions.filter((item: any) => {
            return item.value == widgetTypeCode;
        })[0];
        return data ? data.label : '';
    }

    /**
     *
     */
    saveReport() {
        let saveData = null;
        if  (this.showConfigTable) {
            if(this.rptDetailDialog.是否同源 == true ){
                this.rptDetailDialog.是否同源 = '1';
            }else {
                this.rptDetailDialog.是否同源 = '0';
            }
            // if(this.rptDetailDialog.widgetSaveToDb== true){
            //     this.rptDetailDialog.widgetSaveToDb = '1';
            // }else {
            //     this.rptDetailDialog.widgetSaveToDb = '0';
            // }
            if(this.rptDetailDialog.是否大文本字段== true){
                this.rptDetailDialog.是否大文本字段 = '1';
            }else {
                this.rptDetailDialog.是否大文本字段 = '0';
            }
            saveData = this.rptDetailDialog;
        }else {
            saveData = this.rptDialog;
        }
        this.formConfigServices.saveReport(saveData).then(data => {
            if (data.code == 10000) {
                this.growlMessageService.showSuccessInfo( '保存成功！');
                // 保存成功后根据保存内容刷新界面
                if (this.showConfigTable) {
                    this.getReportDetail();
                }else {
                    this.getReportInfo();
                    // this.getReportTree(pointer);
                }
                this.displayRptDialog = false;
                this.selectedRow = null;
            }else {
                this.growlMessageService.showErrorInfo('', data.msg);
            }
        });
    }

    private CheckDataValidation(): boolean {
        let invalideInput = document.getElementsByClassName('invalid');
        return invalideInput.length < 1;
    }

    /**
     * 检查弹出框的对话框数据是否合法
     * @returns {boolean}
     */
    checkDialogData(): boolean {
        let checkFlag = true;
        // 判断是否是表单明细
        if (!this.showConfigTable) {
            if (KyeeUtils.isEmpty(this.rptDialog.表单名称)
            || KyeeUtils.isEmpty(this.rptDialog.表单版本)) {
            checkFlag = false;
        }
        } else { // 表单明细
            if (KyeeUtils.isEmpty(this.rptDetailDialog.控件排序值)
                || KyeeUtils.isEmpty(this.rptDetailDialog.控件类型代码) || KyeeUtils.isEmpty(this.rptDetailDialog.控件显示名称)
                || KyeeUtils.isEmpty(this.rptDetailDialog.控件名称)|| KyeeUtils.isEmpty(this.rptDetailDialog.表单ID)) {
                checkFlag = false;
            }
        }
        return checkFlag;
    }
    /**
     * 检查表单名称是否重复
     * @returns {boolean}
     */
    checkRepeatName(): boolean {
        let checkFlag = false;
        if (!this.showConfigTable) {
            if(this.rptDialog.表单ID === -1){//新增
                for(let i=0;i<this.reports.length;i++){
                    if(this.rptDialog.表单名称 === this.reports[i].表单名称){
                        checkFlag = true;
                    }
                }
            }else{// 修改
                for(let i=0;i<this.reports.length;i++){
                    if(this.rptDialog.表单名称 === this.reports[i].表单名称
                        && this.rptDialog.表单ID !== this.reports[i].表单ID){
                        checkFlag = true;
                    }
                }
            }
        }
        return checkFlag;
    }

    /**
     * 选择左侧表单树时触发的事件处理函数
     * 当选中表单节点时，加载表单详细信息；
     * 选中医院节点时，加载医院下所有的表单
     */
    public reportSelect() {
        if(this.selectedReport && this.selectedReport['parent'] == undefined) {
            this.growlMessageService.showWarningInfo('请选择表单');
            this.showDataTable = false;
            return;
        }else {
            this.resetScrollTreeBody();
            let selectedNode = this.selectedReport;
            let hospitalInfo = this.selectedReport['parent'].data || {};
            let reportData = selectedNode.data || {};
            this.reportInfo.reportName = selectedNode.label;
            this.reportInfo.reportId = reportData.表单ID;
            // this.showConfigTable = true; // reportData.showConfigTable; // 是否显示表单明细
            this.reportInfo.reportType = '1' ;// reportData.表单类型;
            this.hospitalCode = hospitalInfo['医院编码']; // 当前节点所在的医院
            this.hosAreaCode = hospitalInfo['区域编码'];
            this.hospitalName = hospitalInfo['医院名称'];
            this.hosNodeCode = hospitalInfo['院区编码'];
            this.curTemplateCode = reportData.reportCode; // 当前表单的编号
            this.reportInfo.reportVersion = reportData['表单版本']; // 当前表单的版本信息
            // this.chooseSection = 'all';
            this.loadReportDetailList();
        }
    }

    loadReportDetailList() {
        this.showConfigTable = true;
        this.cols = [
            {field: '控件类型名称', header: '控件类型', width: '150px'},
            // {field: '控件类型代码', header: '控件类型代码'},
            {field: '控件名称', header: '控件名称', width: '150px'},
            {field: '控件显示名称', header: '控件显示名', width: '150px'},
            {field: '控件宽度', header: '宽度', width: '80px'},
            {field: '控件列宽度', header: '控件列宽度', width: '80px'},
            // {field: 'textPda', header: '显示数据', width: '200px'},
            // {field: 'valuePda', header: '隐藏数据', width: '200px'},
            {field: '约束项', header: '约束项', width: '200px'},
            {field: '控件排序值', header: '排序值', width: '100px'},
            {field: '是否可用', header: '组件状态', width: '100px'},
            // {field: 'isVisityText', header: '组件状态', width: '100px'},
            {field: '默认值', header: '控件默认值', width: '100px'},
            // {field: '是否冻结', header: '是否冻结'},
            //{field: 'IS_FREEZE_TEXT', header: '是否冻结', width: '100px'},
            // {field: 'widgetSaveToDb', header: '是否保存'},
            // {field: 'widgetSaveText', header: '是否保存', width: '100px'},
            {field: '正则表达式', header: '正则表达式', width: '150px'},
            {field: '错误信息提示', header: '错误提示信息', width: '150px'},
            // {field: 'NOTE_TEXT', header: '所属部分'},
            // {field: '所属部分', header: '所属部分', width: '100px'},
            // {field: 'NOTE_TYPE', header: '部分类型', width: '90px'},
            // {field: '所属部分类型', header: '部分类型', width: '100px'},
            // {field: 'COMMON_SOURCE', header: '是否同源'},
            {field: '是否同源', header: '是否同源', width: '80px'},
            // {field: 'BIG_FIELD', header: '是否大文本'},
            {field: '是否大文本字段', header: '是否大文本', width: '90px'},
            {field: '备注', header: '备注', width: '200px'}
        ];
        this.getReportDetail();
        // this.getReportSection(); // 获取表单分段
        this.selectedRow = null;
    }

    // getAssReportDetail() {
    //     this.formConfigServices.getAssReportDetail(this.selectedReport.data, this.hospitalCode).then(data => {
    //         if (data.code == 10000) {
    //             this.assWidgets = this.publicCommService.setWidget(this.assWidgets, data.data);
    //         }else {
    //             this.growlMessageService.showErrorInfo('提示', data.msg);
    //         }
    //     });
    // }

    getReportDetail() {
        this.loadingService.loading(true);
        this.formConfigServices.getReportDetail(this.reportInfo.reportId, this.hospitalCode).then(data => {
            this.loadingService.loading(false);
            if (data.code == 10000) {
                this.widgetsfilter = [];
                if(data.data && data.data.length > 0) {
                    // this.widgets = this.publicCommService.setWidget(this.widgets, data.data);
                    this.widgetsfilter = this.formatDetailData(data.data);
                    // this.sectionChange();
                }
            }else {
                this.growlMessageService.showErrorInfo('提示', data.msg);
            }
        });
    }

    formatDetailData(data) {
        const treeData = [];
        for(let i = 0; i < data.length; i++) {
            treeData[i] = {
                data: data[i],
                children: []
            };
        }
        return treeData;
    }

    getReportInfo() {
        this.reports = [{
            表单ID : 131977.0,
			表单名称 : "体温单",
			表单版本 : "V1.0",
			备注 : null,
			控件排序值 : 1.0,
			表单类型 : 1.0,
			表单显示名 : null,
			菜单ID : 100401.0,
			科室ID : null,
			表单查询类型 : "0",
			表单名称备注 : "内蒙四院",
			医院编码 : "NMGDSYY",
		}
	];
        // this.formConfigServices.getReportInfo(this.hospitalCode).then(data => {
        //     if (data.code == 10000) {
        //         this.reports = data.data;
        //     }else {
        //         this.growlMessageService.showErrorInfo('提示', data.msg);
        //     }
        // });
    }

    /**
     * 统计当前医院表单详情
     */
    private  getReportCount() {
        this.reportCount = [];
        let hosrpt = this.reportsTree.find(x => x.data === this.hospitalCode).children;
        this.reportCount.push({REPORT_TYPE: '护理类表单', REPORT_NUM: hosrpt.find(x => x.label === '护理类表单').children.length});
        this.reportCount.push({REPORT_TYPE: '风险评估类表单', REPORT_NUM: hosrpt.find(x => x.label === '风险评估类表单').children.length});
    }

    /**
     * 新增下拉框数据
     */
    public addComboxItem() {
        let index = 0;
        if (this.comData.length !== 0) {
            index = this.comData.length;
        }
        this.comData.push({'index': index, 'showValue': '', 'hideValue': ''});
    }

    /**
     * 移除下拉数据项
     */
    public removeComboxItem() {
        let selectRow = this.selectComdata;
        if (KyeeUtils.isNotEmpty(selectRow)) {
            let newArr = [];
            this.comData.forEach(function (item) {
                if (selectRow.index !== item.index) {
                    newArr.push(item);
                }
            });
            this.comData = newArr;
        }
    }

    /**
     * 确认下拉数据项
     */
    public confrimData() {
        let showStrs = '';
        let hideStrs = '';
        if (!this.CheckDataValidation()) {
            this.growlMessageService.showWarningInfo('有无效的输入，请更改后再保存！');
            return;
        }
        if (this.comData === undefined) {
            this.growlMessageService.showWarningInfo('没有需要保存的数据！');
            return;
        } else if (this.comData.length === 0) {
            showStrs = '';
            hideStrs = '';
        } else {
            for (let i of Object.keys(this.comData)) {
                let item = this.comData[i];
                if (KyeeUtils.isEmpty(item.showValue)) {
                    this.growlMessageService.showWarningInfo(this.dialogHeader[0] + '不能为空！');
                    return;
                }
                if (KyeeUtils.isNotEmpty(item.showValue) || KyeeUtils.isNotEmpty(item.hideValue)) {
                    // 约束项操作为空不保存
                    if (this.rptTitle === '约束项数据' && KyeeUtils.isEmpty(item.hideValue)) {
                        continue;
                    }
                    // 字符串拼接后保存
                    showStrs += item.showValue + '$';
                    hideStrs += item.hideValue + '$';
                }
            }
            if (showStrs !== '') {
                showStrs = showStrs.substr(0, showStrs.length - 1);
            }
            if (hideStrs !== '') {
                hideStrs = hideStrs.substr(0, hideStrs.length - 1);
            }
        }
        // 下拉框 OR 约束项
        let field = [];
        if (this.rptTitle === '下拉框数据') {
            field = ['textPda', 'valuePda'];
        } else if (this.rptTitle === '约束项数据') {
            field = ['约束项', '约束项显示项'];
        }

        if (this.rptDetailDialog[field[1]] === hideStrs && this.rptDetailDialog[field[0]] === showStrs) {
            this.growlMessageService.showWarningInfo( '没有需要保存的数据！');
            return;
        } else if (this.rptDetailDialog[field[1]] === null && hideStrs === '' && this.rptDetailDialog[field[0]] === null && showStrs === '') {
            this.growlMessageService.showWarningInfo('没有需要保存的数据！');
            return;
        } else {
            this.rptDetailDialog[field[1]] = hideStrs;
            this.rptDetailDialog[field[0]] = showStrs;
        }

        this.saveReport();
        this.isShowComboxDialog = false;
        this.selectComdata = null;
    }

    /**
     * 下载数据
     */
    public downloadData() {
        this.formConfigServices.downData(this).then(data => {
            if (data.code == 10000) {
                this.growlMessageService.showSuccessInfo(data.msg);
                // let downLoadUrl = DeploymentConfig.SERVER_URL + data.ResultValue;
                let downLoadUrl = '';
                let elemIF = document.createElement("iframe");
                elemIF.src = downLoadUrl;
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            }else {
                this.growlMessageService.showErrorInfo('', data.msg);
            }
        });
    }

    /*********************************************以下为表单预览逻辑 管理端业务端代码合并之后可以修改***************************************************/

    /**
     * 表单预览
     */
    public preview() {
        this.deploymentData = {
            parentItems: [],
            topItems: {},
            childrenItems: {},
            hasDefaultWidgetsObj: {},
            tableTitle: [],
            maxLayer: 0
        };
        this.isshowpreview = true;
        for (let i = 0; i < this.reports.length; i++) {
            if (this.reports[i].表单ID.toString() === this.reportInfo.reportId) {
                this.reportInfo.reportType = this.reports[i].表单查询类型;
                break;
            }
        }
        this.formConfigServices.getDeploymentData(this, this.reportInfo.reportName, this.reportInfo.reportId, 'V1.0').then(data => {
            if (data.code == 10000) {
                this.deploymentData = this.handlerDeploymentData(data.data);
            } else {
                this.growlMessageService.showErrorInfo('错误', '获取表单详情失败');
            }
        });
        // if (this. === '2') {  // 风险类
        //     for (let i = 0; i < this.assReports.length; i++)
        //         if (this.assReports[i].THEME_CODE.toString() === this.reportInfo.reportId) {
        //             this.curReportCode = this.assReports[i].THEME_CODE;
        //             break;
        //         }
        //     // 查询表单配置
        //     this.formConfigServices.QueryWidget(this, this.curReportCode, 'addassess');
        // }
    }

    /**
     * 处理返回的表单配置数据
     * 并进行排序
     * @param {Function} callBackFunction 获取数据的回调函数
     * @param {Array} dataArray 返回的表单配置数据
     */

    public handlerDeploymentData(dataArray) {
        this.configItemsSelectedData = [];
        for (let i = dataArray.length - 1; i >= 0; i--) {// 从后向前遍历所有自定义项，取到一级自定义项做特殊处理，WIDGET_DEFAULT值是在后台查询自定义项时给的定值
            if (dataArray[i].默认值 === '用户自定义项' && dataArray[i].父控件ID === -1) {
                this.configItemsSelectedData.push(dataArray[i]);
                dataArray.splice(i, 1);
            } else if (dataArray[i].默认值 !== '用户自定义项') {
                break;
            }
        }
        // 配置项信息
        let reportConfig = {
            topItems: {}, // 放到顶部的组件对象
            parentItems: [], // 一级标题头数组
            childrenItems: {}, // 一级标题下所有子项的对象
            hasDefaultWidgetsObj: {}, // 所有有默认值的组件对象
            tableTitle: {}, // 表头层级关系
            maxLayer: 0, // 最大层级
            formParentItems: [], // 单分上下两部分时，表单部分配置项层级关系
            formLeafItems: [], // 表单分上下两部分时，表单部分所有叶子节点
            formHasDefWidgetsObj: {}, // 表单分上下两部分时，表单部分所有叶子节点
            customParentsObj: {} // 用于新增自定义项时选取父级
        };
        let queryType =  this.reportInfo.reportType;

        // 获取按钮配置项
     //   this.handlerButton(reportConfig.topItems, dataArray);
        let tempArr = dataArray.filter((item) => (item.wigetName !== 'history' && item.wigetName !== 'add'
            && item.wigetName !== 'delete' && item.wigetName !== 'save'));
        /**
         * 判断当前表单是否为上下两部分的，如果是则
         * 单独处理配置数据集中表单部分的数据
         */
        if (queryType === '2') {
            let formArr = dataArray.filter((item) => (item.所属部分 === '1'));
            tempArr = tempArr.filter((item) => (item.所属部分 === '2'));

            // 提取一级标题头&子项的数组&时间和日期控件数组
            this.formConfigServices.handlerDataGroup(reportConfig.formParentItems, reportConfig.formLeafItems, reportConfig.formHasDefWidgetsObj, formArr, reportConfig);
            // 处理项目说明内容
            // this.handlerParentExplain(reportConfig.formParentItems);
            // 处理所有子项的逻辑关系
            this.formConfigServices.handlerChildItemsLogic(reportConfig.formLeafItems);

        }
        // 提取一级标题头&子项的数组&时间和日期控件数组
        this.formConfigServices.handlerDataGroup(reportConfig.parentItems, reportConfig.childrenItems, reportConfig.hasDefaultWidgetsObj, tempArr, reportConfig);
        // 处理项目说明内容
        // this.handlerParentExplain(reportConfig.parentItems);
        // 处理所有子项的逻辑关系
        this.formConfigServices.handlerChildItemsLogic(reportConfig.childrenItems);
        this.formConfigServices.handlerTableTitle(reportConfig.parentItems, reportConfig.tableTitle, reportConfig.maxLayer);
        return reportConfig;
    }

    // 表单预览 查询配置项成功
    // public getDeploymentDataSuccess(result) {
    //     this.deploymentData = result;
    // }

    /***
     * 控件数据发生改变 表单预览
     * @param item
     */
    public theViewDataChange(item) {
        if (item['下拉框选项'] && item.widgetInput) {
            for (let i = 0; i < item.widgetInput.length; i++) {
                let widgetModal = item.widgetInput[i];
                // 进来先置其到原始状态
                for (let j = 0; j < widgetModal['widget'].length; j++) {
                    widgetModal['widget'][j]._TEXTDISABLEDFLAG = true;
                    widgetModal['widget'][j].默认值 = '';
                    widgetModal['widget'][j].ISHIDE = true;
                }
                // 判断是否是下拉选项关联的输入框，如果是让其可以编辑
                if (widgetModal['showName'] === item['默认值'] || widgetModal['hideName'] === item['默认值']) {
                    for (let j = 0; j < widgetModal['widget'].length; j++) {
                        widgetModal['widget'][j]._TEXTDISABLEDFLAG = false;
                        widgetModal['widget'][j].ISHIDE = false;
                    }
                    break;
                }
            }
        }
    }

    /*********************************************表单结束预览***************************************************/

    // 为了解决框架模态框z-index问题
    // 修改弹框z-index
    public setCSS(event) {
        let dia = document.getElementById('dia');
        // console.log(dia.firstElementChild.getAttribute('style'));
        this.styleWatchTimer = setInterval(e => {
            let oldStyle = dia.firstElementChild.getAttribute('style');
            let zindex = (<any>dia.firstElementChild).style.zIndex;
            let newStyle = oldStyle.replace(/z-index: \d+;/, 'z-index: ' + zindex + ' !important;');
            // console.log(newStyle);
            dia.firstElementChild.setAttribute('style', newStyle);
            // console.log((<any>dia.firstElementChild).style.zIndex);
        }, 500);
    }

    public stopSetCSS() {
        clearInterval(this.styleWatchTimer);
    }

    /**
     * 获取是否具有当前医院的权限
     * @param {string} hosNum
     */
    public isHaveHospitalRole(hosNum: string): boolean {
        let hosList: any[] = this.publicCommService.getStorageCache('hosList');
        hosList.forEach(hos => {
            if (hos.HOSNUM === hosNum) {
                return true;
            }
        });
        return false;
    }

    // 显示措施维护窗口
    public showMeasureDlg() {
        this.rptTitle = '措施维护';
        this.displayMeasureDialog = true;
    }

    // 上传数据文件前拼接参数
    fileBeforeUpload(xhr: XMLHttpRequest, formData: FormData) {
        formData.set('Authorization', this.publicCommService.getStorageCache('userInfo').TOKEN);
        //this.uploadUrl = DeploymentConfig.SERVER_URL + 'SystemManagement/Norm/FormConfig?Msg=UploadData';
    }
    // 上传数据文件成功回掉
    fileUpload(xhr: XMLHttpRequest, formData: FormData) {
        console.log(JSON.parse(xhr.response))
        console.log(JSON.parse(xhr.response).success)
        if(JSON.parse(xhr.response).message == "数据导入成功!"){
            this.growlMessageService.showSuccessInfo(JSON.parse(xhr.response).message);
            //this.formConfigServices.getReportDetail(this);
            //this.formConfigServices.getAssReportDetail(this);
        }else{
            this.growlMessageService.showErrorInfo('', JSON.parse(xhr.response).message);
        }
        //this.userService.queryUsers(this);

    }
    // 上传数据文件失败回掉
    fileError(xhr: XMLHttpRequest, formData: FormData){
        this.growlMessageService.showErrorInfo('错误', '数据上传失败！');
    }
    // ******************************************分段 开始*******************//
     // 编辑分段按钮点击事件
    doEditSection(){
        this.EditSection = true;
    }
     // 分段下拉框改变事件
    // sectionChange(){
    //     if(this.chooseSection =='all'){
    //         this.widgetsfilter = this.widgets;
    //     } else {
    //         let temp = this.widgets;
    //         this.widgetsfilter = [];
    //         for( let i=0; i< temp.length ;i++){
    //             if( temp[i].data.所属部分 ===  this.chooseSection) {
    //                 this.widgetsfilter.push( temp[i]);
    //             }
    //         }
    //     }
    // }
    // 确认新增分段
    confirmAddSection() {
        if (this.sectionName === null || this.sectionName === '' || this.sectionName === undefined ||
            this.sectionSort === null || this.sectionSort === '' || this.sectionSort === undefined ||
            this.REPORT_TYPE === null || this.REPORT_TYPE === '' || this.REPORT_TYPE === undefined ) {
            this.growlMessageService.showWarningInfo('请完善分段信息！');
            return;
        }
        this.formConfigServices.addReportSection(this).then(data => {
            if (data.code == 10000) {
                this.dealAdd(data.msg);
            }else {
                this.growlMessageService.showErrorInfo('提示', data.msg);
            }
        }); // 获取表单分段
    }
    // 新增分段
    doAddSection() {
        this.AddSection = true;
        this.sectionName = null;
        this.sectionSort = null;
        this.REPORT_TYPE = null;
    }
    // 删除分段
    deleteSection() {
        if ( this.selectedSection === undefined || this.selectedSection === null || this.selectedSection[0]==='all' ) {
            this.growlMessageService.showWarningInfo('请先选择一条数据！');
            return ;
        }
        // 验证该段是否被使用了再删除
        this.confirmationService.confirm({
            message: '确定删除当前记录?',
            header: '提示',
            icon: 'fa fa-trash',
            accept: () => {
                // 删除记录
                this.formConfigServices.deleteReportSection(this).then(data => {
                    if (data.code == 10000) {
                        this.dealDeleteMsg(data.msg);
                    }else {
                        this.growlMessageService.showErrorInfo('提示', '删除失败');
                    }
                });
            },
            reject: () => {
                this.growlMessageService.showWarningInfo('取消删除！');
            }
        });
    }

    /**
     * 获取表单分段
     */
    // getReportSection() {
    //     let data = [];
    //     this.sectionList = [];
    //     this.sectionListSub = [];
    //     this.sectionList.push({value: 'all', label: '全部分段'});
    //     this.selectedSection = ['all'];
    //     this.curReportSection = data;
    //     // 给下拉框赋值
    //     for(let index of data){
    //         this.sectionList.push({value: index.SEGMENT, label: index.SEGMENT});
    //         this.sectionListSub.push({value: index.SEGMENT, label: index.SEGMENT});
    //     }

    //     // this.formConfigServices.getReportSection(this.selectedReport.data, this.hospitalCode).then(data => {
    //     //     if (data.code == 10000) {
    //     //         this.sectionList = [];
    //     //         this.sectionListSub = [];
    //     //         this.sectionList.push({value: 'all', label: '全部分段'});
    //     //         this.selectedSection = ['all'];
    //     //         this.curReportSection = data.data;
    //     //         // 给下拉框赋值
    //     //         for(let index of data.data){
    //     //             this.sectionList.push({value: index.SEGMENT, label: index.SEGMENT});
    //     //             this.sectionListSub.push({value: index.SEGMENT, label: index.SEGMENT});
    //     //         }

    //     //     }else {
    //     //         this.growlMessageService.showErrorInfo( '提示', data.msg);
    //     //     }
    //     // });
    // }
    /**
     * 处理点击删除后台消息
     * @param {string} message
     */
    dealDeleteMsg(message: string) {

        if (message === 'used') { // 当前菜单或者子菜单有被使用的
            this.growlMessageService.showWarningInfo('当前分段已经被使用，无法删除！');
        }else if (message === 'deleted') { // 菜单删除成功，刷新菜单树及列表
            this.growlMessageService.showSuccessInfo( '删除成功！');
            // this.getReportSection(); // 获取表单分段
        }
    }
    dealAdd(message){
        if (message === 'used') {
            this.growlMessageService.showWarningInfo('当前分段名称已经被使用！');
        }else if (message === 'added') {
            // this.getReportSection(); // 获取表单分段
            this.AddSection = false;
            this.growlMessageService.showSuccessInfo('增加分段成功');
        }
    }
    // ******************************************分段 结束*******************//

    onChange(){
        if(this.commonSource && this.commonSource === true) {
            this.rptDetailDialog.是否同源 = '1';
        }else {
            this.rptDetailDialog.是否同源 = '0';
        }
        // if(this.widgetSaveToDb && this.widgetSaveToDb === true) {
        //     this.rptDetailDialog.widgetSaveToDb = '1';
        // }else {
        //     this.rptDetailDialog.widgetSaveToDb = '0';
        // }
        if(this.bigField && this.bigField === true) {
            this.rptDetailDialog.是否大文本字段 = '1';
        }else {
            this.rptDetailDialog.是否大文本字段 = '0';
        }
    }

    public scrollTreeBody() {
        this.publicCommService.scrollTreeBody();
    }
    public resetScrollTreeBody() {
        this.publicCommService.resetScrollTreeBody();
    }
}
