import { SysParamService } from './../../sys-param/sys-param.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { LoadingService } from './../../../common/service/loading.service';
import { Message } from "primeng/primeng";
import { AuthTokenService } from "../../../basic/auth/authToken.service";
import { BasUser } from "../../../basic/common/model/basUser.model";
import { CurrentUserInfo } from "../../../basic/common/model/currentUserInfo.model";
import { CollectedTemplateReplaceService } from "../collectedTemplateReplace.service";
import { EmrDept } from "../model/emr-dept";
import { EmrHospital } from "../model/emr-hospital";
import { ReplaceTemplateDataSourceService } from "../replaceTemplateDataSource.service";
import { TemplateUpdateService } from "../templateUpdate.service";
import { TemplateService } from '../template.service';

declare let $: any;

@Component({
    selector: 'kyee-collectedTemplateReplace',
    templateUrl: './collectedTemplateReplace.component.html',
    styleUrls: ['./collectedTemplateReplace.component.scss']
})
export class CollectedTemplateReplaceComponent implements OnInit {
    msgs: Message[];

    searchData: { 院区编码: string; 医院编码: string; 收藏类型: string; 科室ID: string; userId: string; 模板名称: string; pageNo: number; pageSize: number; };
    currentUserInfo: CurrentUserInfo;
    searchEmrHospitalList: EmrHospital[] = [];
    searchEmrHospitalDeptList: EmrDept[] = [];
    searchEmrHospitalDeptUserList: BasUser[] = [];

    selectedSearchEmrHospital: EmrHospital = new EmrHospital();
    selectedSearchEmrDept: EmrDept = new EmrDept();
    selectedSearchEmrUser: BasUser = new BasUser();

    collectType = [{ label: '所有类型', value: '' }, { label: '科室', value: 'dept' }, { label: '个人', value: 'person' }];
    //值映射
    hospitalMap = {};
    dropTemplateList: any = [];
    selectSearchTemplate: any;
    dirLoading: boolean;

    first: Number = 0; // 分页重置
    start = 1;
    @ViewChild('dt') dt: ElementRef;

    allSize = 0;
    templateCollectedInfoList = [];
    selectionTemplates = [];

    newRecordDialogDisplay = false;
    replaceTemplate: any;
    confirmReplace: boolean;
    @ViewChild('dirTable') dirTable: any;
    selectedScope = '';
    templateDirs: any;
    selectedTemplateDir = {};
    templatesOrderRule: string; // 模版排序规则
    emrTemplates = [];
    selectedDeptment = {};
    newByExpiredTemplate = true;
    selectedTemplate: any;
    hospitalParam: Object;

    isAreaRole:boolean;

    searchTemplate = '';
    templateCataLog: any;
    selectedSearchTemplate = '';

    constructor(
        private templateManageService: TemplateService, private render: Renderer2, private replaceDataSourceService: ReplaceTemplateDataSourceService, private templateUpdateService: TemplateUpdateService, private authTokenService: AuthTokenService, private collectedReplaceService: CollectedTemplateReplaceService, private loadingService: LoadingService, private sysParamService: SysParamService) {
        this.searchData = {
            院区编码: '',
            医院编码: '',
            收藏类型: '所有类型',
            科室ID: '',
            userId: '',
            模板名称: '',
            pageNo: 0,
            pageSize: 20,
        };

    }

