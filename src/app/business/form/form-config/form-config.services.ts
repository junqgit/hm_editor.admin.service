import {Injectable} from '@angular/core';
// import {HttpUtil} from '../../general/utils/HttpUtil';
// import {PublicCommService} from '../../general/service/public-comm.service';
import {FormConfigComponent} from './form-config.component';
// import { DeploymentConfig } from '../../config/deployment-config';
import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { PublicCommService } from '../../../common/service/public-comm.service';
import {Observable} from "rxjs";
import { environment } from '../../../../environments/environment';

@Injectable()
export class FormConfigServices {
    baseUrl = environment.apiUrl + 'admin-service/Documents/Norm/Config/';
    // 自定义项一级已选定的项目，二级与三级在查询配置项时已经添加
    configItemsSelectedData: any = null;
    param: any;
    constructor( private http: AuthHttpService, private pubServ: PublicCommService) {}

    /**
     * 获取选中医院的所有表单的信息
     @param  hospitalCode   */
    public getReportInfo(hospitalCode: string): Promise<ApiResult> {
        let url = this.baseUrl + 'getReportInfo';
        return this.http.post(url, {
                hospitalCode: hospitalCode
            })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }

    /**
     * 获取选中医院的所有表单的信息
     @param pointer    */
    // public getAssReportInfo(pointer: FormConfigComponent) {
    //     let url = this.baseUrl + 'getAssReportInfo';
    //     this.http.post(url,
    //         {
    //             hospitalCode: pointer.curHosNum,
    //             productCode: this.pubServ.getStorageCache('sysFlag'),
    //         },
    //         data => {
    //             if (data.success) {
    //                 pointer.assReports = data.ResultValue;
    //             }else {
    //                 this.pubServ.showMsg('error', '提示', data.message);
    //             }
    //         },
    //         (msg) => this.pubServ.showMsg('error', '提示', msg));
    // }
    /**
     * 获取选中护理类表单的详细配置
     */
    public getReportDetail(reportID: string, hospitalCode: string): Promise<ApiResult> {
      let url = this.baseUrl + 'getReportDetail';
        return this.http.post(url,
           {
               rptId: reportID,
               hospitalCode: hospitalCode
           })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }
    /**
     * 删除表单分段信息
     */
    public deleteReportSection(selectedSection): Promise<ApiResult> {
        let url = this.baseUrl + 'deleteReportSection';
        return this.http.post(url,
            {
                recId: selectedSection.REC_ID,
                reportID: selectedSection.表单ID,
                section:  selectedSection.SEGMENT
            })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }
    /**
     * 增加表单分段信息
     */
    public addReportSection(pointer): Promise<ApiResult> {
        let url = this.baseUrl + 'addReportSection';
        let reportID = pointer.selectedReport.data;
        return this.http.post(url,
            {
                rptId: reportID,
                sectionName: pointer.sectionName,
                REPORT_TYPE: pointer.REPORT_TYPE,
                sectionSort: pointer.sectionSort,
                hospitalCode: pointer.curHosNum
            })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }
    /**
     * 获取选中护理类表单的分段信息
     */
   public getReportSection(reportID: string, hospitalCode: string): Promise<ApiResult> {
        let url = this.baseUrl + 'getReportSection';
        return this.http.post(url,
            {
                rptId: reportID,
                hospitalCode: hospitalCode,
            })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }
    /**
     * 获取选中护理类表单的详细配置
     */
    public getAssReportDetail(reportID: string, hospitalCode: string):Promise<ApiResult> {
        let url = this.baseUrl + 'getAssReportDetail';
        return this.http.post(url,
            {
                rptId: reportID,
                hospitalCode: hospitalCode
            })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }
    /**
     * 获取菜单列表下拉框
     * @param {FormConfigComponent} pointer
     */
    // public getSysOperation(pointer: FormConfigComponent) {
    //     let url = this.baseUrl + 'getSysOperation';
    //     this.http.post(url,
    //         {
    //             hospitalCode: this.pubServ.getStorageCache('hospital').HOSNUM,
    //             productCode: this.pubServ.getStorageCache('sysFlag'),
    //         },
    //         data => {
    //             if (data.success) {
    //                 pointer.menuCom = data.ResultValue;
    //             }else {
    //                 this.pubServ.showMsg('error', '获取菜单列表失败!', data.message);
    //             }
    //         },
    //         (msg) => this.pubServ.showMsg('error', '提示', msg));
    // }
    /**
     * 验证TagName是否重复
     * @param param
     */
    public verifyTagName(param, saveData):Promise<ApiResult> {
        let url = this.baseUrl + 'verifyTagName';

        return this.http.post(url,
            {
                表单ID: saveData.表单ID,
                表单名称: saveData.表单名称,
                wigetType: saveData.wigetType,
                wigetName: saveData.wigetName
            })
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }
    /**
     * 保存新增或修改表单
     */
    public saveReport(saveData): Promise<ApiResult> {
        let url = this.baseUrl + 'saveReport';
        return this.http.post(url, saveData)
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }

