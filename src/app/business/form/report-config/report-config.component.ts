import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigDataInfoCustom } from './report-config.model'
import { LoadingService } from 'portalface/services';
import { EmrReportService } from './report-config.services';
import { Message } from 'primeng/primeng';
import { ConfirmationService } from "portalface/widgets";
import { DictionaryComponent } from './dictionary/dictionary.component'
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { CurrentUserInfo } from "../../../basic/common/model/currentUserInfo.model";
import { RecordUtils } from '../../../utils/RecordUtils';
import { SysParamService } from "../../sys-param/sys-param.service";
import { TreeNode } from 'portalface/widgets';
import { format } from 'date-fns';
declare let $: any;

@Component({
  selector: 'app-report-config',
  templateUrl: './report-config.component.html',
  styleUrls: ['./report-config.component.scss']
})
export class ReportConfigComponent implements OnInit {
  dataList = [];
  projectData: any = {};
  configDataList: ConfigDataInfoCustom[] = [];
  openDialogType: string;
  emrTypes = [];
  emrTypesOut = [];//门诊模板
  emrTypesIn = [];//住院模板
  clcTypes = [
    { label: '请选择', value: '' },
    { label: '住院', value: '2' },
    { label: '门诊', value: '1' }
  ]
  jsonTypes = [
    { label: '请选择', value: '' },
    { label: '首页上报', value: '首页上报' },
    { label: '数据导出', value: '数据导出' },
    { label: '回写HIS', value: '回写HIS' }
  ]
  diagMapperTypes = [
    { label: '请选择', value: '' },
    { label: '名称', value: '名称' },
    { label: '编码', value: '编码' },
  ]
  ageTypes = [
    { label: '请选择', value: '' },
    { label: '岁', value: '岁' },
    { label: '月', value: '月' },
    { label: '月00', value: '月00' },
    { label: '天', value: '天' },
  ]
  isShowConfigDialog: boolean = false;
  isShowAddDialog: boolean = false;
  currentUserInfo: CurrentUserInfo = new CurrentUserInfo();
  datasources = [];
  copyProjectList = [];
  selectCopyProject = null;
  isShowCopyDialog = false;
  selectedConfigData: ConfigDataInfoCustom[] = [];
  formatTypes = [
    { label: '请选择', value: '' },
    { label: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
    { label: 'yyyyMMddHHmmss', value: 'yyyyMMddHHmmss' },
    { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
    { label: 'yyyyMMdd', value: 'yyyyMMdd' },
    { label: 'HH', value: 'HH' },
    { label: 'mm', value: 'mm' },
  ]
  writeBackHisDataTypes = [
    { label: '请选择', value: '' },
    { label: 'CHAR', value: 'CHAR' },
    { label: 'VARCHAR', value: 'VARCHAR' },
    { label: 'LONGVARCHAR', value: 'LONGVARCHAR' },
    { label: 'NUMERIC', value: 'NUMERIC' },
    { label: 'DECIMAL', value: 'DECIMAL' },
    // { label: 'BIT', value: 'BIT' },
    { label: 'BOOLEAN', value: 'BOOLEAN' },
    // { label: 'TINYINT', value: 'TINYINT' },
    // { label: 'SMALLINT', value: 'SMALLINT' },
    { label: 'INTEGER', value: 'INTEGER' },
    // { label: 'BIGINT', value: 'BIGINT' },
    // { label: 'REAL', value: 'REAL' },
    { label: 'FLOAT', value: 'FLOAT' },
    { label: 'DOUBLE', value: 'DOUBLE' },
    { label: 'BINARY', value: 'BINARY' },
    { label: 'VARBINARY', value: 'VARBINARY' },
    { label: 'LONGVARBINARY', value: 'LONGVARBINARY' },
    { label: 'DATE', value: 'DATE' },
    { label: 'TIME', value: 'TIME' },
    { label: 'TIMESTAMP', value: 'TIMESTAMP' },
    // { label: 'CLOB', value: 'CLOB' },
    // { label: 'BLOB', value: 'BLOB' },
    // { label: 'ARRAY', value: 'ARRAY' },
    // { label: 'DISTINCT', value: 'DISTINCT' },
    // { label: 'STRUCT', value: 'STRUCT' },
    // { label: 'REF', value: 'REF' },
    // { label: 'DATALINK', value: 'DATALINK' },
  ]
  dictionaryOptions = [];
  dictionarys = [];
  searchData = {
    areaCode: '',
    hosNum: '',
    nodeCode: '',
    jsonType: '',
    emrType: [],
    mapperJsonName: '',
    clcType: '',
    pageNo: 1,
    pageSize: 20,
    sortOrder: 1,
  }

  paginateInfo: any = {
    totalNum: 0,
    pageSize: 20,
    pageNo: 1,
    first: 0
  };

  configPaginateInfo: any = {
    pageSize: 50,
    first: 0
  }

  msgs: Message[] = [];
  saveDisabled = false;
  @ViewChild(DictionaryComponent)
  dictionaryComponent: DictionaryComponent;
  copyGroupDataList: any[] = [];
  isShowCopyGroupDialog: boolean = false;
  selectCopyGroup: any;
  isSysAdmin: boolean;
  areasAndHospitals: TreeNode[];
  selectedNode: TreeNode;
  filterHospitalName: String = '';

  constructor(
    private loadingService: LoadingService,
    private emrReportService: EmrReportService,
    private myService: EmrReportService,
    private confirmationService: ConfirmationService,
    private sysParamService: SysParamService,
    private authTokenService: AuthTokenService) { }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    if (!this.sysParamService.isAreaUser(this.currentUserInfo)) {
      this.isSysAdmin = false;
      this.searchData['areaCode'] = this.currentUserInfo.areaCode;
      this.searchData['hosNum'] = this.currentUserInfo.hosNum;
      this.searchData['nodeCode'] = this.currentUserInfo.nodeCode;
      this.initEmrType('住院');
      this.initEmrType('门诊');
      this.doSearch();
    } else {
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
          for (let area of interfaceResult) {
            area['label'] = area['areaName'].toString();
            area['data'] = area['areaCode'].toString();
            area['expanded'] = true;//区域默认展开
            area['expandedIcon'] = 'fa-folder-open';
            area['collapsedIcon'] = 'fa-folder';
            area['children'] = [];
            area['checked'] = true;
            let hospitals = area['hospitalParam'];
            if (hospitals.length > 0) {
              let childrens = [];
              for (let hospital of hospitals) {
                hospital['label'] = hospital['医院名称'];
                hospital['data'] = hospital['医院编码'];
                hospital['院区编码'] = hospital['院区编码'];
              }
              area['children'] = hospitals;
            }
          }
          this.areasAndHospitals = interfaceResult;
          if (this.areasAndHospitals.length > 0 && this.areasAndHospitals[0].children && this.areasAndHospitals[0].children.length > 0) {
            this.selectedNode = this.areasAndHospitals[0].children[0];
            this.searchData['areaCode'] = this.areasAndHospitals[0]["areaCode"];
            this.searchData['hosNum'] = this.selectedNode['医院编码'];
            this.searchData['nodeCode'] = this.selectedNode['医院编码'];
            this.initEmrType('住院');
            this.initEmrType('门诊');
            this.doSearch();
          }
        }
        this.loadingService.loading(false);
      },
      error => {
        this.loadingService.loading(false);
        this.showMessage('error', '', '获取区域及医院列表失败，请稍后再试');
      }
    );
  }

  // 切换区域医院
  selectNode() {
    if (this.selectedNode && this.selectedNode['parent'] == undefined && this.selectedNode['医院名称'] == null) {
      this.showMessage('warn', '提示', '请选择医院!');
      return;
    } else {
      let currentDeptCode = this.selectedNode['科室ID'];
      if (currentDeptCode == undefined) {//选择的是医院
        this.searchData['areaCode'] = this.selectedNode.parent["areaCode"];
        this.searchData['hosNum'] = this.selectedNode['医院编码'];
        this.searchData['nodeCode'] = this.selectedNode['院区编码'];
        this.initEmrType('住院');
        this.initEmrType('门诊');
        this.doSearch();
      }
    }
  }

  initEmrType(type) {
    let loginUser = {};
    loginUser['登录科室ID'] = this.currentUserInfo.currentDeptId;
    loginUser['用户ID'] = this.currentUserInfo.userId;
    loginUser['areaCode'] = this.searchData['areaCode'];
    loginUser['院区编码'] = this.searchData['nodeCode'];
    loginUser['医院编码'] = this.searchData['hosNum'];
    loginUser['authority'] = this.currentUserInfo.authority;
    loginUser['clcTemplateName'] = "";
    loginUser['userType'] = type == '门诊' ? '1' : '2';
    loginUser['userTypeCH'] = type;
    this.myService.getDirAndTemplateListByLoginUser(loginUser).then(
      emrTemplateDirs => {
        if (emrTemplateDirs) {
          emrTemplateDirs.forEach(item => {
            if (item['目录名称'] !== '体温单') {
              let itemList = item['模板列表'];
              if (itemList instanceof Array && itemList.length > 0) {
                itemList.forEach(templateItem => {
                  let name = RecordUtils.getRealNameInfo(templateItem['模板名称']);
                  this.emrTypes.push({ label: name, value: name });
                  if (type === '住院') {
                    this.emrTypesIn.push({ label: name, value: name });
                  } else {
                    this.emrTypesOut.push({ label: name, value: name });
                  }
                })
              }
            }
          })
        }
      },
      () => {
        this.showMessage('error', '', '获取病历列表失败，请稍后再试。');
      }
    );
  }

  doSearch(type?: string) {
    if (!type) {
      this.paginateInfo.pageNo = 1;
      this.paginateInfo.first = 0;
    }
    let _params;
    if (type !== 'all') {
      this.searchData.pageNo = this.paginateInfo.pageNo;
      this.searchData.pageSize = this.paginateInfo.pageSize;
      _params = this.searchData;
    } else {
      _params = { ...this.searchData };
      _params.pageNo = 1;
      _params.pageSize = 10000;
      _params.jsonType = this.projectData['jsonType'];
    }
    this.loadingService.loading(true);
    this.emrReportService.getDataList(_params).then(res => {
      if (res['code'] == 10000 && res['data']) {
        let data = res['data'];
        if (type !== 'all') {
          data.datalist.forEach((item) => {
            item['创建时间'] = format(item.createDate, 'yyyy-MM-dd HH:mm');
          })
          this.dataList = data.datalist;
          this.paginateInfo.totalNum = data.count;
        } else {
          let _copyProjectList = [];
          data.datalist.forEach((item) => {
            if (item['_id'] !== this.projectData['_id']) {
              _copyProjectList.push({ label: item.mapperJsonName, value: { _id: item['_id'], name: item.mapperJsonName } });
            }
          })
          this.copyProjectList = _copyProjectList;
        }
      }
      this.loadingService.loading(false);
    }, () => {
      this.paginateInfo.totalNum = 0;
      this.loadingService.loading(false);
      this.showMessage('error', '', '项目列表获取失败，请稍后再试。')
    });
  }

  getRecordMapperById(id, type = null) {
    let _params = {
      areaCode: this.searchData['areaCode'],
      hosNum: this.searchData['hosNum'],
      nodeCode: this.searchData['nodeCode'],
      id: id
    }
    this.emrReportService.getRecordMapperById(_params).then(res => {
      if (res['code'] == 10000 && res['data']) {
        let dataList = res['data']['inusmapperList'];
        if (dataList) {
          let maxSort = 0;
          if (type === 'copy') {
            this.configDataList.forEach(item => {
              if (item.sort > maxSort) {
                maxSort = item.sort;
              }
            })
          }
          dataList.forEach(item => {
            item.flag = '' + Math.random();
            if (type === 'copy') {
              maxSort++;
              item.sort = maxSort;
            } else {
              item.sort = this.projectData['jsonType'] === '回写HIS' ? item.index : item.idno;
            }
            let booleanFields = this.projectData['jsonType'] === '首页上报' ? ['code', 'fee', 'patient'] : this.projectData['jsonType'] === '数据导出' ? ['patient'] : ['unique', 'patient', 'code', 'medicalInsurance', 'time', 'notNull', 'acsn'];
            booleanFields.forEach(itemField => {
              item[itemField] = item[itemField] === "false" ? false : item[itemField] === "true" ? true : null;
            })
            if (item.choiceid) {
              item.choiceName = this.dictionarys.find(itemDictionary => {
                return itemDictionary['_id'] === item.choiceid;
              }).value;
            }
            if (item.diagMapperType) {
              item['_diagMapperType'] = item.diagMapperType == 'code' ? '编码' : '名称';
            }
            if (this.projectData['jsonType'] === '首页上报') {
              if (typeof item.value === 'string') {
                item['_value'] = item.value.split(',');
              } else {
                item['_value'] = item.value;
              }
            }
          })
        }
        if (type === 'copy') {
          let list = dataList ? dataList : [];
          this.configDataList = [...this.configDataList, ...list];
          this.isShowCopyDialog = false;
        } else {
          this.configDataList = dataList ? dataList : [];
        }
      }
      this.saveDisabled = false;
      this.loadingService.loading(false);
    }, () => {
      this.saveDisabled = false;
      this.loadingService.loading(false);
      this.showMessage('error', '', '配置内容获取失败，请稍后再试。')
    });
  }

  getOptionDictList(id) {
    let _params = {
      areaCode: this.searchData['areaCode'],
      hosNum: this.searchData['hosNum'],
      nodeCode: this.searchData['nodeCode'],
      value: ''
    }
    this.emrReportService.getOptionDictList(_params).then(res => {
      if (res['code'] == 10000 && res['data']) {
        let resData = res['data'];
        this.dictionarys = resData;
        let names = [];
        names.push({ label: '请选择', value: '' });
        resData.forEach(item => {
          names.push({ label: item.value, value: item.value })
        })
        this.dictionaryOptions = names;
        this.getRecordMapperById(id);
      }
      this.loadingService.loading(false);
    }, () => {
      this.loadingService.loading(false);
      this.showMessage('error', '', '字典列表获取失败，请稍后再试。')
    });
  }

  openConfigDialog(data) {
    this.projectData = data;
    this.isShowConfigDialog = true;
    if (this.projectData['jsonType'] === '首页上报') {
      this.getOptionDictList(data['_id']);
    } else {
      this.getRecordMapperById(data['_id']);
    }
  }

  showAddDialog(data, type) {
    if (data) {
      let _data = { ...data };
      _data['_emrType'] = this.projectData['jsonType'] === '回写HIS' ? _data['emrType'] : _data['emrType'].split(',');
      this.projectData = _data;
    } else {
      this.projectData = {
        mapperJsonName: '',
        clcType: '2',
        _emrType: this.projectData['jsonType'] === '回写HIS' ? '' : [],
        exportFileName: '',
        jsonType: '首页上报'
      };
    }
    this.openDialogType = type;
    this.isShowAddDialog = true;
  }

  addProject() {
    let hasEmpty = !this.projectData.mapperJsonName || !this.projectData.clcType || !this.projectData._emrType.length || (this.projectData['jsonType'] !== '回写HIS' && !this.projectData.exportFileName) || !this.projectData.jsonType
    if (hasEmpty) {
      this.showMessage('warn', '提示', '未填写必填项!');
      return;
    }
    this.projectData.emrType = this.projectData['jsonType'] === '回写HIS' ? this.projectData._emrType : this.projectData._emrType.join(',');
    this.doSave();
  }



  addConfigData() {
    let newData = new ConfigDataInfoCustom();
    newData.flag = '' + Math.random();
    let maxSort = 0;
    this.configDataList.forEach(item => {
      if (item.sort > maxSort) {
        maxSort = item.sort;
      }
    })
    newData.sort = maxSort + 1;
    this.configDataList = this.configDataList.concat(newData);
    let _length = this.configDataList.length ? this.configDataList.length - 1 : 0;
    this.configPaginateInfo.first = Math.floor(_length / this.configPaginateInfo.pageSize) * this.configPaginateInfo.pageSize;
  }


  removeConfigData() {
    let flags = this.selectedConfigData.map(item => item.flag);
    this.configDataList = this.configDataList.filter(item => {
      return !flags.includes(item.flag);
    })
    this.selectedConfigData = [];
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }

  showDictionaryDialog() {
    this.dictionaryComponent.showDictionaryDialog();
  }

  doSave() {
    let hasEmpty = false;
    let sortRepeat = false;
    let sortValue = {};
    this.configDataList.forEach(item => {
      if (this.projectData['jsonType'] === '首页上报') {
        if (!item.name) {
          hasEmpty = true;
        }
      } else if (this.projectData['jsonType'] === '数据导出') {
        if (!item.value) {
          hasEmpty = true;
        }
      } else {
        if (!item.value || (!item.name && !(item.time || item.acsn || item.defaultval))) {
          hasEmpty = true;
        }
      }

      if (sortValue[item.sort]) {
        sortRepeat = true;
      } else {
        sortValue[item.sort] = true;
      }
    })
    if (hasEmpty) {
      if (this.projectData['jsonType'] === '首页上报') {
        this.showMessage('warn', '提示', '导出名称、排序值必填!');
      } else if (this.projectData['jsonType'] === '数据导出') {
        this.showMessage('warn', '提示', '数据元名称、排序值必填!');
      }else {
        this.showMessage('warn', '提示', '数据元名称、HIS字段 、排序值必填!');
      }
      return;
    }
    if (sortRepeat) {
      this.showMessage('warn', '提示', '排序字段不能重复!');
      return;
    }
    let _projectData = { ...this.projectData };
    delete _projectData['创建时间'];
    let body = {
      areaCode: this.searchData['areaCode'],
      医院编码: this.searchData['hosNum'],
      院区编码: this.searchData['nodeCode'],
      createUserId: this.currentUserInfo['userId'],
      createUserName: this.currentUserInfo['userName'],
      ..._projectData
    }
    this.configDataList.forEach(item => {
      if (this.projectData['jsonType'] === '回写HIS') {
        item.index = item.sort;
      } else {
        item.idno = item.sort;
      }
      if (item.choiceName) {
        let selectedDic = this.dictionarys.find(itemDictionary => {
          return itemDictionary.value === item.choiceName;
        });
        item.choice = selectedDic.choice;
        item.choiceid = selectedDic['_id'];
      } else {
        item.choice = null;
        item.choiceid = "";
      }
      delete item.choiceName;
      if (this.projectData['jsonType'] === '首页上报') {
        if (item._diagMapperType) {
          item.diagMapperType = item['_diagMapperType'] == '编码' ? 'code' : 'name'
          delete item._diagMapperType;
        } else {
          item.diagMapperType = '';
        }
        if(item['_value']!=null){
          item.value = item['_value'].length === 1 ? item['_value'][0] : [...item._value];
        }else {
          item.value = null;
        }
        delete item._value;
      }
      delete item.sort;
      delete item.flag;
    })
    body.inusmapperList = this.configDataList;
    this.loadingService.loading(true);
    this.saveDisabled = true;
    this.emrReportService.saveRecordMapperData(body).then(res => {
      if (res['code'] == 10000) {
        this.showMessage('success', '', '保存成功');
        //判断是否是内容配置保存,刷新项目列表或内容列表
        if (this.isShowAddDialog) {
          this.doSearch();
        } else {
          this.getRecordMapperById(this.projectData['_id']);
        }
        this.closeAddDialog();
      } else {
        this.saveDisabled = false;
        this.showMessage('error', '', res['msg'] || '保存失败，请稍后再试。')
      }
      this.loadingService.loading(false);
    }, () => {
      this.saveDisabled = false;
      this.loadingService.loading(false);
      this.showMessage('error', '', '保存失败，请稍后再试。')
    });
  }

  closeAddDialog() {
    this.isShowAddDialog = false;
    this.configDataList = [];
  }

  closeConfigDialog() {
    this.isShowConfigDialog = false;
    this.configDataList = [];
    this.selectedConfigData = [];
    this.configPaginateInfo.first = 0;
    this.configPaginateInfo.pageSize = 50;
  }

  doDelete(data) {
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除项目：' + data['mapperJsonName'] + ' 吗？',
      accept: () => {
        this.delete(data['_id']);
      }
    });
  }

  delete(id) {
    let params = {
      areaCode: this.searchData['areaCode'],
      hosNum: this.searchData['hosNum'],
      nodeCode: this.searchData['nodeCode'],
      id: id
    }
    this.emrReportService.deleteRecordMapperData(params).then(res => {
      if (res['code'] == 10000) {
        this.showMessage('success', '', '删除成功');
        this.doSearch();
      }
    }, () => {
      this.showMessage('error', '', '删除失败，请稍后再试。')
    });
  }

  onConfigPage($event) {
    this.configPaginateInfo.first = $event.first;
    this.configPaginateInfo.pageSize = $event.rows;
  }

  onPage($event) {
    this.paginateInfo.first = $event.first;
    this.paginateInfo.pageNo = ($event.first / $event.rows) + 1;
    this.paginateInfo.pageSize = $event.rows;
    this.doSearch('page');
  }

  onSort($event) {
    this.searchData.sortOrder = $event['order'] || 1;
    this.doSearch('page');
  }

  addBorderColor($event) {
    var tr = $($event.originalEvent.target).closest('tr');
    tr.siblings().removeClass('background-blue');
    tr.addClass('background-blue');
  }

  onRowClick($event) {
    this.addBorderColor($event);
  }

  copyConfigData() {
    this.doSearch('all');
    this.isShowCopyDialog = true;
  }

  copyData(id) {
    this.getRecordMapperById(id, 'copy');
  }

  groupData() {
    this.selectedConfigData.forEach(item => {
      item.groupFlag = null;
    })
    let maxGroup = 0;
    this.configDataList.forEach(item => {
      if (item.groupFlag > maxGroup) {
        maxGroup = item.groupFlag;
      }
    })
    this.selectedConfigData.forEach(item => {
      item.groupFlag = maxGroup + 1;
    })
    this.selectedConfigData = [];
  }

  copyGroupData() {
    this.copyGroupDataList = [];
    this.selectCopyGroup = null;
    let groupNumber = {}
    this.configDataList.forEach(item => {
      if (item['groupFlag'] || item['groupFlag'] == 0) {
        if (!groupNumber[item['groupFlag']]) {
          this.copyGroupDataList.push({ label: item['groupFlag'], value: [item] })
          groupNumber[item['groupFlag']] = true;
        } else {
          this.copyGroupDataList.forEach(data => {
            if (data.label == item['groupFlag']) {
              data.value.push(item)
            }
          })
        }
      }
    })
    if (!this.copyGroupDataList.length) {
      this.showMessage('warn', '提示', '暂无分组数据!');
      return;
    } else {
      this.isShowCopyGroupDialog = true;
    }
  }

  doCopyData() {
    this.confirmationService.confirm({
      header: '确认',
      icon: 'fa fa-trash',
      message: '确认复制项目：' + this.selectCopyProject.name + ' 吗？',
      accept: () => {
        this.copyData(this.selectCopyProject['_id']);
      }
    });
  }

  doCopyGroupData() {
    this.confirmationService.confirm({
      header: '确认',
      icon: 'fa fa-trash',
      message: '确认复制分组' + this.selectCopyGroup[0]['groupFlag'] + ' 吗？',
      accept: () => {
        this.groupDataCopy();
      }
    });
  }

  groupDataCopy() {
    let list = [];
    let maxSort = 0;
    let groupFlagMax = 0;
    this.configDataList.forEach(item => {
      if (item.sort > maxSort) {
        maxSort = item.sort;
      }
      if (item.groupFlag > groupFlagMax) {
        groupFlagMax = item.groupFlag;
      }
    })
    groupFlagMax++;
    this.selectCopyGroup.forEach(itemData => {
      let item = { ...itemData };
      item.flag = '' + Math.random();
      maxSort++;
      item.sort = maxSort;
      item.groupFlag = groupFlagMax;
      list.push(item);
    })
    this.configDataList = [...this.configDataList, ...list];
    this.isShowCopyGroupDialog = false;
  }

  timeOrAcsnSelect(checked, index) {
    if (checked) {
      this.configDataList[index]['name'] = null;
      this.configDataList = [...this.configDataList];
    }
  }

  filterDataSource($event) {
    this.loadingService.loading(true);
    let key = $event.query;
    let data = this.projectData;
    let params = {
      names: data.emrType,
      clcType: data.clcType,
      key: key
    }
    this.emrReportService.getallFileds(params).then(res => {
      if (res['code'] == 10000 && res['data']) {
        this.datasources = res['data'];
      }
      this.loadingService.loading(false);

    }, () => {
      this.loadingService.loading(false);
      this.showMessage('error', '', '数据元列表获取失败，请稍后再试。')
    });
  }
}