    ngOnInit() {
        this.currentUserInfo = this.sysParamService.getCurUser();
        this.isAreaRole = this.sysParamService.isAreaUser(this.currentUserInfo);
        this._initEmrHospital([]);
        this._initEmrDept([]);
        this._initBasUser([]);
        this.initHospitals();
        this.searchData.收藏类型 = '所有类型';
        this.dropTemplateList = [];
        this.dropTemplateList.push({ "displayName": "请选择", "模板名称": "" });
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
              this.getEmrDeptList();
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

    _initBasUser(data) {
        const user = new BasUser();
        user.用户名 = '请选择';
        this.searchEmrHospitalDeptUserList = [...data];
        this.searchEmrHospitalDeptUserList.splice(0, 0, user);
        this.selectedSearchEmrUser = new BasUser();
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

    getEmrDeptList() {
        this.initDropTemplate();
        this._initEmrDept(this.selectedSearchEmrHospital.children || []);
        if (this.selectedSearchEmrHospital.code && this.selectedSearchEmrHospital.hosCode) {
            //获取所选医院的配置
            let searchParams1 = {
              '医院编码': this.selectedSearchEmrHospital.code || '',
              '院区编码': this.selectedSearchEmrHospital.hosCode || ''
            };
            this.initDropTemplate();
            this.templateUpdateService.getHospitalPrams(searchParams1).then(
              data => {
                if (data) {
                  this.hospitalParam = data;
                }
              }
            );
          }
    }

    getEmrDeptUser() {
        this.initSearchData();
        this.collectedReplaceService.getEmrDeptUser(this.searchData).then((data) => {
            this.searchEmrHospitalDeptUserList = data;
            this.searchEmrHospitalDeptUserList.splice(0, 0, this.selectedSearchEmrUser);
        })
    }

    selectEmrDeptUser(){
        this.searchData.userId = this.selectedSearchEmrUser.用户ID;
    }

    lazyLoad($event) {
        this.searchData.pageNo = $event.first / $event.rows;
        this.searchData.pageSize = $event.rows;
        if (this.start-- > 0) {
            this.templateCollectedInfoList = [];
            return;
        }
        this.searchCollectedTemplate();
    }

    ngAfterViewInit() {
        $('.ui-paginator').append('<span id="totalMsg" style="position:absolute;left:1em;color:red;"></span>');
        let timeIdex = setTimeout(() => { // 延时是为了表格表头渲染出来后可获取到表头高度
            let tabContainer = this.dt['el'].nativeElement;
            var scrollable = tabContainer.querySelector('.ui-datatable-scrollable');
            if (scrollable) {
                let scrollHeight = '465px';
                this.render.setStyle(scrollable, 'height', scrollHeight);
            }
            var scrollTbody = tabContainer.querySelector('.ui-datatable-scrollable-body');
            if (scrollTbody) {
                let scrollHeight = '360px';
                this.render.setStyle(scrollTbody, 'max-height', scrollHeight);
            }
        }, 2);

    }

    searchCollectedTemplate() {
        if (this.searchData.收藏类型 == 'dept' && !this.searchData.科室ID) {
            this.showMessage('error', '', '查询科室收藏请选择医院对应科室');
            return;
        }
        if (this.searchData.收藏类型 == 'person' && (!this.searchData.科室ID || !this.searchData.userId)) {
            this.showMessage('error', '', '查询个人收藏请选择医院对应科室和用户');
            return;
        }
        this.initSearchData();
        this.dirLoading = true;
        if(this.selectSearchTemplate){
            if(typeof this.selectSearchTemplate == 'string'){
                this.searchData['模板名称'] = this.selectSearchTemplate;
            }else{
                this.searchData['模板名称'] = this.selectSearchTemplate.模板名称
            }
        }else{
            this.searchData['模板名称'] = '';
        }
        this.collectedReplaceService.searchCollectedTemplate(this.searchData).then((data) => {
            if (data) {
                this.templateCollectedInfoList = data['templateCollectedInfoList'];
                this.templateCollectedInfoList.forEach(template => {
                    var regex = /[0-9]+-[0-9]+\.[0-9]+\.[0-9]+/g;
                    if (regex.exec(template['模板收藏全名'])) {
                        template['收藏类型'] = '个人';
                    } else {
                        template['收藏类型'] = '科室';
                    }
                });
                this.allSize = data['allSize'];
                this.dirLoading = false;
                if (this.allSize.valueOf() < 1) {
                    $('#goPage').hide();
                } else {
                    $('#goPage').show();
                    let curPage = this.first.valueOf() / this.searchData.pageSize + 1;
                    $('#goPage input').val(curPage);
                    $('#goPage span').text(curPage + '/' + Math.ceil(this.allSize.valueOf() / this.searchData.pageSize));
                    this.selectionTemplates = [];
                }
                this.showTotalMsg();
            }
        });
    }

    showTotalMsg() {
        $('#totalMsg').text('总计:' + this.allSize + '份模板收藏记录');
    }

    initDropTemplate() {
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
        this.collectedReplaceService.searchDropTemplate(searchParams).then(list => {
            this.dropTemplateList = [];
            this.dropTemplateList.push({ "displayName": "请选择", "模板名称": "" });
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                element['displayName'] = element['模板名称'];
            }
            this.dropTemplateList = this.dropTemplateList.concat(list);
        });
    }

    initSearchData() {
        this.searchData.医院编码 = this.selectedSearchEmrHospital.code;
        this.searchData.院区编码 = this.selectedSearchEmrHospital.hosCode;
        this.searchData.科室ID = this.selectedSearchEmrDept.code || "";
        this.searchData.userId = this.selectedSearchEmrUser.用户ID;
        if (this.selectSearchTemplate) {
            this.searchData['模板名称'] = this.selectSearchTemplate.模板名称;
        }
    }

    replaceCollectedTemplate() {
        if (!this.selectionTemplates || this.selectionTemplates.length == 0) {
            this.showMessage('error', '', '请勾选要替换模板的模板收藏记录。');
            return;
        }
        this.selectedSearchTemplate = '';
        this.newRecordDialogDisplay = true;
        if(this.selectedSearchEmrHospital.code){
            this.changeScope('hospital');
        }else{
            this.changeScope('area');
        }
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
    //根据输入的模板名称过滤模板列表
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
            if(list && list.length>0){
                for(var index = 0;index<list.length;index++){
                    if(list[index]['模板名称'].indexOf(selectTemplateName)>-1){
                        return true;
                    }
                }
            }
        })[0];