    /**
     * 删除表单
     */
    public deleteReport(recrd_id: string): Promise<ApiResult> {
      let url = this.baseUrl + 'delReport?recrd_id=' + recrd_id;
        return this.http.post(url, {})
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }

    /**
     * 下载数据，将对应的表单配置数据生成记录包放在服务器对应目录下
     * @param {FormConfigComponent} pointer
     */
    public downData(pointer: FormConfigComponent): Promise<ApiResult> {
        let url = this.baseUrl + 'downloadData';
        return this.http.post(url,
            {
                hospitalCode: pointer.hospitalCode,
                rptType: pointer.rptType
            })
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }
    /****************************************************************以下表单预览********************************/
    /**
     * 查询表单配置 风险类
     * @param pointer
     */
    // public QueryWidget(param, themeCode, type) {
    //     let url = 'Documents/Norm/Business/Risk?Msg=' + 'QueryWidget';
    //     this.http.post(url,
    //         {
    //             themeCode: themeCode,
    //             hosnum:  this.pubServ.getStorageCache('hospital').HOSNUM,
    //         },
    //         data => {
    //             if (data.success) {
    //                 param.widgetsource = data.ResultValue;
    //                 if ('addassess' === type) {
    //                     let list = this.handlewidget(this.setaddAssess(data.ResultValue));
    //                     param.riskwidget = list;
    //                 }
    //             } else {
    //                 this.pubServ.showMsg('error', '查询表单配置失败', data.message);
    //             }
    //         }, (msg) => this.pubServ.showMsg('error', '请求出错', msg)
    //     );
    // }
    /***
     * 处理配置项数据
     * @param data
     * @returns {{first: any[]}}
     */
    // public handlewidget(data: any) {
    //     let list = {
    //         first: [],
    //     };
    //     list.first = data.filter(x => x.LEVEL_CODE === '1');
    //     if (list !== undefined) {
    //         for ( let i = 0; i < list.first.length; i++) {
    //             let 父控件ID = list.first[i]['WIDGET_ID'];
    //             list.first[i]['seconditem'] = data.filter(x => x.父控件ID === 父控件ID);
    //         }
    //     }
    //     return list;
    // }
    // public setaddAssess(data) {
    //     if ( data !== undefined) {
    //         for (let k = 0; k < data.length; k++) {
    //             data [k]['默认值'] = '';
    //         }
    //     }
    //     return data;
    // }


    /**
     * 获取单个表单详情
     * 鲁智华
     * @param pointer
     */
    public getDeploymentData(pointer, 表单名称, report_id, reportversion): Promise<ApiResult> {
     /*   let currPat = this.pubServ.getStorageCache('curPatient');
        if (currPat == null) {
            return;
        }*/
        let url = 'SystemManagement/Norm/FormConfig?Msg=getReportDetailForPDA';
        return this.http.post(url,
            {
                hospitalcode: this.pubServ.getStorageCache('hospital').HOSNUM,
                reportname: 表单名称,
                reportversion: reportversion,
            /*    pid: currPat.PATIENT_ID,
                vid: currPat.VISIT_ID,
                nu: this.pubServ.getStorageCache('nurseUnit').DEPT_CODE,*/
                所属部分: '自定义项',
                report_id: report_id
            })
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }

    // /**
    //  * 处理返回的表单配置数据
    //  * 并进行排序
    //  * @param {Function} callBackFunction 获取数据的回调函数
    //  * @param {Array} dataArray 返回的表单配置数据
    //  */

