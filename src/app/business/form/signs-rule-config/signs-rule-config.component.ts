import {Component, OnInit} from '@angular/core';
import {SignsRuleConfigService} from './signs-rule-config.service';
import {VitalSignsRegs, ConfigDict, TimePoint} from './signs-rule-config-interface';
import { PublicCommService } from '../../../common/service/public-comm.service';
import { LoadingService } from 'portalface/services';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
import {KyeeUtils} from 'portalface/utils/kyee-utils';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { SysParamService } from '../../sys-param/sys-param.service';
import { TreeNode } from 'primeng/primeng';

@Component({
    selector: 'kyee-signs-rule-config',
    templateUrl: './signs-rule-config.component.html',
    styleUrls: ['./signs-rule-config.component.scss'],
    providers: [SignsRuleConfigService]
})
export class SignsRuleConfigComponent implements OnInit {
    newBornConfig = false;

    constructor(public signsService: SignsRuleConfigService,
        public pubsrv: PublicCommService,
        public authTokenService: AuthTokenService,
        private growlMessageService: GrowlMessageService,
        private loadingService: LoadingService,
        private sysParamService: SysParamService) {
    }
    showConfigTable: boolean = false;
    isSysAdmin: boolean = false;
    hospitalInfo: any = {
        areaCode: '',
        hosNum: '',
        nodeNum: '',
        deptCode: '',
        wardCode: '*'
    };
    filterHospitalName: any = '';
    reportsTree: TreeNode[];
    selectedReport: TreeNode;

    selectType: any; // 标记规则所属类型
    wardList: any[]; // 权限科室列表
    selectedWard: string; // 选中的护理单元
    configList: any[]; // 配置的数据集合
    defaultData: ConfigDict; // 默认项目数据集
    defaultItems: VitalSignsRegs[];
    admissionData: ConfigDict; // 入院提示数据集
    admissionItems: VitalSignsRegs[];
    admissionHours: string;
    transferData: ConfigDict; // 转入提示数据集
    transferItems: VitalSignsRegs[];
    transferHours: string;
    operationData: ConfigDict[]; // 手术提示数据集
    operationColums: any[];
    nursingData: any; // 护理级别提示数据集
    nursingColums: any[];
    illnessData: any; // 病情提示
    illnessColums: any[];
    ageData: any; // 年龄提示
    ageColums: any[];
    weightData: ConfigDict; // 体重提示
    feverData: any; // 发热提示
    feverColums: any[];
    selectRow: ConfigDict; // 选中的记录行用于删除
    saveArr: ConfigDict[]; // 保存的数组
    freqCom: any[]; // 频率字典
    private currentUserInfo: CurrentUserInfo;
    display: boolean; // 显示时间点配置框
    timePointData: TimePoint; // 时间点配置数据集
    timePonitSource: any[] = []; // 时间点查询原始数据集
    nuringLevels: any[] = []; // 能级集合
    illnessLevels: any[]; // 病情级别
    weightDays: string; // 体重间隔天数
    weightWay: string; // 起始时间方式
    saveFlag: boolean; // 标记当前记录是否可以保存
    wardComDisable: boolean; // 当选择全院时病区下拉框变灰
    toolTip: string; // 提示内容

    ngOnInit() {
        this.selectedWard = '*';
        this.wardComDisable = true;
        this.currentUserInfo = this.sysParamService.getCurUser();
        this.selectType = '1';
        this.freqCom = [{label: ' ', value: ''},
            {label: '日一', value: '1'},
            {label: '日二', value: '2'},
            {label: '日三', value: '3'},
            {label: '日四', value: '4'},
            {label: '日五', value: '5'},
            {label: '日六', value: '6'},
            {label: '日十二', value: '12'}];
        this.nuringLevels = [{label: '特级', value: 'S'},
            {label: '一级', value: '1'},
            {label: '二级', value: '2'},
            {label: '三级', value: '3'}];
        this.illnessLevels = [{label: '病危', value: '1'},
            {label: '病重', value: '2'},
            {label: '一般', value: '3'}];
        this.timePointData = {day1: '', day2: '', day3: '', day4: '', day5: '', day6: '', day12: ''};

    if (!this.sysParamService.isAreaUser(this.currentUserInfo)) {
            this.isSysAdmin = false;
            this.hospitalInfo.hosNum = this.currentUserInfo['hosNum'];
            this.hospitalInfo.areaCode = this.currentUserInfo['nodeCode'];
            this.hospitalInfo.hosName = this.currentUserInfo['hosName'];
            this.hospitalInfo.nodeNum = this.currentUserInfo['nodeCode'];
            this.getWardComboxData(); // 初始化权限病区下拉框
            this.queryConfig();
            this.showConfigTable = true;
        }else {
            this.isSysAdmin = true;
            this.getAreasAndHospitalsList();
        }
    }