        //设置模板列表
        this.emrTemplates = this.selectedTemplateDir['模板列表'];
        // //设置选中的模板
        // this.selectedTemplate = this.selectedTemplateDir['模板列表'].filter(template => {
        //     return 选中的模板ID === template['模板ID'];
        // });
        // //scrollIntoView
        // window.setTimeout(function () {
        //     $('.ui-state-highlight').each(function () {
        //         $(this)[0].scrollIntoView();
        //     });
        // }, 300);
    }

    //根据模板名称获取改模板所属的目录
    getDirNameByTemplateName(templateName) {
        let catalogMap = this.templateCataLog;
        let dirName = null;
        for (var i in catalogMap) {
            if (catalogMap[i].map(template => template['模板名称']).indexOf(templateName) != -1) {
                dirName = i;
                break;
            }
        }
        return dirName;
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
            'scope': this.selectedScope || '',
            'templateName':this.searchTemplate
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

    confirmReplaceOrNot(template) {
        this.replaceTemplate = template;
        this.confirmReplace = true;
    }

    confirmReplaceTemplate() {
        this.showMessage('info', '', '正在替换收藏模板，批量替换成功后会重新查询结果，请稍后操作！');
        this.batchReplaceTemplate(this.replaceTemplate);
        this.confirmReplace = false;
        this.onClose();
        this.newRecordDialogDisplay = false;
    }

    cancelReplaceTemplate() {
        this.confirmReplace = false;
        this.replaceTemplate = null;
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
        var recordData = {};
        var recordIds = [];
        if (this.selectionTemplates) {
            this.selectionTemplates.forEach(record => {
                if (record.模板存储地址) {
                    recordIds.push({ "_id": record._id, "模板存储地址": record.模板存储地址 });
                }
                recordData[record._id] = { "模板名称": record.模板名称, "模板收藏全名": record.模板收藏全名 };
            });
        }
        var queryFile = { paths: recordIds, template: this.selectedTemplate };
        this.collectedReplaceService.queryNeedReplacedRecordFileAndTemplateFile(queryFile).then(data => {
            if (data['code'] == '10000') {
                if (data['data']) {
                    var fileMap = data['data'];
                    if (!fileMap['templateFile']) {
                        this.showMessage('error', '', data['msg'] || '选择替换的模板文件为空！');
                        return;
                    }
                    for (var index = 0; index < this.selectionTemplates.length; index++) {
                        if (fileMap[this.selectionTemplates[index]['_id']]) {
                            var recordFile = fileMap[this.selectionTemplates[index]['_id']];
                            var hosCode = this.selectionTemplates[index]['模板收藏全名'].split('.')[2].split('-')[0];
                            var newFile = this.useTemplateFileReplaceRecordFile(recordFile, fileMap['templateFile'],'guangdong_jy',hosCode);
                            recordData[this.selectionTemplates[index]['_id']]['file'] = newFile;
                        }
                    }
                    var replaceData = {
                        recordData: recordData,
                        template: this.selectedTemplate,
                        userName: this.currentUserInfo.userName,
                    };
                    this.collectedReplaceService.replaceCollectedTemplate(replaceData).then(data => {
                        if (data['code'] == '10000') {
                            if (data['data']) {
                                var info = '';
                                if (data['data']['success'].length>0) {
                                    info = "模板id：" + data['data']['success'].join("、") + "替换成功," + "<br>";
                                }
                                if (data['data']['error'].length>0) {
                                    info = "模板id：" + data['data']['error'].join("、") + "替换失败" + "<br>";
                                }
                                if (data['data']['success'].length>0) {
                                    info = data['data']['success'].length +"份模板替换成功";
                                }
                                this.showMessage('info', '', info);
                                this.searchCollectedTemplate();
                            }
                        } else {
                            this.showMessage('error', '', data['msg'] || '替换模板文件失败');
                        }
                    });
                }
            } else {
                this.showMessage('error', '', data['msg'] || '替换模板文件失败');
            }
        });
    }

    useTemplateFileReplaceRecordFile(recordFile, replacedTemplateFile, areaCode, hosCode) {
        var oldFile = recordFile;
        var oldfileStr = oldFile.replace('<body', '<section').replace('</body>', '</section>');
        var oldbody = $(oldfileStr);
        var datasources = oldbody.find('[data-kyee-name]:not([data-kyee-node="labelbox"])');//只查找有名称的数据元，无名称的只能作为内嵌类型
        var sourceObj = this.getSourceObject(datasources, oldbody, areaCode, hosCode);
        var newTemplate = replacedTemplateFile;
        var newfileStr = newTemplate.replace('<body', '<section').replace('</body>', '</section>');
        var newbody = $(newfileStr);
        this.replaceDataSourceService.replaceUpdateRecordByEmrInfo(newbody,sourceObj,this.hospitalParam);
        var newFile = newbody.prop('outerHTML').replace('<section', '<body').replace('</section>', '</body>');
        return newFile;
    }

    getSourceObject(datasources, $body, areaCode, 医院编码) {
        var result = new Object();
        for (var i = 0; i < datasources.length; i++) {
            var $datasource = $(datasources[i]);
            var type = $datasource.attr('data-kyee-node');
            var name = $datasource.attr('data-kyee-name');
            var _id = $datasource.attr('data-kyee-id') || '';
            if (!name) {
                continue;
            }
            var spanObj = new Object();
            switch (type) {
                case 'newtextbox':
                case 'numbox':
                    var resultTextBox = this.getNewTextboxValue($datasource, $body);
                    if (resultTextBox && resultTextBox.length == 1) {
                        spanObj["类型"] = type;
                        if (typeof (resultTextBox[0]) == 'string' && resultTextBox[0].replace(/↵/g, '').trim() == '') {
                            spanObj["值"] = '';
                        } else {
                            spanObj["值"] = resultTextBox[0];
                        }
                    } else if (resultTextBox && resultTextBox.length > 1) {
                        spanObj["类型"] = type;
                        spanObj["值"] = resultTextBox;
                    } else {
                        spanObj["类型"] = type;
                        spanObj["值"] = "";
                    }
                    break;
                case 'dropbox':
                    var items = $datasource.attr('data-kyee-items');
                    var code = "";
                    var value = $datasource.text();
                    value = value ? value.replace(/\u200B/g, '').replace(/\u3000/g, '') : '';
                    if (items != null && items.trim() != '') {
                        var itemList = items.split("#");
                        var selectType = $datasource.attr('_selectType');
                        var jointsymbol = $datasource.attr('_jointsymbol');
                        if (selectType == '多选') {
                            var arr = value.split(jointsymbol);
                            var codeArr = [];
                            var valueArr = [];
                            for (var k = 0; k < arr.length; k++) {
                                var element = arr[k];
                                for (var j = 0; j < itemList.length; j++) {
                                    var item = itemList[j];
                                    var matches = item.match(/(.*?)\((.*?)\)/);
                                    if (matches && matches.length == 3 && element == matches[1]) {
                                        code = matches[1];
                                        value = matches[2];
                                        codeArr.push(code);
                                        valueArr.push(value);
                                    } else if (matches == null) {
                                        valueArr.push(element);
                                        break;
                                    }
                                }

                            }
                            code = codeArr.join(jointsymbol);
                            value = valueArr.join(jointsymbol);
                        } else {
                            for (var j = 0; j < itemList.length; j++) {
                                var item = itemList[j];
                                var matches = item.match(/(.*?)\((.*?)\)/);
                                if (matches && matches.length == 3 && value == matches[1]) {
                                    code = matches[1];
                                    value = matches[2];
                                }
                            }
                        }

                    }
                    spanObj["类型"] = type;
                    spanObj["值域"] = items;
                    spanObj["编码"] = code;
                    spanObj["值"] = value;
                    break;
                case 'cellbox':
                case 'timebox':
                case 'textboxwidget':
                    var value = $datasource.text();
                    spanObj["类型"] = type;
                    spanObj["值"] = value ? value.replace(/\u200B/g, '') : '';
                    break;
                case 'expressionbox':
                    var value = $datasource.attr('_expressionvalue');
                    spanObj["类型"] = type;
                    spanObj["值"] = value;
                    spanObj["_style"] = $datasource.attr('style');
                    spanObj["_expressionoption"] = $datasource.attr('_expressionoption');
                    spanObj["id"] = _id;
                    break;
                case 'searchbox':
                    var isDiag = $datasource.attr('_searchoption') == '诊断名称';
                    var value = $datasource.text() || '';
                    var remark = $datasource.attr('_remark')
                    // 傣医诊断
                    if (isDiag && remark) {
                        value = $datasource.attr('_name');
                        spanObj["remark"] = remark;
                    }
                    spanObj["类型"] = type;
                    spanObj["编码"] = $datasource.attr('_code');
                    spanObj["编码名称"] = $datasource.attr('_name');
                    spanObj["主次"] = $datasource.attr('_order');
                    spanObj["值"] = value ? value.replace(/\u200B/g, '') : '';
                    if (spanObj["编码"] == "[object Object]") {
                        spanObj["编码"] = "";
                    }
                    if (spanObj["编码名称"] == "[object Object]") {
                        spanObj["编码名称"] = "";
                    }
                    break;
                case 'radiobox':
                    var checksources = $datasource.find('[data-kyee-node="radiobox"]');
                    var radioboxvalue = '';
                    var code = '';
                    var nameValueStr = $datasource.attr("data-kyee-items");
                    for (var j = 0; j < checksources.length; j++) {
                        var checksource = checksources[j];
                        var nameValue = checksource.getAttribute('data-kyee-itemname');
                        nameValue = nameValue ? nameValue.replace(/\u200B/g, '') : '';
                        if (checksource.getAttribute('_selected')) {
                            var matches = nameValue.match(/(.*?)\((.*?)\)/);
                            if (matches && matches.length == 3) {
                                code = matches[1];
                                radioboxvalue = matches[2];
                            } else {
                                radioboxvalue = nameValue;
                            }
                        }
                    }
                    spanObj["类型"] = type;
                    spanObj["值域"] = nameValueStr;
                    spanObj["编码"] = code;
                    spanObj["值"] = radioboxvalue;
                    // if(!globalFlag){
                    //     i += checksources.count() - 1;
                    // }
                    break;
                case 'checkbox':
                    // 获取data-kyee-name等于该值的所有span，然后处理，并吧i+=length处理
                    var checksources = $datasource.find('[data-kyee-node="checkbox"]');
                    // var checksources = editor.document.getBody().find('[data-kyee-name="' + name + '"]');
                    var checkList = new Array();
                    var codeList = new Array();
                    var nameValueStr = $datasource.attr("data-kyee-items");
                    for (var j = 0; j < checksources.length; j++) {
                        var checksource = checksources[j];
                        var nameValue = checksource.getAttribute('data-kyee-itemname');
                        nameValue = nameValue ? nameValue.replace(/\u200B/g, '') : '';
                        if (checksource.getAttribute('_selected')) {
                            var matches = nameValue.match(/(.*?)\((.*?)\)/);
                            if (matches && matches.length == 3) {
                                codeList.push(matches[1]);
                                checkList.push(matches[2]);
                            } else {
                                checkList.push(nameValue);
                            }
                        }
                    }
                    spanObj["类型"] = type;
                    spanObj["值域"] = nameValueStr;
                    spanObj["编码"] = codeList.length > 0 ? codeList : "";
                    spanObj["值"] = checkList.length > 0 ? checkList : "";
                    // if(!globalFlag){
                    //     i += checksources.count() - 1;
                    // }
                    break;
            }
            if (!spanObj['类型']) {
                continue;
            }
            if (_id) {
                spanObj['id'] = _id;
            }
            if (result.hasOwnProperty(name) && _id) {
                result[name + '_' + _id] = spanObj;
            } else {
                result[name] = spanObj;
            }
        }
        return result;
    }

    getNewTextboxValue($datasource, $body) {
        var resultList = new Array();
        if (!$datasource.find('span.new-textbox-content')[0]) {
            return resultList;
        }
        var $datasource = $datasource.clone(true);
        $datasource.find('del.kyee_revise_del').remove();
        var $paireContents = $datasource.find('span.new-textbox-content')[0].childNodes;

        var continuousText = 0;
        var txt = '';
        var radioCheckList = new Array();
        for (var j = 0; j < $paireContents.length; j++) {
            var paireContent = $paireContents[j];
            var childSpanObj;
            if (paireContent.getAttribute && (paireContent.tagName == 'IMG' || $(paireContent).find('img').length > 0) && !paireContent.getAttribute('data-kyee-node')) { // &&  == 'imageSignature'
                continuousText = 0;
                var $img = null;
                if (paireContent.tagName == 'IMG') {
                    $img = paireContent;
                } else if (paireContent.children.length > 0) {
                    $img = $(paireContent).find('img')[0];
                }
                if (!$img) {
                    continue;
                }
                var spanObj = new Object();
                spanObj["名称"] = 'img';
                spanObj["类型"] = 'img';
                var imagBase64 = $img.getAttribute('src');
                spanObj["值"] = imagBase64;
                spanObj["src"] = imagBase64;
                spanObj["id"] = $img.getAttribute('id') || '';
                spanObj["style"] = $img.getAttribute('style') || '';
                if (!($img.style && $img.style.width)) {
                    childSpanObj["style"] += 'width:' + $img.width + 'px;';
                }
                if (!($img.style && $img.style.height)) {
                    childSpanObj["style"] += 'height:' + $img.height + 'px;';
                }
                // childSpanObj["style"] += 'width:'+ $img.width +'px;height: '+ $img.height +'px';
                resultList.push(spanObj);
                continue;
            }
            if (paireContent.getAttribute && paireContent.getAttribute('data-kyee-node')) {
                var name = paireContent.getAttribute('data-kyee-name');
                var type = paireContent.getAttribute('data-kyee-node');
                var _id = paireContent.getAttribute('data-kyee-id') || '';
                switch (type) {
                    case 'dropbox':
                        var spanObj = new Object();
                        var value = paireContent.textContent.replace(/\u200B/g, '');
                        var items = paireContent.getAttribute('data-kyee-items');
                        var code = "";
                        if (items != null && items.trim() != '') {
                            var itemList = items.split("#");
                            for (var t = 0; t < itemList.length; t++) {
                                var item = itemList[t];
                                var matches = item.match(/(.*?)\((.*?)\)/);
                                if (matches && matches.length == 3 && value == matches[1]) {
                                    code = matches[1];
                                    value = matches[2];
                                }
                            }
                        }
                        spanObj["名称"] = name;
                        spanObj["类型"] = type;
                        spanObj["值域"] = items;
                        spanObj["编码"] = code;
                        spanObj["值"] = value;
                        spanObj["id"] = _id;
                        resultList.push(spanObj);
                        continuousText = 0;
                        break;
                    case 'cellbox':
                    case 'timebox':
                        var spanObj = new Object();
                        var value = paireContent.textContent.replace(/\u200B/g, '');
                        spanObj["名称"] = name;
                        spanObj["类型"] = type;
                        spanObj["值"] = value;
                        spanObj["id"] = _id;
                        resultList.push(spanObj);
                        continuousText = 0;
                        break;
                    case 'textboxWidget':
                        var spanObj = new Object();
                        var $innerNode = $(paireContent).find('data-kyee-node');
                        var value = $innerNode.text().replace(/\u200B/g, '');
                        spanObj["名称"] = $innerNode.attr('data-kyee-name');
                        spanObj["类型"] = $innerNode.attr('data-kyee-node');;
                        spanObj["值"] = value;
                        spanObj["id"] = _id;
                        resultList.push(spanObj);
                        continuousText = 0;
                        break;
                    case 'expressionbox':
                        var spanObj = new Object();
                        var value = paireContent.getAttribute('_expressionvalue');
                        if (name) spanObj["名称"] = name;
                        spanObj["类型"] = type;
                        spanObj["值"] = value;
                        spanObj["_style"] = paireContent.getAttribute('style');
                        spanObj["_expressionoption"] = paireContent.getAttribute('_expressionoption');
                        spanObj["id"] = _id;
                        resultList.push(spanObj);
                        continuousText = 0;
                        break;
                    case 'searchbox':
                        var spanObj = new Object();
                        if (name) spanObj["名称"] = name;
                        spanObj["类型"] = type;
                        spanObj["编码"] = paireContent.getAttribute('_code');
                        spanObj["编码名称"] = paireContent.getAttribute('_name');
                        spanObj["主次"] = paireContent.getAttribute('_order');
                        spanObj["_searchoption"] = paireContent.getAttribute('_searchoption');
                        spanObj["id"] = _id;
                        if (paireContent.children.length > 0) {
                            if (paireContent.tagName == 'IMG') {
                                $img = paireContent;
                            } else if (paireContent.children.length > 0) {
                                $img = $(paireContent).find('img')[0];
                            }
                            if (!$img) {
                                break;
                            }
                            var imgWidth = $img.width;

                            childSpanObj = new Object();
                            childSpanObj["名称"] = 'img';
                            childSpanObj["类型"] = 'img';
                            var imagBase64 = $img.getAttribute('src');
                            childSpanObj["值"] = imagBase64;
                            childSpanObj["src"] = imagBase64;
                            childSpanObj["id"] = $img.getAttribute('id') || '';
                            childSpanObj["style"] = $img.getAttribute('style') || '';
                            if (!($img.style && $img.style.width)) {
                                childSpanObj["style"] += 'width:' + $img.width + 'px;';
                            }
                            if (!($img.style && $img.style.height)) {
                                childSpanObj["style"] += 'height:' + $img.height + 'px;';
                            }
                            // childSpanObj["style"] += 'width:'+ $img.width +'px;height: '+ $img.height +'px';
                            spanObj["值"] = childSpanObj;
                        } else {
                            var value = paireContent.textContent.replace(/\u200B/g, '');
                            spanObj["值"] = value;
                        }
                        resultList.push(spanObj);
                        continuousText = 0;
                        break;
                    case 'radiobox':
                        if (radioCheckList.indexOf(name) == -1) {
                            radioCheckList.push(name);
                            var spanObj = new Object();
                            var value;
                            var code = "";
                            var nameValueStr = "";
                            var checksources = $body.find('[data-kyee-name="' + name + '"]');
                            for (var t = 0; t < checksources.length; t++) {
                                var checksource = checksources[t];
                                var nameValue = checksource.getAttribute('data-kyee-itemname');
                                nameValue = nameValue ? nameValue.replace(/\u200B/g, '') : '';
                                if (checksource.getAttribute('data-kyee-node') == "radiobox") {
                                    if (nameValueStr == "") {
                                        nameValueStr += nameValue;
                                    } else {
                                        nameValueStr += "#" + nameValue;
                                    }
                                }
                                if (checksource.getAttribute('_selected')) {
                                    var matches = nameValue.match(/(.*?)\((.*?)\)/);
                                    if (matches && matches.length == 3) {
                                        code = matches[1];
                                        value = matches[2];
                                    } else {
                                        value = nameValue;
                                    }
                                }
                            }
                            spanObj["名称"] = name;
                            spanObj["类型"] = type;
                            spanObj["值域"] = nameValueStr;
                            spanObj["编码"] = code;
                            spanObj["值"] = value;
                            spanObj["id"] = _id;
                            resultList.push(spanObj);
                            continuousText = 0;
                        }
                        break;
                    case 'checkbox':
                        // 获取data-kyee-name等于该值的所有span，然后处理，并吧i+=length处理
                        if (radioCheckList.indexOf(name) == -1) {
                            radioCheckList.push(name);
                            var spanObj = new Object();
                            var checksources = $body.find('[data-kyee-name="' + name + '"]');
                            var valueList = new Array();
                            var codeList = new Array();
                            var nameValueStr = "";
                            for (var t = 0; t < checksources.length; t++) {
                                var checksource = checksources[t];
                                var nameValue = checksource.getAttribute('data-kyee-itemname');
                                nameValue = nameValue ? nameValue.replace(/\u200B/g, '') : '';
                                if (checksource.getAttribute('data-kyee-node') == "checkbox") {
                                    if (nameValueStr == "") {
                                        nameValueStr += nameValue;
                                    } else {
                                        nameValueStr += "#" + nameValue;
                                    }
                                }
                                if (checksource.getAttribute('_selected')) {
                                    var matches = nameValue.match(/(.*?)\((.*?)\)/);
                                    if (matches && matches.length == 3) {
                                        codeList.push(matches[1]);
                                        valueList.push(matches[2]);
                                    } else {
                                        valueList.push(nameValue);
                                    }
                                }
                            }
                            spanObj["名称"] = name;
                            spanObj["类型"] = type;
                            spanObj["值域"] = nameValueStr;
                            spanObj["编码"] = codeList.length > 0 ? codeList : "";
                            spanObj["值"] = valueList.length > 0 ? valueList : "";
                            spanObj["id"] = _id;
                            resultList.push(spanObj);

                            continuousText = 0;
                        }
                        break;
                }
            } else if ((paireContent.nodeType == 1 || paireContent.nodeType == 3) && !$(paireContent).closest('span.new-textbox-content').attr('_placeholdertext')) {
                if (paireContent.nodeName == "BR") {
                    txt = '↵'; //换行符对应的实体符
                } else {
                    txt = paireContent.textContent.replace(/\u200B/g, '').replace(/[\n\r]/g, '↵').replace(/<br(\/)?>/g, '↵').replace(/&para;/g, '');
                }
                if (paireContent.nodeName == "P" && $paireContents[j + 1] && $paireContents[j + 1].nodeName != "BR" && j < ($paireContents.length - 1)) { // p标签则获取数据时保留换行格式则添加换行实体符
                    txt = txt + '↵'; //换行符对应的实体符
                }
                if (continuousText == 1) {
                    resultList[resultList.length - 1] = resultList[resultList.length - 1] + txt;
                } else {
                    resultList.push(txt);
                }
                continuousText = 1;
            }
        }
        return resultList;
    }

    /**
     *
     * @param evt 改变科室
     */
    changeDeptment(evt) {
        this.selectedDeptment = evt.value;
        this.updateTemplateDirsData(null);
    }

    showMessage(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    }

}