    // public handlerDeploymentData(dataArray) {
    //     this.configItemsSelectedData = [];
    //     for (let i = dataArray.length - 1; i >= 0; i--) {// 从后向前遍历所有自定义项，取到一级自定义项做特殊处理，WIDGET_DEFAULT值是在后台查询自定义项时给的定值
    //         if (dataArray[i].默认值 === '用户自定义项' && dataArray[i].父控件ID === -1) {
    //             this.configItemsSelectedData.push(dataArray[i]);
    //             dataArray.splice(i, 1);
    //         } else if (dataArray[i].默认值 !== '用户自定义项') {
    //             break;
    //         }
    //     }
    //     // 配置项信息
    //     let reportConfig = {
    //         topItems: {}, // 放到顶部的组件对象
    //         parentItems: [], // 一级标题头数组
    //         childrenItems: {}, // 一级标题下所有子项的对象
    //         hasDefaultWidgetsObj: {}, // 所有有默认值的组件对象
    //         tableTitle: {}, // 表头层级关系
    //         maxLayer: 0, // 最大层级
    //         formParentItems: [], // 单分上下两部分时，表单部分配置项层级关系
    //         formLeafItems: [], // 表单分上下两部分时，表单部分所有叶子节点
    //         formHasDefWidgetsObj: {}, // 表单分上下两部分时，表单部分所有叶子节点
    //         customParentsObj: {} // 用于新增自定义项时选取父级
    //     };
    //     let queryType =  this.param.curReportType;

    //     // 获取按钮配置项
    //  //   this.handlerButton(reportConfig.topItems, dataArray);
    //     let tempArr = dataArray.filter((item) => (item.wigetName !== 'history' && item.wigetName !== 'add'
    //         && item.wigetName !== 'delete' && item.wigetName !== 'save'));
    //     /**
    //      * 判断当前表单是否为上下两部分的，如果是则
    //      * 单独处理配置数据集中表单部分的数据
    //      */
    //     if (queryType === '2') {
    //         let formArr = dataArray.filter((item) => (item.所属部分 === '1'));
    //         tempArr = tempArr.filter((item) => (item.所属部分 === '2'));

    //         // 提取一级标题头&子项的数组&时间和日期控件数组
    //         this.handlerDataGroup(reportConfig.formParentItems, reportConfig.formLeafItems, reportConfig.formHasDefWidgetsObj, formArr, reportConfig);
    //         // 处理项目说明内容
    //         // this.handlerParentExplain(reportConfig.formParentItems);
    //         // 处理所有子项的逻辑关系
    //         this.handlerChildItemsLogic(reportConfig.formLeafItems);

