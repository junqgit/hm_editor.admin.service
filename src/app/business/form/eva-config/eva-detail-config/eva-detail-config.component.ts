
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EvaConfigService } from '../eva-config.service';
import { AuthTokenService } from '../../../../basic/auth/authToken.service';
import { ConfirmationService } from 'portalface/widgets';
import { UtilTools } from '../../../../common/lib/Util';
import * as _ from 'underscore';
@Component({
    selector: 'kyee-eva-detail-config',
    templateUrl: './eva-detail-config.component.html',
    styleUrls: ['./eva-detail-config.component.scss'],
    providers: [EvaConfigService]
})
export class EvaDetailConfigComponent implements OnInit {

    @Input() nursingFromData: object;
    formId: string;

    formData: any[];

    cols: any[];
    selectedNode: object;



    dpDlg: boolean;
    buttonCols: any[];
    popType: string;
    popDpList: any[];
    popBindData: object;


    msgs: any[];
    ds: any[];
    filterDs: any[];
    cs: object = {};
    popTitle:string;

    defineDropDs = {};
    constructor(private authTokenService: AuthTokenService, private evaConfigService: EvaConfigService, private confirmationService: ConfirmationService, private ref: ChangeDetectorRef) {


    }

    ngOnInit() {
        this.initDataSource();
        this.formId = this.nursingFromData['_id'];
    }