    getAreasAndHospitalsList() {
        this.loadingService.loading(true);
        this.sysParamService.getAreasAndHospitalsByRole(this.filterHospitalName).subscribe(
            apiResult => {
            if (apiResult.code == 10000 && apiResult.data) {
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
            for (let hospital of hospitals){
            hospital['label'] = hospital['医院名称'];
            hospital['data'] = hospital;
            hospital['院区编码'] = hospital['院区编码'];
            hospital['children'] = [];
            }
            area['children'] = hospitals;
        }
    }
    return interfaceResult;
    }

    updateHospitalInfo() {
        if (this.reportsTree && this.reportsTree.length > 0) {
            this.selectedReport = this.reportsTree[0].children ? (this.reportsTree[0].children[0] || {}) : {};
            this.reportsTree[0].expanded = true;
            this.selectedReport.parent = this.reportsTree[0];
            this.reportSelect();
        }
    }

    reportSelect() {
        if (!this.selectedReport || Object.keys(this.selectedReport).length == 0) {
            this.growlMessageService.showWarningInfo('请选择医院');
            return;
        }
        this.initWardListOptions(this.selectedReport.data['病区列表']);
        this.hospitalInfo.hosNum = this.selectedReport['医院编码']; // 当前节点所在的医院
        this.hospitalInfo.areaCode = this.selectedReport.parent['areaCode'];
        this.hospitalInfo.hosName = this.selectedReport['医院名称'];
        this.hospitalInfo.nodeNum = this.selectedReport['院区编码'];
        this.selectedWard = '*';
        this.queryConfig();
        this.showConfigTable = true;
    }

    initWardListOptions(data: any) {
        if (!data || data.length == 0) {
            return;
        }
        this.wardList = [];
        data.forEach(element => {
            if (element['临床类型'] == '临床') {
                this.wardList.push({'label': element['科室名称'], 'value': element['科室ID']});
            }
        });
        this.wardList.unshift({label: '全院', value: '*'});
    }

    /**
     * 表格中下拉框回显
     * @param data
     */
    public findLabel(value, columnName) {
        let item = null;
        switch (columnName) {
            case '护理级别':
                item = this.nuringLevels.find((item) => (item.value === value));
                break;
            case '病情级别':
                item = this.illnessLevels.find((item) => (item.value === value));
                break;
            default:
                item = this.freqCom.find((item) => (item.value === value));
                break;
        }
        if (item) {
            return item.label;
        }
    }

    public queryConfig() {
        this.loadingService.loading(true);
        this.signsService.getConfig(this.selectedWard, this.hospitalInfo.hosNum, this.hospitalInfo.nodeNum, this.newBornConfig).then(data => {
            if (data['code'] == '10000') {
                this.dealConfigData( data['data']);
            } else {
                this.growlMessageService.showErrorInfo('', data['msg'] || '获取体征规则配置数据失败！');
            }
            this.loadingService.loading(false);
        }, (msg) => {
            this.growlMessageService.showErrorInfo('', msg);
            this.loadingService.loading(false);
        });
    }

    /**
     * 当病区发生变化时查询数据
     * @param e
     */
    public changeWard(e) {
        this.queryConfig();
    }

    /**
     * 选中的类型全院或者科室
     * @param type
     */
    public onSelectType(type) {
        if (type === '1') {
            this.selectedWard = '*';
            this.wardComDisable = true;
            this.queryConfig();
        } else {
            this.wardComDisable = false;
        }
    }

    private getWardComboxData() {
        this.loadingService.loading(true);
        this.sysParamService.getHospitalInfo(this.hospitalInfo.areaCode, this.hospitalInfo.hosNum, this.hospitalInfo.nodeNum).then(
            data => {
                const resultList = data['病区列表'];
                this.initWardListOptions(resultList);
                this.loadingService.loading(false);
            }
        );
    }


    public dealConfigData(data: any[]) {
        if (!data || data.length == 0) {
            return;
        }
        this.configList = data;

        // 默认规则
        this.defaultData = this.configList.find((item) => (item.来源类型 === '默认'));
        this.defaultItems = (this.defaultData.vitalSignsRegs || []).filter((item)=>item['体征名称']!=null);

        // 入院规则
        this.admissionData = this.configList.find((item) => (item.来源类型 === '入院'));
        this.admissionItems = (this.admissionData.vitalSignsRegs || []).filter((item)=>item['体征名称']!=null);
        this.admissionHours = this.admissionData.小时数;

        // 转入规则
        this.transferData = this.configList.find((item) => (item.来源类型 === '转入'));
        this.transferItems = (this.transferData.vitalSignsRegs || []).filter((item)=>item['体征名称']!=null);
        this.transferHours = this.transferData.小时数;

        // 发热规则
        let fever: ConfigDict[] = this.configList.filter((item) => (item.来源类型 === '发热'));
        this.initFever(fever);

        // 护理规则
        let nurse: ConfigDict[] = this.configList.filter((item) => (item.来源类型 === '护理'));
        this.initNursing(nurse);

        // 病情规则
        let illnessArr: ConfigDict[] = this.configList.filter((item) => (item.来源类型 === '病情'));
        this.initIllness(illnessArr);
        // 年龄规则
        let ageArr: ConfigDict[] = this.configList.filter((item) => (item.来源类型 === '年龄'));
        this.initAge(ageArr);

        // 手术规则
        let operationArr: ConfigDict[] = this.configList.filter((item) => (item.来源类型 === '手术'));
        this.initOperation(operationArr);

        // 体重规则
        let weight: ConfigDict = this.configList.find((item) => (item.来源类型 === '体重'));
        this.weightData = weight;
        this.weightDays = weight.下限;
        this.weightWay = weight.项目类型;

        // 移除上个页面存在问题数据样式
        this.removeInvalidClass();
    }

    /**
     * 移除页面上问题数据的标记样式
     */
    private removeInvalidClass() {
        let invalidInputs = document.getElementsByClassName('invalid');
        for (let i = 0; i < invalidInputs.length; ) {
            invalidInputs[i].classList.remove('invalid');
        }
    }
    /**
     * 初始化发热数据列及数据
     * @param {ConfigDict[]} data
     */
    private initFever(data: ConfigDict[]) {
        let flag = true;
        let me = this;
        this.feverColums = [];
        this.feverData = [];
        data.forEach((item) => {
            let dataRow: any = {};
            if (flag) {
                me.feverColums.push({header: '名称', field: '来源名称', type: 'input', signFlag: '0'});
                me.feverColums.push({header: '上限体温', field: '上限', type: 'temperature', signFlag: '0'});
                me.feverColums.push({header: '下限体温', field: '下限', type: 'temperature', signFlag: '0'});
                me.feverColums.push({header: '小时', field: '小时数', type: 'hours', signFlag: '0'});
                item.vitalSignsRegs.forEach((coulmns) => {
                    me.feverColums.push({
                        header: coulmns.体征名称,
                        field: coulmns.体征代码,
                        type: 'ComboBox',
                        signFlag: '1'
                    });
                });
                flag = false;
            }
            // 如果当前记录主键不为-1时加载历史记录
            if (item._id) {
                dataRow._id = item._id;
                dataRow.来源代码 = item.来源代码;
                dataRow.来源名称 = item.来源名称;
                dataRow.来源类型 = item.来源类型;
                dataRow.上限 = item.上限;
                dataRow.下限 = item.下限;
                dataRow.小时数 = item.小时数;
                item.vitalSignsRegs.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = coulmns.频率代码;
                });
                me.feverData.push(dataRow);
            }
        });
    }

    /**
     * 初始化年龄数据列及数据
     * @param {ConfigDict[]} data
     */
    private initAge(data: ConfigDict[]) {
        let flag = true;
        let me = this;
        this.ageColums = [];
        this.ageData = [];
        data.forEach((item) => {
            let dataRow: any = {};
            if (flag) {
                me.ageColums.push({header: '名称', field: '来源名称', type: 'input', signFlag: '0'});
                me.ageColums.push({header: '起始年龄', field: '下限', type: 'age', signFlag: '0'});
                me.ageColums.push({header: '结束年龄', field: '上限', type: 'age', signFlag: '0'});
                me.ageColums.push({header: '单位', field: '项目单位', type: 'input', signFlag: '0'});
                item.vitalSignsRegs.forEach((coulmns) => {
                    me.ageColums.push({
                        header: coulmns.体征名称,
                        field: coulmns.体征代码,
                        type: 'ComboBox',
                        signFlag: '1'
                    });
                });
                flag = false;
            }
            // 如果当前记录主键不为-1时加载历史记录
            if (item._id) {
                dataRow._id = item._id;
                dataRow.来源代码 = item.来源代码;
                dataRow.来源名称 = item.来源名称;
                dataRow.来源类型 = item.来源类型;
                dataRow.上限 = item.上限;
                dataRow.下限 = item.下限;
                dataRow.项目单位 = item.项目单位;
                item.vitalSignsRegs.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = coulmns.频率代码;
                });
                me.ageData.push(dataRow);
            }
        });
    }

    /**
     * 初始化护理数据列及数据
     * @param {ConfigDict[]} data
     */
    private initNursing(data: ConfigDict[]) {
        let flag = true;
        let me = this;
        let dataTypeArr = '';
        let dataRow: any = {};
        let singItems = null;
        this.nursingColums = [];
        this.nursingData = [];
        data.forEach((item) => {
            dataRow = {};
            if (flag) {
                me.nursingColums.push({header: '名称', field: '来源名称', type: 'input', signFlag: '0'});
                me.nursingColums.push({header: '护理级别', field: '项目类型', type: 'ComboBox', signFlag: '0'});
                item.vitalSignsRegs.forEach((coulmns) => {
                    me.nursingColums.push({
                        header: coulmns.体征名称,
                        field: coulmns.体征代码,
                        type: 'ComboBox',
                        signFlag: '1'
                    });
                });
                flag = false;
                singItems = item.vitalSignsRegs;
            }
            // 如果当前记录主键不为-1时加载历史记录
            if (item._id) {
                dataRow._id = item._id;
                dataRow.来源代码 = item.来源代码;
                dataRow.来源名称 = item.来源名称;
                dataRow.来源类型 = item.来源类型;
                dataRow.项目类型 = item.项目类型;
                item.vitalSignsRegs.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = coulmns.频率代码;
                });
                me.nursingData.push(dataRow);
                dataTypeArr = dataTypeArr + item.项目类型 + ',';
            }
        });

        // 生成病情中没有记录的项目记录
        this.nuringLevels.forEach(x => {
            dataRow = {};
            if (dataTypeArr.indexOf(x.value) < 0) {
                // dataRow._id = me.getNewId(me.nursingData);
                dataRow.来源代码 = '';
                dataRow.来源名称 = x.label;
                dataRow.来源类型 = '护理';
                dataRow.项目类型 = x.value;
                singItems.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = '';
                });
                me.nursingData.push(dataRow);
            }
        });
    }

    /**
     * 初始化手术数据列及数据
     * @param {ConfigDict[]} data
     */
    private initOperation(data: ConfigDict[]) {
        let flag = true;
        let me = this;
        this.operationColums = [];
        this.operationData = [];
        data.forEach((item) => {
            let dataRow: any = {};
            if (flag) {
                me.operationColums.push({header: '名称', field: '来源名称', type: 'input', signFlag: '0'});
                me.operationColums.push({header: '手术级别', field: '项目类型', type: 'input', signFlag: '0'});
                me.operationColums.push({header: '手术期', field: '手术阶段', type: 'input', signFlag: '0'});
                me.operationColums.push({header: '小时', field: '小时数', type: 'hours', signFlag: '0'});
                item.vitalSignsRegs.forEach((coulmns) => {
                    me.operationColums.push({
                        header: coulmns.体征名称,
                        field: coulmns.体征代码,
                        type: 'ComboBox',
                        signFlag: '1'
                    });
                });
                flag = false;
            }
            if (!item._id) {
                // dataRow._id = item._id;
                dataRow.来源代码 = item.来源代码;
                dataRow.来源名称 = item.来源名称;
                dataRow.来源类型 = item.来源类型;
                dataRow.项目类型 = 'X';
                dataRow.手术阶段 = '术后';
                dataRow.小时数 = 0;
                item.vitalSignsRegs.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = '';
                });
            } else {
                dataRow._id = item._id;
                dataRow.来源代码 = item.来源代码;
                dataRow.来源名称 = item.来源名称;
                dataRow.来源类型 = item.来源类型;
                dataRow.项目类型 = item.项目类型;
                dataRow.手术阶段 = item.手术阶段;
                dataRow.小时数 = item.小时数;
                item.vitalSignsRegs.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = coulmns.频率代码;
                });
            }

            me.operationData.push(dataRow);
        });
    }

    /**
     * 初始化病情数据列及数据
     * @param {ConfigDict[]} data
     */
    private initIllness(data: ConfigDict[]) {
        let flag = true;
        let me = this;
        let dataTypeArr = '';
        let dataRow: any = {};
        let singItems = null;
        this.illnessColums = [];
        this.illnessData = [];

        // 创建列头以及加载历史数据
        data.forEach((item) => {
            dataRow = {};
            // 默认第一条数据加载列头
            if (flag) {
                singItems = item.vitalSignsRegs;
                me.illnessColums.push({header: '名称', field: '来源名称', type: 'input', signFlag: '0'});
                me.illnessColums.push({header: '病情级别', field: '项目类型', type: 'ComboBox', signFlag: '0'});
                item.vitalSignsRegs.forEach((coulmns) => {
                    me.illnessColums.push({
                        header: coulmns.体征名称,
                        field: coulmns.体征代码,
                        type: 'ComboBox',
                        signFlag: '1'
                    });
                });
                flag = false;
            }
            // 如果当前记录主键不为-1时加载历史记录
            if (item._id) {
                dataRow._id = item._id;
                dataRow.来源代码 = item.来源代码;
                dataRow.来源名称 = item.来源名称;
                dataRow.来源类型 = item.来源类型;
                dataRow.项目类型 = item.项目类型;
                item.vitalSignsRegs.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = coulmns.频率代码;
                });
                me.illnessData.push(dataRow);
                dataTypeArr = dataTypeArr + item.项目类型 + ',';
            }
        });

        // 生成病情中没有记录的项目记录
        this.illnessLevels.forEach(x => {
            dataRow = {};
            if (dataTypeArr.indexOf(x.value) < 0) {
                dataRow.来源代码 = '';
                dataRow.来源名称 = x.label;
                dataRow.来源类型 = '病情';
                dataRow.项目类型 = x.value;
                singItems.forEach((coulmns) => {
                    dataRow[coulmns.体征代码] = '';
                });
                me.illnessData.push(dataRow);
            }
        });
    }

    /**
     *  保存数据
     * @param type
     */
    public save(type) {
        this.saveArr = [];
        this.saveFlag = true;
        switch (type) {
            case '默认':
                this.getDefalutData();
                break;
            case '转入':
                this.getTransferData();
                break;
            case '入院':
                this.getAdmissionData();
                break;
            case '发热':
                this.getFeverData();
                break;
            case '手术':
                this.getOperationData();
                break;
            case '护理':
                this.getNursingData();
                break;
            case '病情':
                this.getillnessData();
                break;
            case '年龄':
                this.getAgeData();
                break;
            case '体重':
                this.getWeightData();
                break;
        }
        // 当前类型设置体征字典个数，如果一个都没有设置
        if (!this.saveFlag) {
            return;
        }
        if (this.saveArr.length === 0) {
            this.growlMessageService.showDefaultInfo('没有需要保存的数据！');
            return;
        }
        this.loadingService.loading(true);
        this.signsService.SaveConfig(this.selectedWard, this.saveArr, this.hospitalInfo.hosNum).then(data => {
            if (data['code'] == '10000') {
                this.growlMessageService.showSuccessInfo('保存成功！');
                this.queryConfig();
            } else {
                this.growlMessageService.showErrorInfo('', data['msg'] || '保存失败！');
            }
            this.loadingService.loading(false);
        }, (error) => {
            this.loadingService.loading(false);
            this.growlMessageService.showErrorInfo('', error || '请求响应失败');
        });
    }

    /**
     * 获取默认数据
     */
    private getDefalutData() {
        const item = Object.assign({}, this.defaultData);
        item.来源代码 = '1';
        item.病区ID = this.selectedWard;
        item.医院编码 = this.hospitalInfo.hosNum;
        item.vitalSignsRegs = this.defaultItems.filter((defItem: any) => KyeeUtils.isNotEmpty(defItem['频率代码']));
        item.类型 = this.newBornConfig?"新生儿":"成人";
        this.saveArr.push(item);
    }

    /**
     * 获取转入数据
     */
    private getTransferData() {
        // 判断小时数是否合法
        if (!this.checkInput(this.transferHours, 'hours')) {
            this.growlMessageService.showWarningInfo('转入规则中小时未填写或者填写不规范！');
            this.saveFlag = false;
            return;
        }
        const _item = Object.assign({}, this.transferData);
        _item.来源代码 = '2';
        _item.项目类型 = _item.项目类型 || '1';
        _item.小时数 = this.transferHours;
        _item.病区ID = this.selectedWard;
        _item.vitalSignsRegs = this.transferItems.filter((defItem: any) => KyeeUtils.isNotEmpty(defItem['频率代码']));
        _item.医院编码 = this.hospitalInfo.hosNum;
        _item.类型 = this.newBornConfig?"新生儿":"成人";
        this.saveArr.push(_item);
    }

    /**
     * 获取入院数据
     */
    private getAdmissionData() {
        // 判断小时数是否为空
        if (!this.checkInput(this.admissionHours, 'hours')) {
            this.growlMessageService.showWarningInfo('入院规则小时值输入不规范!');
            this.saveFlag = false;
            return;
        }
        const _item = Object.assign({}, this.admissionData);
        _item.来源代码 = '1';
        _item.项目类型 = _item.项目类型;
        _item.小时数 = this.admissionHours;
        _item.病区ID = this.selectedWard;
        _item.vitalSignsRegs = this.admissionItems.filter((defItem: any) => KyeeUtils.isNotEmpty(defItem['频率代码']));
        _item.医院编码 = this.hospitalInfo.hosNum;
        _item.类型 = this.newBornConfig?"新生儿":"成人";
        this.saveArr.push(_item);
    }

    /**
     * 获取发热数据
     */
    private getFeverData() {
        let me = this;
        this.feverData.forEach((item) => {
            // 判断数据是否合法
            if (!me.checkInput(item.来源名称, 'input') || !me.checkInput(item.下限, 'temperature') || !me.checkInput(item.上限, 'temperature') || !me.checkInput(item.小时数, 'hours')) {
                me.saveFlag = false;
                return;
            }
            const vitalSignsRegs = me.getVitalSignsRegs(me.feverColums, item);
            // 如果当前配置的体征项目为空，则提示完善配置信息
            if (KyeeUtils.isEmpty(vitalSignsRegs)) {
                me.saveFlag = false;
                return;
            }
            const _item: any = {};
            if (item._id ) {
                _item._id = item._id;
            }
            _item.来源类型 = item.来源类型;
            _item.来源代码 = '4';
            _item.来源描述 = item.来源名称 || '37.5℃以上';
            _item.项目类型 = item.项目类型;
            _item.上限 = item.上限;
            _item.下限 = item.下限;
            _item.小时数 = item.小时数;
            _item.来源名称 = item.来源名称;
            _item.病区ID = this.selectedWard;
            _item.vitalSignsRegs = vitalSignsRegs;
            _item.医院编码 = this.hospitalInfo.hosNum;
            _item.类型 = this.newBornConfig?"新生儿":"成人";
            this.saveArr.push(_item);
        });
    }

    /**
     * 获取手术数据
     */
    private getOperationData() {
        let me = this;
        this.operationData.forEach((item) => {
            // 判断数据是否合法
            if (me.checkInput(item.项目类型, 'input') && me.checkInput(item.手术阶段, 'input') && me.checkInput(item.来源名称, 'input') && me.checkInput(item.小时数, 'hours')) {
                const vitalSignsRegs = me.getVitalSignsRegs(me.operationColums, item);
                // 如果当前配置的体征项目为空，则提示完善配置信息
                if (KyeeUtils.isEmpty(vitalSignsRegs)) {
                    me.saveFlag = false;
                    return;
                }
                const _item: any = {};
                if (item._id ) {
                    _item._id = item._id;
                }
                _item.来源类型 = item.来源类型;
                _item.来源代码 = '38';
                _item.来源描述 = item.来源名称;
                _item.项目类型 = item.项目类型;
                _item.手术阶段 = item.手术阶段;
                _item.小时数 = item.小时数;
                _item.来源名称 = item.来源名称;
                _item.病区ID = me.selectedWard;
                _item.vitalSignsRegs = vitalSignsRegs;
                _item.医院编码 = me.hospitalInfo.hosNum;
                _item.类型 = this.newBornConfig?"新生儿":"成人";
                me.saveArr.push(_item);
            } else {
                me.saveFlag = false;
                return;
            }
        });
    }

    /**
     * 获取年龄数据
     */
    private getAgeData() {
        let me = this;
        this.ageData.forEach((item) => {
            // 判断数据是否合法
            if (me.checkInput(item.下限, 'age') && me.checkInput(item.上限, 'age') && me.checkInput(item.项目单位, 'input') && me.checkInput(item.来源名称, 'input')) {
                let vitalSignsRegs = me.getVitalSignsRegs(me.ageColums, item);
                // 如果当前配置的体征项目为空，则提示完善配置信息
                if (KyeeUtils.isEmpty(vitalSignsRegs)) {
                    me.saveFlag = false;
                    return;
                }
                const _item: any = {};
                if (item._id ) {
                    _item._id = item._id;
                }
                _item.来源类型 = item.来源类型;
                _item.来源代码 = '19';
                _item.来源描述 = item.来源名称;
                _item.项目类型 = item.项目类型;
                _item.上限 = item.上限;
                _item.下限 = item.下限;
                _item.项目单位 = item.项目单位;
                _item.来源名称 = item.来源名称;
                _item.病区ID = me.selectedWard;
                _item.vitalSignsRegs = vitalSignsRegs;
                _item.医院编码 = me.hospitalInfo.hosNum;
                _item.类型 = this.newBornConfig?"新生儿":"成人";
                me.saveArr.push(_item);
            } else {
                this.growlMessageService.showWarningInfo('下限或者下限或者来源名称或者项目单位不符合规范！');
                me.saveFlag = false;
                return;
            }

        });
    }

    /**
     * 获取护理数据
     */
    private getNursingData() {
        for (let i = 0; i < this.nursingData.length; i++) {
            let item: ConfigDict = this.nursingData[i];
            // 判断数据是否合法
            if (KyeeUtils.isEmpty(item.项目类型) && this.checkInput(item.来源名称, 'input')) {
                this.growlMessageService.showWarningInfo('项目类型为空、或者来源名称输入不规范！');
                this.saveFlag = false;
                break;
            }
            let vitalSignsRegs = this.getVitalSignsRegs(this.nursingColums, item);
            // 如果当前配置的体征项目为空，则提示完善配置信息
            if (KyeeUtils.isEmpty(vitalSignsRegs)) {
                continue; // 如果为空则跳过
            }
            const _item: any = {};
            if (item._id ) {
                _item._id = item._id;
            }
            _item.来源类型 = item.来源类型;
            _item.来源代码 = '19';
            _item.来源描述 = item.来源名称;
            _item.项目类型 = item.项目类型;
            _item.来源名称 = item.来源名称;
            _item.病区ID = this.selectedWard;
            _item.vitalSignsRegs = vitalSignsRegs;
            _item.医院编码 = this.hospitalInfo.hosNum;
            _item.类型 = this.newBornConfig?"新生儿":"成人";
            this.saveArr.push(_item);
        }
    }

    /**
     * 获取病情数据
     */
    private getillnessData() {
        let me = this;
        for (let i = 0; i < this.illnessData.length; i++) {
            let item: ConfigDict = this.illnessData[i];
            // 判断数据是否合法
            if (KyeeUtils.isEmpty(item.项目类型) && me.checkInput(item.来源名称, 'input')) {
                me.saveFlag = false;
                break;
            }
            let vitalSignsRegs = this.getVitalSignsRegs(me.illnessColums, item);
            // 如果当前配置的体征项目为空，则提示完善配置信息
            if (KyeeUtils.isEmpty(vitalSignsRegs)) {
                continue; // 如果未空则跳过
            }
            const _item: any = {};
            if (item._id ) {
                _item._id = item._id;
            }
            _item.来源类型 = item.来源类型;
            _item.来源代码 = '19';
            _item.来源描述 = item.来源名称;
            _item.项目类型 = item.项目类型;
            _item.来源名称 = item.来源名称;
            _item.病区ID = me.selectedWard;
            _item.vitalSignsRegs = vitalSignsRegs;
            _item.医院编码 = me.hospitalInfo.hosNum;
            _item.类型 = this.newBornConfig?"新生儿":"成人";
            me.saveArr.push(_item);
        }
    }

    /**
     * 保存体重
     */
    private getWeightData() {
        // 判断数据是否合法
        if (KyeeUtils.isEmpty(this.weightWay) || !this.checkInput(this.weightDays, 'hours')) {
            this.growlMessageService.showWarningInfo('体重规则中项目类型未选择或者时间间隔填写不规范！');
            this.saveFlag = false;
            return;
        }
        let _item = Object.assign({}, this.weightData);
        _item.项目类型 = this.weightWay;
        _item.下限 = this.weightDays;
        _item.病区ID = this.selectedWard;
        _item.类型 = this.newBornConfig?"新生儿":"成人";
        this.saveArr.push(_item);
    }

    /**
     * 获取体征配置数据
     * @param sings
     * @param isGrid
     * @param gridData
     * @returns
     */
    private getVitalSignsRegs(sings: any[], gridData: any) {
        const vitalSignsRegs = [];
        sings.forEach((sign) => {
            if (sign.signFlag === '1' && KyeeUtils.isNotEmpty(gridData[sign.field])) {
                vitalSignsRegs.push({
                    体征代码: sign.field,
                    频率代码: gridData[sign.field],
                    体征名称: sign.header
                });
            }
        });
        return vitalSignsRegs;
    }

    /**
     * 获取主表数据
     * @param recId
     * @param type
     * @param sourceCode
     * @param sourceDesc
     * @param sourceName
     * @param xmlStr
     */
    private getMainRecValues(recId, type, sourceCode, sourceDesc, sourceName, vitalSignsRegs) {
         const item: any = {};

        item._id = recId;
        item.来源类型 = type;
        item.来源代码 = sourceCode;
        item.来源描述 = sourceDesc;
        item.来源名称 = sourceName;
        item.病区ID = this.selectedWard;
        item.vitalSignsRegs = vitalSignsRegs;
        item.医院编码 = this.hospitalInfo.hosNum;
        this.saveArr.push(item);
    }

    /**
     * 重置数据
     * @param selectRow 选择行
     */
    public reset(selectRow) {
        if (selectRow === undefined || selectRow === null) {
            this.growlMessageService.showDefaultInfo('请选择要重置的记录！');
            return;
        }
        // 判断是否为 '护理' OR '病情'
        if (selectRow.来源类型 === '护理' || selectRow.来源类型 === '病情') {
            if (!selectRow._id) {
                for (let key in selectRow) {
                    if (key === '_id' || key === '来源代码' || key === '来源名称' || key === '来源类型' || key === '项目类型') {
                        continue;
                    } else {
                        this.selectRow[key] = null;
                    }
                }
                this.selectRow = null;
                this.growlMessageService.showSuccessInfo('重置成功！');
            } else {
                this.deleteConfigRule();
            }
        } else {
            this.growlMessageService.showDefaultInfo('请选择要重置的护理规则或病情规则！');
            return;
        }
    }

    deleteConfigRule() {
        this.loadingService.loading(true);
        this.signsService.deleteConfig(this.selectRow._id, this.selectedWard, this.hospitalInfo.hosNum).then(data => {
            if (data['code'] == '10000') {
                this.queryConfig();
                this.growlMessageService.showSuccessInfo( data['msg'] || '删除成功！');
            } else {
                this.growlMessageService.showErrorInfo('', data['msg'] || '删除失败！');
            }
            this.loadingService.loading(false);
        }, (error) => {
            this.loadingService.loading(false);
            this.growlMessageService.showErrorInfo('', error || '请求响应失败');
        });
    }

    /**
     * 删除数据
     * @param type 数据类型
     */
    public delRule(type) {

        if (this.selectRow && (this.selectRow.来源类型 === '发热' || this.selectRow.来源类型 === '年龄')) {

            // 判断当前点击的删除按钮是否是选中行所在记录的删除按钮
            if (this.selectRow.来源类型 !== type) {
                this.growlMessageService.showWarningInfo('请选择要删除的记录！');
                return;
            }

            // 从前台数组中删除未保存到数据库中的记录
            if (!this.selectRow._id) {
                if (type === '发热') {
                    this.feverData.splice(this.feverData.indexOf(this.selectRow), 1);
                }else if (type === '年龄') {
                    this.ageData.splice(this.ageData.indexOf(this.selectRow), 1);
                }
                this.growlMessageService.showSuccessInfo('删除成功！');
            } else {
               this.deleteConfigRule();
            }
        } else {
            this.growlMessageService.showDefaultInfo('请选择要删除的记录！');
        }
    }

    /**
     *
     * @param type 数据类型
     */
    public addRule(type) {
        let dataRow: any = {};

        if (type === '发热') {
            dataRow.来源代码 = '4';
            dataRow.来源名称 = '37.5℃以上';
            dataRow.来源类型 = '发热';
            dataRow.上限 = 37;
            dataRow.下限 = 37;
            dataRow.小时数 = 0;
            let singsItems = this.feverColums.filter((x) => x.signFlag === '1');
            singsItems.forEach((coulmns) => {
                dataRow[coulmns.field] = '';
            });
            this.feverData.push(dataRow);
        } else if (type === '年龄') {
            dataRow.来源代码 = '4';
            dataRow.来源名称 = '';
            dataRow.来源类型 = '年龄';
            dataRow.上限 = 0;
            dataRow.下限 = 0;
            dataRow.项目单位 = '年';
            let singsItems = this.feverColums.filter((x) => x.signFlag === '1');
            singsItems.forEach((coulmns) => {
                dataRow[coulmns.体征代码] = '';
            });
            this.ageData.push(dataRow);
        }
    }

    /**
     * 获取新增记录ID
     * @param {any[]} data
     * @returns {number}
     */
    private getNewId(data: any[]) {
        let lowID = 0;
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                lowID = data[0]._id || 0;
            }
            if (data[i].SERIAL_NO < lowID) {
                lowID = data[i]._id;
            }
        }
        if (lowID > -1) {
            return -1;
        } else {
            return lowID - 1;
        }
    }


    /**
     * 点击设置时间点按钮
     */
    public setTimePoint(display) {
        this.signsService.queryTimePoint(this.hospitalInfo.hosNum,this.newBornConfig).then(data => {
            if (data['code'] == '10000') {
                this.getTimePointSuccess(data['data'],display);
            } else {
                this.growlMessageService.showErrorInfo('', data['msg'] || '获取时间点配置信息失败！');
            }
        }, (msg) => {
            this.growlMessageService.showErrorInfo('', msg);
        });
    }

    /**
     * 获取时间点成功后处理时间点数据集
     * @param data
     */
    public getTimePointSuccess(data: any,display) {
        this.display = display; // 显示时间点配置框
        if (!data || data.length == 0) {
            this.timePonitSource = [];
            this.timePointData = {};
            let me = this;
            this.freqCom = [{label: ' ', value: ''},
            {label: '日一', value: '1'},
            {label: '日二', value: '2'},
            {label: '日三', value: '3'},
            {label: '日四', value: '4'},
            {label: '日五', value: '5'},
            {label: '日六', value: '6'},
            {label: '日十二', value: '12'}];
        }else{
            this.timePonitSource = data;
            this.timePointData = {};
            let me = this;
            this.freqCom.forEach((item) => {
                let freq: any = data.find(x => Number(x.频次代码) === Number(item.value));
                if (freq && freq.频次内容) {
                    me.timePointData['day' + item.value] = freq.频次内容;
                } else {
                    me.timePointData['day' + item.value] = '';
                }
            });
        }
        this.queryConfig();
    }

    /**
     * 保存时间点配置
     */
    public saveTimePoint() {
        // 检测是否有不合法数据
        let dialog = document.getElementById('dialog');
        let invalidInput = dialog.getElementsByClassName('invalid');
        if (invalidInput.length > 0) {
            this.growlMessageService.showWarningInfo('数据填写有误，请按照文本框中提示格式正确书写！');
            return;
        }
        let timePointArr: any[] = [];
        let me = this;
        this.freqCom.forEach((item) => {
            let str = me.timePointData['day' + item.value] || '';
            str = str.replace(/，/g, ','); // 替换所有的中文逗号

            // 判断当前时间点是否已经存在保存记录，如果存在则直接保存时间点
            let freq: any = me.timePonitSource.find(x => Number(x.频次代码) === Number(item.value));
            if (freq) {
                freq.频次内容 = str;
                freq.类型 = this.newBornConfig?"新生儿":"成人";
                timePointArr.push(freq);
            } else {
                timePointArr.push({
                    频次代码: item.value,
                    频次名称: '常规测' + item.label,
                    频次内容: str,
                    // THEME_CODE: '1',
                    // 病区ID: '*',
                    // FREQ_DESC: '',
                    // FREQ_FLAG: '常规',
                    医院编码: me.hospitalInfo.hosNum,
                    类型:this.newBornConfig?"新生儿":"成人"
                });
            }
        });

        this.signsService.saveTimePoint(timePointArr).then(data => {
            if (data['code'] == 10000) {
                this.display = false;
                this.growlMessageService.showSuccessInfo('保存成功！');
            } else {
                this.growlMessageService.showErrorInfo('', data['msg'] || '保存失败！');
            }
        }, (msg) => {
            this.growlMessageService.showErrorInfo('', msg);
        });
    }


    /**
     * 校验体温单表格录入区域输入是否合法
     * @param event
     * @param timePointType 时间点
     * @param value 输入框value
     * @param isGrid 是否是表格中的input框
     */
    public cellEditorChange(event, timePointType, value, isGrid) {

        let target = event.target;
        let errorMsg = '数据输入有误';
        let regExp = null;

        switch (timePointType) {
            case 'day1':
                regExp = '^([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'day2':
                regExp = '^([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'day3':
                regExp = '^([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'day4':
                regExp = '^([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'day5':
                regExp = '^([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'day6':
                regExp = '^([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'day12':
                regExp = '^([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])[\,,\，]([0-9]|1[0-9]|2[0-3])$';
                break;
            case 'hours':
                regExp = '^[+]{0,1}[0-9]{1,3}$|^[+]{0,1}[0-9]{1,3}.[0-9]{1}$';
                break;
            case 'temperature': // 校验体温输入框
                regExp = '^(3([5-9])|4([0-3]))(\\.[0-9])?$';
                errorMsg = '体温应在35.0~43.9之间';
                break;
            case 'age': // 校验年龄输入框
                regExp = '^(?:[1-9]?\\d|1\\d{1,2})$';
                errorMsg = '请输入合法的年龄值';
                break;
            case 'input': // 校验文本输入框
                regExp = '^.{1,10}$';
                errorMsg = '输入内容不合法';
                break;
            default:
                regExp = '^.{1,10}$';
                errorMsg = '输入内容不合法';
                break;
        }

        let reg = new RegExp(regExp);

        if (reg.test(value)) {
            // 在表格中需要取父级标签进行标记
            if (isGrid) {
                let tdElem = target.parentElement.parentElement;
                tdElem.classList.remove('invalid');
            }
            // 给对象添加
            event.target.classList.remove('invalid');
            this.toolTip = '';
        } else {
            // 在表格中需要取父级标签进行标记
            if (isGrid) {
                let tdElem = target.parentElement.parentElement;
                tdElem.classList.add('invalid');
            }
            event.target.classList.add('invalid');
            this.toolTip = errorMsg;
        }
    }

    /**
     * 根据数据类型检查输入的数据是否合法
     * @param {string} value 校验的值
     * @param {string} valType 检验的值类型
     */
    private checkInput(value: any, valType: string) {
        let regExp = '';
        switch (valType) {
            case 'input':
                regExp = '^.{1,10}$';
                break;
            case  'temperature':
                regExp = '^(3([5-9])|4([0-3]))(\\.[0-9])?$';
                break;
            case  'hours':
                regExp = '^[+]{0,1}[0-9]{1,3}$|^[+]{0,1}[0-9]{1,3}.[0-9]{1}$';
                break;
            case  'age':
                regExp = '^(?:[1-9]?\\d|1\\d{1,2})$';
                break;
            default:
                regExp = '^.{1,10}$';
                break;
        }
        let reg = new RegExp(regExp);
        if (reg.test(value + '')) {
           return true;
        }else {
            return false;
        }
    }

    selectNewborn(){
        this.newBornConfig = !this.newBornConfig;
        this.setTimePoint(false);
    }
}