    //     }
    //     // 提取一级标题头&子项的数组&时间和日期控件数组
    //     this.handlerDataGroup(reportConfig.parentItems, reportConfig.childrenItems, reportConfig.hasDefaultWidgetsObj, tempArr, reportConfig);
    //     // 处理项目说明内容
    //     // this.handlerParentExplain(reportConfig.parentItems);
    //     // 处理所有子项的逻辑关系
    //     this.handlerChildItemsLogic(reportConfig.childrenItems);
    //     this.handlerTableTitle(reportConfig.parentItems, reportConfig.tableTitle, reportConfig.maxLayer);
    //     return reportConfig;
    // }

/*    public handlerDataGroup(topItems, parentItems, childrenItems, hasDefaultWidgetsObj, dataArray, reportConfig) {
        // 1.过滤出按钮部分
        for (let i = 0; i < 4; i++) {
            // 判断是否是增删改查按钮
            if (dataArray[i].wigetName === 'save' || dataArray[i].wigetName === 'delete'
                || dataArray[i].wigetName === 'add' || dataArray[i].wigetName === 'history') {
                topItems[dataArray[i].wigetName] = dataArray[i];
            }
        }
        // 用于组装一级、二级、三级使用的主键对象
        let firstKey = {};
        let secondKey = {};
        let thirdKey = {};
        // 过滤出一级标题和日期
        for (let i = 4, len = dataArray.length; i < len; i++) {
            let item = dataArray[i];
            item.NOT_EDIT = false;
            // 可用0 ，不可编辑1， pc隐藏2 ，pda隐藏3， 隐藏4
            if (item.isVisity === 2 || item.isVisity === 4) {
                item.IS_HIDE = true;
            } else {
                item.IS_HIDE = false;
                if (item.isVisity === 1) {
                    item.NOT_EDIT = true;
                }
            }

            item._CHILDITEMS = [];
            item._SECONDITEMS = [];
            let obj = {
                value: item
            };
            // 处理默认值类型
         //   this.handlerDefaultWidget(hasDefaultWidgetsObj, item);
            let key = item.WIDGET_ID;
            if (item.父控件ID === -1) { // 一级标题
                firstKey[key] = obj;
                if (reportConfig.maxLayer < 1) {
                    reportConfig.maxLayer = 1;
                }
            } else if (firstKey[item.父控件ID] != null) {
                secondKey[key] = obj;
                if (reportConfig.maxLayer < 2) {
                    reportConfig.maxLayer = 2;
                }
            } else if (secondKey[item.父控件ID] != null) {
                thirdKey[key] = obj;
                if (reportConfig.maxLayer < 3) {
                    reportConfig.maxLayer = 3;
                }
            }
        }
        // 找出二级标题下对应的三级目录
        if (JSON.stringify(thirdKey) !== '{}') {
            for (let i = 0; i < dataArray.length; i++) {
                if (thirdKey[dataArray[i].WIDGET_ID] != null) {
                    thirdKey[dataArray[i].WIDGET_ID].maxLayer = 1;
                    let item = thirdKey[dataArray[i].WIDGET_ID].value;
                    if (secondKey[item.父控件ID] != null) {
                        secondKey[item.父控件ID].value._CHILDITEMS.push(item);
                    }
                }
            }
        }
        // 找出一级标题下的二级目录
        if (JSON.stringify(secondKey) !== '{}') {
            for (let i = 0; i < dataArray.length; i++) {
                if (secondKey[dataArray[i].WIDGET_ID] != null) {
                    let item = secondKey[dataArray[i].WIDGET_ID].value;
                    if (firstKey[item.父控件ID] != null) {
                        firstKey[item.父控件ID].value._SECONDITEMS.push(item);
                    }
                }
            }
        }
        // 组装parentItems数据
        for (let i = 0; i < dataArray.length; i++) {
            if (firstKey[dataArray[i].WIDGET_ID] != null) {
                parentItems.push(dataArray[i]);
            }
        }
        // 组装所有的子项数据childrenItems
        for (let i = 4, len = dataArray.length; i < len; i++) {
            let item = dataArray[i];
            // 当数据的二级目录_SECONDITEMS和一级目录_CHILDITEMS都为0时，此项为子项
            if (item._SECONDITEMS.length === 0 && item._CHILDITEMS.length === 0) {
                this.handlerChildItems(item);
                childrenItems[item.wigetName] = item;

            }
        }
    }*/
    public handlerDataGroup(parentItems, childrenItems, hasDefaultWidgetsObj, dataArray, reportConfig) {
        reportConfig.customParentsObj = {};
        // 用于组装一级、二级、三级使用的主键对象
        let firstKey = {};
        let secondKey = {};
        let thirdKey = {};
        // 过滤出一级标题和日期
        for (let i = 0, len = dataArray.length; i < len; i++) {
            let item = dataArray[i];
            item.NOT_EDIT = false;
            // 可用0 ，不可编辑1， pc隐藏2 ，pda隐藏3， 隐藏4
            if (item.isVisity === 2 || item.isVisity === 4) {
                item.IS_HIDE = true;
            } else {
                item.IS_HIDE = false;
                if (item.isVisity === 1) {
                    item.NOT_EDIT = true;
                }
            }

            item._CHILDITEMS = [];
            item._SECONDITEMS = [];
            let obj = {
                value: item
            };
            // 处理默认值类型
            this.handlerDefaultWidget(hasDefaultWidgetsObj, item);
            let key = item.WIDGET_ID;
            if (item.父控件ID === -1) { // 一级标题
                firstKey[key] = obj;
                if (reportConfig.maxLayer < 1) {
                    reportConfig.maxLayer = 1;
                }
            } else if (firstKey[item.父控件ID] != null) {
                secondKey[key] = obj;
                if (reportConfig.maxLayer < 2) {
                    reportConfig.maxLayer = 2;
                }
            } else if (secondKey[item.父控件ID] != null) {
                thirdKey[key] = obj;
                if (reportConfig.maxLayer < 3) {
                    reportConfig.maxLayer = 3;
                }
            }
        }
        // 找出二级标题下对应的三级目录
        if (JSON.stringify(thirdKey) !== '{}') {
            for (let i = 0; i < dataArray.length; i++) {
                if (thirdKey[dataArray[i].WIDGET_ID] != null) {
                    thirdKey[dataArray[i].WIDGET_ID].maxLayer = 1;
                    let item = thirdKey[dataArray[i].WIDGET_ID].value;
                    if (secondKey[item.父控件ID] != null) {
                        reportConfig.customParentsObj[item.父控件ID] =  secondKey[item.父控件ID].value;
                        secondKey[item.父控件ID].value._CHILDITEMS.push(item);
                    }
                }
            }
        }
        // 找出一级标题下的二级目录
        if (JSON.stringify(secondKey) !== '{}') {
            for (let i = 0; i < dataArray.length; i++) {
                if (secondKey[dataArray[i].WIDGET_ID] != null) {
                    let item = secondKey[dataArray[i].WIDGET_ID].value;
                    if (firstKey[item.父控件ID] != null) {
                        reportConfig.customParentsObj[item.父控件ID] =  firstKey[item.父控件ID].value;
                        firstKey[item.父控件ID].value._SECONDITEMS.push(item);
                    }
                }
            }
        }
        // 组装parentItems数据
        for (let i = 0; i < dataArray.length; i++) {
            if (firstKey[dataArray[i].WIDGET_ID] != null) {
                parentItems.push(dataArray[i]);
            }
        }
        // 组装所有的子项数据childrenItems
        for (let i = 0, len = dataArray.length; i < len; i++) {
            let item = dataArray[i];
            // 当数据的二级目录_SECONDITEMS和一级目录_CHILDITEMS都为0时，此项为子项
            if (item._SECONDITEMS.length === 0 && item._CHILDITEMS.length === 0) {
                this.handlerChildItems(item);
                childrenItems[item.wigetName] = item;
                // 此子项有自定义项
                if (item.控件类型代码 === 'custom' && item.父控件ID === -1) { // 添加一级自定义项
                    let viewData = this.configItemsSelectedData;
                    if (viewData && viewData.length) {
                        for (let j = 0; j < viewData.length; j++) {
                            // 根据自定义项控件名筛选出该项自定义项内容(解决有多个自定义项问题)
                            if ( viewData[j].父控件ID === -1) {/*viewData[j].所属部分 === item.wigetName &&*/
                                // 为自定义项添加页面需要的属性
                                let customItems = viewData[j];
                                this.handlerChildItems(customItems);
                                customItems.NOT_EDIT = false;
                                // 可用0 ，不可编辑1， pc隐藏2 ，pda隐藏3， 隐藏4
                                if (customItems.isVisity === 2 || customItems.isVisity === 4) {
                                    customItems.IS_HIDE = true;
                                } else {
                                    customItems.IS_HIDE = false;
                                    if (customItems.isVisity === 1) {
                                        customItems.NOT_EDIT = true;
                                    }
                                }
                                customItems._CHILDITEMS = [];
                                customItems._SECONDITEMS = [];
                                if (firstKey[item.WIDGET_ID] != null) {
                                    firstKey[item.WIDGET_ID].value._SECONDITEMS.push(customItems);
                                }
                                childrenItems[customItems.wigetName] = customItems;
                            }
                        }
                    }else {
                        item.IS_HIDE = true;
                    }
                } else {
                    // 处理子项对象
                    this.handlerChildItems(item);
                    childrenItems[item.wigetName] = item;
                }
            }
        }
    }
    /**
     * 处理默认值
     * @param {Array} hasDefaultWidgetsObj 所有时间和日期控件数组
     * * @param {Object} item 子项的对象
     */
    public handlerDefaultWidget(hasDefaultWidgetsObj, item) {
        // 时间，日期，日期时间 和有默认项的控件
        if (item.控件类型代码 === 'date' || item.控件类型代码 === 'time' || item.控件类型代码 === 'datetime' && !item.默认值) {
            item.DEFAULT_TYPE = item.控件类型代码;
            hasDefaultWidgetsObj[item.wigetName] = item;
        } else if ((item.默认值 != null && item.默认值.length > 0)) {
            let value = item.默认值;
            let type = '';
            switch (value) {
                case '护士ID':
                    type = 'USER_ID';
                    break;
                case '护士姓名':
                case '护士签名':
                case '评估护士签名':
                case '评估者签名':
                case '责任护士签名':
                case '评估护士':
                case '签名':
                    type = 'USER_NAME';
                    break;
                case '科室':
                    type = 'DEPT_NAME';
                    break;
                case '姓名':
                    type = 'PATIENT_NAME';
                    break;
                case '性别':
                    type = 'SEX';
                    break;
                case '年龄':
                    type = 'AGE';
                    break;
                case '住院号':
                    type = 'INP_NO';
                    break;
                case '床号':
                    type = 'BED_NO';
                    break;
                case '入院时间':
                    type = 'ADMISSION_DATA';
                    break;
                case '入院诊断':
                case '诊断':
                    type = 'DIAGNOSIS';
                    break;
                case '护理级别':
                    type = 'NURSE_LEVEL';
                    break;
                case '电话':
                    type = 'PHONE_NUMBER';
                    break;
                case '地址':
                    type = 'ADDRESS';
                    break;
                default :
                    break;
            }
            item.DEFAULT_TYPE = type;
            hasDefaultWidgetsObj[item.wigetName] = item;
        }
    }