    initTemplateDs(callback){
        this.evaConfigService.getTemplateDs(this.nursingFromData['REPORT_NAME']).then(d => {
            if (d['code'] != '10000') {
                this.showMessage('error', '', '获取模版上已维护的数据元异常');
            }
            this.defineDropDs = (d['data'] || []).reduce((p,c) => {
                if(c['data-kyee-items']){
                    let items_arr = [];
                    c['data-kyee-items'].split('#').forEach(vl => {
                        if(vl.indexOf('(') > -1 && vl.indexOf(')') > -1){
                            let vls = vl.split(/\(/);
                            let _vl = vls[vls.length - 1].split(')')[0];
                            items_arr.push({"val":vls[0],"description":_vl});
                        }else{
                            items_arr.push({"description":vl,"val":vl});
                        }
                    });
                    if(items_arr.length > 0){
                        p[c['name']] = items_arr;
                    }
                    
                }
                return p;
            },{})
            callback && callback();
        });
    }
    initSetDs(callback){

        this.evaConfigService.getSetDsList(this.nursingFromData['REPORT_NAME']).then(d => {
            if (d['code'] != '10000') {
                this.showMessage('error', '', '获取标准数据元异常');
            }
            let ds = (d['data'] || []).reduce((p, c) => {
                let n = c['name'].replace('[$日期_时间$]','');
                
                let ncode = this.emrDsType2NurseType(c);
                
                let items_arr = null;
                if(ncode == '下拉框'){
                    items_arr = [];
                    (c['dictList']||[]).forEach(vl => {
                        items_arr.push({"uid":Math.random(),"显示值":vl['val']});
                    });
                }
                
                if(items_arr){
                    p.push({ "label": n, "value": n,   "ncode": ncode ,"ITEMS_ARR":items_arr});
                }else{
                    p.push({ "label": n, "value": n,  "ncode": ncode });
                }
                
                return p;
            }, [{ "label": "", "value": "", "type": "", "code": "", "ncode": "" }])
            this.ds = ds;
            callback && callback();
        })
    }


    initDataSource() {
        this.initTemplateDs( () => {
            this.initSetDs( () => {
                this.cols = [
                    // { "field": "WIDGET_ID", "header": "" },
                    // { "field": "REPORT_ID", "header": "" },
                    { "field": "WIDGET_TYPE", "header": "控件类型", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["文本框(只读)", "文本框", "下拉框", "可选可输", "多选可输", "多选不可输", "日期时间", "日期", "时间", "自定义", "跳转表单", "拍摄照片"]) },
                    { "field": "WIDGET_NAME", "header": "控件名", "editor": true, "type": "dropdown", "options": this.ds, filter: true },
                    { "field": "WIDGET_SHOW_NAME", "header": "控件显示名", "editor": true },
                    { "field": "WIDGET_WIDTH", "header": "宽度", "editor": true },
                    { "field": "ITEMS", "header": "下拉数据", "editor": true, "type": "button" },
                    { "field": "REGULAR", "header": "等级规则", "editor": true, "type": "button" },
                    { "field": "BOUND_TERMS", "header": "约束项", "editor": true, "type": "button" },
                    // { "field": "BOUND_TERMS_VISITY", "header": "约束项显示项" },
                    { "field": "SHOW_INDEX", "header": "排序", "editor": true },
                    { "field": "AGGREGATE_SCORE", "header": "总分", "editor": true, "type": "dropdown", "options": this.ds },
                    { "field": "RULES_CONSTRAINT", "header": "等级项目", "editor": true, "type": "dropdown", "options": this.ds },
                    { "field": "MEASURES_CONSTRAINT", "header": "所属措施", "editor": true },
                    // { "field": "NURSING_UNIT", "header": "所属科室" },
                    { "field": "NOTE", "header": "所属项目", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["", "第一部分", "第二部分", "第三部分"]) },
                    { "field": "WIDGET_DEFAULT", "header": "默认值", "editor": true },
                    { "field": "WIDGET_SAVE", "header": "保存组件", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["是", "否"]) },
                    { "field": "ISVISITY", "header": "组件状态", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["可用", "不可编辑", "PC隐藏", "PDA隐藏", "隐藏"]) },
                    // { "field": "TEXTPDA", "header": "下拉显示数据" },
                    // { "field": "VALUEPDA", "header": "下拉隐藏数据" },
                    // { "field": "SCOREPDA", "header": "下拉数据分数" },
                    // { "field": "VALUEPRINT", "header": "报表打印值" },
                    // { "field": "LEVEL_SHOWNAME", "header": "等级显示数据" },
                    // { "field": "LEVEL_CODE", "header": "等级隐藏数据" },
                    // { "field": "LEVELSCORE_MIN", "header": "最小值" },
                    // { "field": "LEVELSCORE_MAX", "header": "最大值" },
                    // { "field": "IS_FREEZE", "header": "冻结" },
                    { "field": "REMARK", "header": "备注", "editor": true },
                    { "field": "ISSHOWEXPLAIN", "header": "是否显示说明", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["", "是", "否"]) },
                    { "field": "DETAILEXPLAIN", "header": "详细说明", "editor": true },
                    { "field": "REGULARVERIFICATION", "header": "正则表达式", "editor": true },
                    { "field": "ERRORTEXT", "header": "错误提示信息", "editor": true },
                    // 跳转表单不支持 { "field": "SKIP_REPORT", "header": "跳转表单","editor":true },
                    { "field": "DE_CATALOG", "header": "数据元目录", "editor": true },
                    { "field": "SEGMENT_NAME", "header": "段名称", "editor": true },
                    { "field": "SEGMENT_IS_MULTILINE", "header": "段内是否多行", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["", "是", "否"]) },
                    { "field": "GROUP_IS_MULTILINE", "header": "组是否多行", "editor": true, "type": "dropdown", "options": this.evaConfigService.buildDropDown(["", "是", "否"]) },
                    { "field": "In_Diagnose", "header": "关联诊断", "editor": false },
                    { "field": "In_Alert", "header": "关联预警", "editor": false },
                    // { "field": "PARENT_ID", "header": "" },
                    // { "field": "IsDataChange", "header": "" }
                ];
                this.initTableData();
            })
        })
        
    }

    initTableData() {
        this.formData = [];
        this.evaConfigService.getNursingDetail(this.nursingFromData['_id']).then(d => {
            if (d['code'] != 10000) {
                this.showMessage('error', '', '获取数据异常，请重新打开或联系运维人员');
            }
            let data = d['data'] || [];

            this.transferTableData(data);
            // data.forEach(e => {
            //     this.initRowData(e);
            // });

            // this.formData = data;
        })

    }
    transferTableData(data) {
        let me = this;
        data.forEach(d => {
            if (!d['uid']) {
                d['uid'] = d['_id'] || me.uuidGenerate(24);
            }
        });

        let root = data.filter(d => !d['PARTENT_ID']) || [];
        let children = data.filter(d => !!d['PARTENT_ID']) || [];
        // if (children.length == 0) {
        //     this.formData = root.reduce((p, c) => {
        //         p.push({ "data": c, "children": [] });
        //         return p;
        //     }, []);
        //     return;
        // }
        // 子项目

        let groupByPID = children.reduce((p, c) => {
            let pid = c['PARTENT_ID'];
            if (p[pid]) {
                p[pid].push(c);
            } else {
                p[pid] = [c];
            }
            return p;
        }, {})
        let formData = [];
        // root.forEach(r => {

        // });
        function findChildren(r, groupData) {
            let uid = r['uid'];
            let res = [];
            if (groupData[uid]) {
                let tempChildren = groupData[uid];
                res = buildTableData(tempChildren, groupData);
                delete groupData[uid];
            }
            return res;
        }
        function buildTableData(list, groupData) {
            let res = [];
            list.forEach(l => {
                let _child = findChildren(l, groupByPID);
                res.push({ "data": l, "children": _child, "expanded": true });
            });
            return res;
        }
        let res = buildTableData(root, groupByPID);

        if (Object.keys(groupByPID).length > 0) {
            Object.keys(groupByPID).forEach(p => {
                let gc = groupByPID[p] || [];
                gc.forEach(gce => {
                    delete gce['PARTENT_ID'];
                });
                res = res.concat(buildTableData(gc, groupByPID));
            })
        }
        this.formData = res;


    }

    addChildRow(){
        if(!this.selectedNode){
            this.showMessage('info', '', '请先选择需要增加子项目的行');
            return;
        }
        if(this.selectedNode['data']['READONLY']){
            this.showMessage('info', '', '当前行不允许增加子项目');
            return;
        }
        this.doAddRow();
    }
    addRow() {
        this.selectedNode = null;
        this.doAddRow();
    }
    doAddRow(){
        let row = { "data": { "WIDGET_SAVE": "是", "ISVISITY": "可用", "uid": this.uuidGenerate(24), "SHOW_INDEX": this.formData.length + 1, "REPORT_ID": this.formId, "WIDGET_WIDTH": "0" }, "children": [] };
        if (this.selectedNode && !this.selectedNode['data']['READONLY']) {
            row['data']['PARTENT_ID'] = this.selectedNode['data']['uid']
            row['data']['SHOW_INDEX'] = this.selectedNode['data']['SHOW_INDEX']
            this.selectedNode['children'].push(row);
            this.selectedNode['expanded'] = true;
        } else {
            this.formData.push(row);
        }
        this.formData = [...this.formData];
        this.selectedNode = null;
    }
    delRow() {
        if (!this.selectedNode) {
            this.showMessage('info', '', '请先选择需要删除的数据');
            return;
        }

        let childFlag = this.selectedNode['children'] && this.selectedNode['children'].length > 0;

        let me = this;
        let data = this.selectedNode['data'];
        this.confirmationService.confirm({
            header: '确认删除',
            message: '确认删除此配置？',
            accept: () => {
                if (data['_id']) {
                    this.evaConfigService.delNursingDetail(data['_id']).then(d => {
                        if (d['code'] == '10000') {
                            this.doDelTableRow(data['uid'], data['PARTENT_ID'] || '');
                            this.showMessage('success', '', '删除成功');
                        } else {
                            this.showMessage('error', '', '删除失败');
                        }
                        this.formData = [...this.formData];
                    })
                } else {
                    this.doDelTableRow(data['uid'], data['PARTENT_ID'] || '');
                    this.showMessage('success', '', '删除成功');
                    this.formData = [...this.formData];
                }
                //   let d = this.expandTableData(this.deepCopyTableData());
                //   this.transferTableData(d);
            }
        });

    }
    doDelTableRow(uid, pid) {
        function findAndDel(children, index) {
            let d = children[index];
            if (d['data']['uid'] == uid) {
                let dChild = d['children'] || [];
                if (dChild.length > 0) {
                    dChild.forEach(dce => {
                        // if(pid){
                        //     dce['data']['PARENT_ID'] = pid;
                        // }else{
                        //     delete dce['data']['PARENT_ID'];
                        // }
                        // 删除父项目，子项目变父项目
                        delete dce['data']['PARTENT_ID'];
                        delete dce['parent'];
                    });
                }
                children.splice(index, 1, ...dChild);
                return true;
            }
            return find(d['children'] || []);

        }

        function find(children) {
            for (let i in children) {
                if (findAndDel(children, i)) {
                    return true;
                }
            }
            return false;
        }
        find(this.formData || []);

    }
    saveAll() {
        let d = this.expandTableData(this.deepCopyTableData());
        if (!this.checkSaveData(d)) {
            return;
        }
        this.evaConfigService.saveNursingDetail(d).then(r => {
            if (r['code'] == '10000') {
                this.showMessage('success', '', '保存成功');
                this.initTableData();
            } else {
                this.showMessage('error', '', '保存失败');
            }
        })
    }

    deepCopyTableData() {
        return [...this.formData];
        // let cache = [];
        // let formDataTemp = JSON.parse(JSON.stringify(this.formData, function (key, value) {
        //     if (typeof value === 'object' && value !== null) {
        //         if (cache.indexOf(value) !== -1) {
        //             return;
        //         }
        //         cache.push(value);
        //     }
        //     return value;
        // }));
        // cache = null;
        // return formDataTemp;
    }
    expandTableData(data) {
        let d = [];

        let l = data.length;
        for (let i = 0; i < l; i++) {
            let _d = this.expandRow(data[i]);
            if (!_d) {
                return;
            }
            d = d.concat(_d);
        }
        return d;
    }
    checkSaveData(data) {
        for (let i in data) {
            let d = data[i];
            if (!d['READONLY'] && d['SHOW_INDEX'] < 5) {
                this.showMessage('error', '', '自定义字段排序只能为大于4的数');
                return false;
            }
            delete d['_id'];
        }
        return true;
    }
    expandRow(d) {
        // if (!d['data']['READONLY']) {
        //     // 序号必须大于 4
        //     let index = (d['data']['SHOW_INDEX'] || '') + '';
        //     index = index.replace(/[^\d]/g, '');
        //     if (!index || parseInt(index) < 5) {
        //         this.showMessage('error', '', '自定义字段排序只能为大于4的数');
        //         return null;
        //     }
        //     d['data']['SHOW_INDEX'] = parseInt(index);
        // }
        if (!d['data']['READONLY']) {
            // 序号必须大于 4
            let index = (d['data']['SHOW_INDEX'] || '') + '';
            index = index.replace(/[^\d]/g, '');
            if (!index || parseInt(index) < 5) {
                this.showMessage('error', '', '自定义字段排序只能为大于4的数');
                // return null;
                index = '-1';
            }
            d['data']['SHOW_INDEX'] = parseInt(index);
        }
        let arr = [];
        arr.push(d['data']);
        let children = d['children'] || [];
        children.forEach(cd => {
            let earr = this.expandRow(cd);
            // if (!earr) {
            //     return null;
            // }
            arr = arr.concat(earr);
        });
        return arr;
    }
    showButton(col, rowData) {
        let t = rowData['WIDGET_TYPE'];
        return col['header'] == '等级规则' || (t == '复选框' || t == '下拉框' || t == '可选可输' || t == '多选可输' || t == '多选不可输')

    }
    showPop(col, data) {
        let me = this;
        const obj = {
            "ITEMS": function (col, data) {
                me.popTitle = '下拉数据维护';
                me.buttonCols = [{ "field": "显示值", "editor": true }, { "field": "隐藏值", "editor": true }, { "field": "报表打印值", "editor": true }, { "field": "分数", "editor": true }, { "field": "关联项", "editor": true }, { "field": "诊断", "editor": false }];
            }, "REGULAR": function (col, data) {
                me.popTitle = '等级规则维护';
                me.buttonCols = [{ "field": "显示值", "editor": true }, { "field": "隐藏值", "editor": true }, { "field": "最小值", "editor": true }, { "field": "最大值", "editor": true }, { "field": "诊断", "editor": false }];
            }, "BOUND_TERMS": function (col, data) {
                me.popTitle = '约束项维护';
                me.buttonCols = [{ "field": "组件名称", "editor": true }, { "field": "是否显示", "editor": true, "options": me.evaConfigService.buildDropDown(["", "是", "否"]) }];
            }
        };
        obj[col.field] && obj[col.field](col, data);
        this.popType = col.field;
        this.popBindData = data;
        let list = data[col.field + '_ARR'] || [];
        this.popDpList = [...list];
        this.dpDlg = true;
    }
    popAddRow() {
        this.popDpList.push({ 'uid': Math.random() });
        this.popDpList = [...this.popDpList];
    }
    popDelRow(index) {
        this.popDpList.splice(index, 1);
        this.popDpList = [...this.popDpList];
    }
    popConfirm() {
        this.popBindData[this.popType + '_ARR'] = this.popDpList;
        this.dpDlg = false;
    }

    selDs(row) {
        let ds = row['ds'];
        row['WIDGET_TYPE'] = ds['ncode'];
        row['WIDGET_NAME'] = ds['label'];
        if (!row['WIDGET_SHOW_NAME']) {
            row['WIDGET_SHOW_NAME'] = ds['label'];
        }
        // && !row['ITEMS_ARR']
        if(ds['ITEMS_ARR'] ){
            row['ITEMS_ARR'] = ds['ITEMS_ARR'];
        }
    }
    filterDsFun(e) {
        let q = e.query || '';
        this.filterDs = (this.ds || []).filter(s => {
            return !q || (s['label'] || '').indexOf(q) > -1 || (s['type'] || '').indexOf(q) > -1;
        });
    }


    /**
 * 消息提醒
 */
    showMessage(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    }

    emrDsType2NurseType(ds) {
        if((ds['dictList'] || []).length == 0){
            if(this.defineDropDs[ds['name']]){
                ds['dictList'] = this.defineDropDs[ds['name']];
            }
        }
        if(ds['dictList'] && ds['dictList'].length > 0){
            return '下拉框'; 
        }else if(ds['format'] == 'DT8'){
            return '日期';
        }else if(ds['format'] == 'DT15'){
            return '日期时间';
        }else if(ds['type'] == 'L'){
            return '下拉框';
        }
        // cellbox newtextbox  textbox timetext
        return '文本框';
        // "文本框(只读)","文本框","复选框","下拉框","可选可输","多选可输","多选不可输","日期时间","日期","时间","自定义","跳转表单","拍摄照片"

    }

    uuidGenerate(len?: number, radix?: number) {
        var secureChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        var uuid = [];
        var i;
        var radix = radix || secureChars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = secureChars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = secureChars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
}