    /**
     * 处理项目说明内容
     * 点击?展示项目说明信息
     */
    public handlerParentExplain(parentItems) {
        let explainFirstList: any = {}; // 一级标题提示信息
        let explainsecList: any = {}; // 二级标题提示信息
        for (let i = 0; i < parentItems.length; i++) {
            // 判断是否为一级标题，且含有子项
            if ('-1' === parentItems[i].父控件ID && parentItems[i]._SECONDITEMS.length > 0) {
                // 判断一级标题是否显示说明信息
                if ('1' === parentItems[i].ISSHOWEXPLAIN) {
                    // 收集说明信息
                    explainFirstList.firstTitle = parentItems[i].控件显示名称;
                    explainFirstList.detail = [];
                    for (let j = 0; j < parentItems[i]._SECONDITEMS.length; j++) {
                        if (null != parentItems[i]._SECONDITEMS[j].DETAILEXPLAIN && '' !== parentItems[i]._SECONDITEMS[j].DETAILEXPLAIN) {
                            // 一级标题
                            let temp = {
                                item_name: parentItems[i]._SECONDITEMS[j].wigetName,
                                item_value: parentItems[i]._SECONDITEMS[j].DETAILEXPLAIN
                            };
                            explainFirstList.detail.push(temp);
                        }
                    }
                    parentItems[i].SHOWEXPLAINTEXT = explainFirstList;
                }
                // 判断是否有二级标题，且含有子项
                for (let m = 0; m < parentItems[i]._SECONDITEMS.length; m++) {
                    // 二级标题，且ISSHOWEXPLAIN=1,且含有子项
                    if (parentItems[i]._SECONDITEMS[m]._CHILDITEMS.length > 0 && '1' === parentItems[i]._SECONDITEMS[m].ISSHOWEXPLAIN) {
                        explainsecList.firstTitle = parentItems[i].控件显示名称;
                        explainsecList.firstTitle = parentItems[i].控件显示名称;
                        explainsecList.detail = [];
                        for (let n = 0; n < parentItems[i]._SECONDITEMS[m]._CHILDITEMS.length; n++) {
                            if (null != parentItems[i]._SECONDITEMS[m]._CHILDITEMS[n].DETAILEXPLAIN
                                && '' !== parentItems[i]._SECONDITEMS[m]._CHILDITEMS[n].DETAILEXPLAIN) {
                                let sectemp = {
                                    item_name: parentItems[i]._SECONDITEMS[m]._CHILDITEMS[n].wigetName,
                                    item_value: parentItems[i]._SECONDITEMS[m]._CHILDITEMS[n].DETAILEXPLAIN
                                };
                                explainsecList.detail.push(sectemp);
                            }
                        }
                        parentItems[i]._SECONDITEMS[m].SHOWEXPLAINTEXT = explainsecList;
                    }
                }

            }
        }
    }
    /**
     * 处理所有子项的逻辑关系
     * @param {Object} childrenItems 一级标题下所有子项的对象
     */
    public handlerChildItemsLogic(childrenItems) {
        // 组装初始化互斥和约束逻辑
        for (let itemName in childrenItems) {
            if (childrenItems.hasOwnProperty(itemName)) {
                let item = childrenItems[itemName];
                // 判断该控件是否有互斥和约束逻辑
                if (item.约束项 != null && item.约束项.length > 0) {
                    // 与该控件相关联的控件数组
                    let relateNameArray = item.约束项.split('$');
                    let relateValueArray = item.约束项显示项.split('$');
                    item.约束项 = relateNameArray;
                    item.约束项显示项 = relateValueArray;
    
                    for (let i = 0; i < relateNameArray.length; i++) {
                        // 与该控件相关的控件
                        let relateItem = childrenItems[relateNameArray[i]];
                        if (relateItem) {
                            // 为该控件相关的控件赋上对应的逻辑值
                            relateItem._RALATEVALUE = relateValueArray[i];
                            if (relateItem._RALATEVALUE === '1') {
                                relateItem._TEXTDISABLEDFLAG = true;
                                relateItem.IS_HIDE = true;
                            }
                        }
                    }
                }
    
                // 判断是否有关联的项
                if (item.下拉框选项 != null && item.下拉框选项.length > 0) {
                    let reg = /^[$]+$/g;
                    item.RELETIVE_ARRAY = [];
                    // 配置工具中下拉选对应的五列数据集合
                    let itemArray = item['下拉框选项'].split('￥');
                    // 显示值对应的数组集合
                    let nameShowArray = itemArray[0].split('$');
                    //  隐藏值名对应的数组集合
                    let nameHideArray = itemArray[1].split('$');
                    // 每个显示名关联的input输入框集合
                    let editArray = [];
                    if (itemArray[4] != null) {
                        editArray = itemArray[4].split('$');
                    }
                    // 找到spinner下拉选选项对应的输入框，并把其放在当前对象中
                    for (let i = 0; i < editArray.length; i++) {
                        if (editArray[i] == null || editArray[i].length === 0 || editArray[i].match(reg)) {
                            continue;
                        } else {
                            // 如果一个选项关联几个输入框，则输入框的名字有&隔离
                            let editName = editArray[i].split('&');
                            // 关联输入框的数组
                            let widgetArray = [];
                            for (let j = 0; j < editName.length; j++) {
                                childrenItems[editName[j]]._TEXTDISABLEDFLAG = true; // 不可以编辑
                                childrenItems[editName[j]].IS_HIDE = true; // 隐藏
                                widgetArray.push(editName[j]);
                            }
                            item.RELETIVE_ARRAY.push({
                                showName: nameShowArray[i],
                                hideName: nameHideArray[i],
                                array: widgetArray
                            });
                        }
                    }
                }
    
                // 判断对应的总分组件是否需要计算分数，如果需要则把它绑在对应分数组件的RELETIVE_OBJ对象上
                let totalScoreWidget = childrenItems[item.AGGREGATE_SCORE];
                // 判断该控件是否有计算总分逻辑
                if (item.AGGREGATE_SCORE && totalScoreWidget != null) {
                    if (totalScoreWidget.RELETIVE_OBJ == null) {
                        totalScoreWidget.RELETIVE_OBJ = {};
                    }
                    totalScoreWidget.RELETIVE_OBJ[item.wigetName] = item.SCOREPDA;
                }
            }
        }
    }

 /*   public handlerTableTitle(parentItems, tableTitle, maxLayer) {
        tableTitle.column = []; // 子集
        tableTitle.firstTitle = []; // 一级
        tableTitle.secondTitle = []; // 二级
        tableTitle.thirdTitle = []; // 三级
        for (let i = 0; i < parentItems.length; i++) {
            let first = parentItems[i];
            tableTitle.firstTitle.push(first);
            if (first._SECONDITEMS.length > 0) {
                first.rowspan = maxLayer - 1; // colspan
                first.colspan = first._SECONDITEMS.length;
                for (let j = 0; j < first._SECONDITEMS.length; j++) {
                    let second = first._SECONDITEMS[j];
                    tableTitle.secondTitle.push(second);
                    if (second._CHILDITEMS.length > 0) {
                        second.rowspan = 2;
                        second.colspan = second._CHILDITEMS.length;
                        for (let z = 0; z < second._CHILDITEMS.length; z++) {
                            let third = second._CHILDITEMS[z];
                            tableTitle.thirdTitle.push(third);
                            second.rowspan = 1;
                            second.colspan = 1;
                            this.isOutOrIn(third);
                            tableTitle.column.push(third);
                        }
                    } else {
                        second.rowspan = maxLayer - 1;
                        second.colspan = 1;
                        this.isOutOrIn(second);
                        tableTitle.column.push(second);
                    }
                }
            } else {
                first.rowspan = maxLayer; // colspan
                first.colspan = 1;
                this.isOutOrIn(first);
                tableTitle.column.push(first);
            }
        }
    }*/
    public handlerTableTitle(parentItems, tableTitle, maxLayer) {
        tableTitle.column = []; // 子集
        tableTitle.firstTitle = []; // 一级
        tableTitle.secondTitle = []; // 二级
        tableTitle.thirdTitle = []; // 三级

        for (let i = 0; i < parentItems.length; i++) {
            let first = parentItems[i];
            tableTitle.firstTitle.push(first);
            if (first._SECONDITEMS.length > 0) {
                first.colspan = 0; // 层级下所有子项数目
                let hasthird = false;
                for (let j = 0; j < first._SECONDITEMS.length; j++) {
                    let secondtemp = first._SECONDITEMS[j];
                    if (secondtemp._CHILDITEMS.length > 0) {
                        secondtemp.rowspan = 1;
                        secondtemp.colspan = secondtemp._CHILDITEMS.length;
                        tableTitle.secondTitle.push(secondtemp);
                        // first.rowspan = 1;
                        hasthird = true;
                        for (let z = 0; z < secondtemp._CHILDITEMS.length; z++) {
                            let third = secondtemp._CHILDITEMS[z];
                            first.colspan += 1; // 层级下所有子项数目
                            tableTitle.thirdTitle.push(third);
                            third.rowspan = 1;
                            third.colspan = 1;
                            this.isOutOrIn(third);
                            tableTitle.column.push(third);
                        }
                    } else {
                        // first.rowspan = 2;//合并两行
                        first.colspan += 1; // 层级下所有子项数目
                        tableTitle.thirdTitle.push(secondtemp);
                        secondtemp.rowspan = 1;
                        secondtemp.colspan = 1;
                        this.isOutOrIn(secondtemp);
                        tableTitle.column.push(secondtemp);
                    }
                }
                first.rowspan = (hasthird || maxLayer < 3) ? 1 :2; // 合并两行
            } else {
                first.rowspan = maxLayer;
                first.colspan = 1;
                this.isOutOrIn(first);
                tableTitle.column.push(first);
            }
        }
    }
    public isOutOrIn(item) {
        if (item.wigetName === '入量名称' || item.wigetName === '入量量' || item.wigetName === '出量名称' || item.wigetName === '出量量') {
            item.isOutOrIn = true;
        }
    }

    /**
     * 处理子项对象
     * @param {Object} childrenItem
     */
    public handlerChildItems(childrenItem) {
        let me = this;
        childrenItem.REC_ID = '-1';
        switch (childrenItem.控件类型代码) {
            case 'TextView': // 文本框只读
                childrenItem._TEXTDISABLEDFLAG = true;
                break;
            case 'EditText':
                break;
            case 'CheckBox':
                if (childrenItem.isVisity === 1) {
                    childrenItem._TEXTDISABLEDFLAG = true;
                }
                break;
            case 'Spinner':
            case 'ComboBox':
            case 'MultiComBox': // 处理下拉选项
            case 'MultiComBoxNoInPut':
                me.handlerSpinnerAndComboBox(childrenItem);
                break;
            case 'date':
                break;
            case 'time':
                break;
            case 'datetime':
                break;
            default :
                break;
        }
    }

    /**
     * 处理下拉框和可选可输组件的下拉数据处理
     * @param {Object} childrenItem  子项对象
     */
    public handlerSpinnerAndComboBox(childrenItem) {
        let _SELECTARRAY = [];
        if (childrenItem.textPda == null || childrenItem.textPda.length === 0) {
            childrenItem._SELECTARRAY = [];
            return;
        }
        /*if (childrenItem.textPda.substr(0, 1) === '$') {
            // 如果第一项有一个空值，则不需要再添加一个空值进去
        } else {
            _SELECTARRAY.push({
                label: '',
                value: '',
                score: '',
                默认值: ''
            });
        }*/
        let reg = /^[$]+$/g;
        let showDataArr = []; // 显示值
        let saveDataArr = []; // 保存值
        let scoreDataArr = []; // 计算分数的值
        showDataArr = childrenItem.textPda.split('$');
        if (showDataArr.length > 0) {
            // 如果保存值没有配置那么就保存显示值
            if (childrenItem.valuePda != null && !childrenItem.valuePda.match(reg) && childrenItem.valuePda.length > 0) {
                saveDataArr = childrenItem.valuePda.split('$');
            } else {
                saveDataArr = childrenItem.textPda.split('$');
            }
            if (childrenItem.SCOREPDA != null && childrenItem.SCOREPDA.length > 0) {
                scoreDataArr = childrenItem.SCOREPDA.split('$');
            }
        }
        for (let i = 0; i < showDataArr.length; i++) {
            _SELECTARRAY.push({
                label: showDataArr[i],
                value: saveDataArr[i],
                score: scoreDataArr[i]
            });
        }
        childrenItem._SELECTARRAY = _SELECTARRAY;
    }
    /****************************************************************表单预览以上********************************/

    public verifyReportExist(pointer): Promise<ApiResult> {
        let url = this.baseUrl + 'verifyReportExist';
        return this.http.post(url,
            {
                tempalteCode: pointer.curTemplateCode,
                hosNum: pointer.hospitalCode,
                rptType: pointer.rptType,
                version: pointer.newVersion
            })
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }

    /**
     * 复制表单
     */
    public copyReport(pointer, userId): Promise<ApiResult> {
        let url = this.baseUrl + 'copyReport';
        return this.http.post(url,
            {
                rptId: pointer.curReportid,
                curHosNum: pointer.hospitalCode,
                sourceHosNum: pointer.curHosNum,
                rptType: pointer.rptType,
                version: pointer.newVersion,
                userID: userId
            })
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }
    /**
     * 获取字典列表
     * @param param
     */
    public getDictInfoGrid(hospitalCode, dictCODE): Promise<ApiResult> {
        let url = 'SystemManagement/Norm/Dict?';
        return this.http.post(url,
            {
                Msg: 'getDictInfoGrid',
                dictCODE :  dictCODE,
                hosNum : hospitalCode
            })
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
