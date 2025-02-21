import { CurrentUserInfo } from "../../../../../basic/common/model/currentUserInfo.model";
import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { SysParamService } from "../../../sys-param.service";

@Component({
  selector: "record-params",
  templateUrl: "./record.component.html",
  styleUrls: ["../../business-param.component.scss"],
  providers: [SysParamService],
})
export class RecordParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() _showOptionsLabel;
  @Input() saveHospitalParams;
  @Input() vertifyNumber;
  @Input() searchRecordDataSource;
  @Input() saveHosParamByKey;
  @Input() selectParamType;
  @Input() paramBean;
  @Input() msgs;
  baseRecordDataSourceGroup: any[] = [];
  currentUserInfo: CurrentUserInfo;
  disabledAutoSaveEditoInput: boolean = true;
  templateList: any = []; // 另页打印选择模板列表
  emrTemplates: any[]; // 自动新建病案首页目录下的模板列表
  emrNursingTemplate: any[]; // 自动新建文书类病历列表
  isAllDsLoaded: boolean = false;
  homePageDefaultValue = {
    depValues: [],
    hosValues: "",
  };
  quickHTMLTabs = [
    { label: "标准", value: "quickInputHTML" },
    { label: "成都成华区第三人民医院", value: "CDCHQDSRMYYquickInputHTML" },
  ];
  // 所有模板列表
  allTemplates: any = [];
  // 模板绑定数据源
  templateBindDs = {};
  allDs = [];
  filterDs: any = [];
  constructor(private sysParamService: SysParamService) {}
  ngOnInit(): void {
    this.currentUserInfo = this.sysParamService.getCurUser();
    console.log(this.baseRecordDataSourceGroup);
  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  showOptionsLabel(list, value) {
    return this._showOptionsLabel(list, value);
  }

  // 成组病历设置
  saveGroupRecord(type, event) {
    if ((type == "switch" && event.checked) || type == "input") {
      if (!this.paramBean["成组病历设置"]["成组病历"]) {
        this.msgs = [];
        this.msgs.push({ severity: "warn", detail: "请填写成组病历名称" });
        return;
      }
    }
    this.saveHospitalParams();
  }

  doCheckedEvtChanged(evt, data, type) {
    if (evt == false) {
      data[type + "Templates"] = [];
    }
  }

  editClick() {
    if (this.paramBean["书写自动保存"]["启用"]) {
      this.disabledAutoSaveEditoInput = false;
    }
  }

  saveAutoSaveParams() {
    if (this.paramBean["书写自动保存"]["时间间隔"] < 1) {
      this.paramBean["书写自动保存"]["时间间隔"] = 1;
    }
    this.disabledAutoSaveEditoInput = true;
    this.saveHospitalParams();
  }

  addbaseRecordDataSource() {
    let n = ((this.baseRecordDataSourceGroup || [])[0] || {})["name"] || "";
    this.baseRecordDataSourceGroup.push({
      name: n,
      baseDatasource: "",
      renameDatasource: "",
      matchRule: "",
      realtimeSync: "",
    });
  }

  removebaseRecordDataSource(index) {
    this.baseRecordDataSourceGroup.splice(index, 1);
  }

  addDefaultValue(data) {
    data.push({
      value: null,
      科室ID: null,
    });
  }

  removeDefaultValue(data, index) {
    data.splice(index, 1);
  }

  //保存 病案首页数据元默认值
  saveDefaultValue() {
    var depValueStr = "";
    var hosValueStr = "";
    var saveFlag = true;
    this.homePageDefaultValue.depValues.forEach((item, index) => {
      if (!item.科室ID || !item.value) {
        saveFlag = false;
        return;
      }
      depValueStr += item.value + "&科室ID=" + item.科室ID;
      if (index < this.homePageDefaultValue.depValues.length - 1) {
        depValueStr += ",";
      }
    });
    if (!saveFlag) {
      this.msgs = [];
      this.msgs.push({ severity: "warn", detail: "请删除含空值的项" });
      return;
    }
    if (this.homePageDefaultValue.hosValues) {
      hosValueStr =
        (depValueStr ? "," : "") +
        this.homePageDefaultValue.hosValues +
        "&医院编码=" +
        this.currentUserInfo["hosNum"];
    }
    this.paramBean["病案首页默认值设置"] = depValueStr + hosValueStr;
    this.saveHospitalParams();
  }

  // 自动新建病历设置
  autoBuildSetting(val) {
    let e1 = [],
      e2 = [];
    if (val) {
      e1 = this.paramBean["自动新建病历设置"]["病历"] || [];
      e2 = this.paramBean["自动新建病历设置"]["文书病历"] || [];
      if (e1.length == 0 && e2.length == 0) {
        this.msgs = [];
        this.msgs.push({ severity: "warn", detail: "请选择病历" });
      }
    }
    this.paramBean["自动新建病历设置"]["病历"] = e1;
    this.paramBean["自动新建病历设置"]["文书病历"] = e2;
  }

  changeLevel3set(val) {
    if (val) {
      if (!this.paramBean["是否强制限制医生填写三级检诊"]["url"]) {
        this.msgs = [];
        this.msgs.push({ severity: "warn", detail: "请填写url" });
      }
    }
  }
  getTemplateDsTrue(data) {
    if (!data || !data["name"] || this.templateBindDs[data["name"]]) {
      return;
    }
    this.initTemplateDs([data["name"]]);
  }
  getTemplateDs(data) {
    if (!data || !data["name"]) {
      return [];
    }
    let n = data["name"];
    return [{ label: "请选择", value: "" }].concat(
      this.templateBindDs[n] || []
    );
  }

  initTemplateDs(nameArr) {
    let param = {
      templateNameList: nameArr,
      key: "",
      pageSize: 100000,
      currentPage: 0,
    };
    this.sysParamService.searchDataSourceListByParams(param).then((d) => {
      if (d["code"] == 10000) {
        let groupByName = ((d["data"] || {})["dataElementList"] || []).reduce(
          (p, c) => {
            let tn = c["templateName"];
            if (tn) {
              let dsArr = p[tn] || [];
              dsArr.push({
                label: c["dataSourceName"],
                value: c["dataSourceName"],
              });
              p[tn] = dsArr;
            }
            return p;
          },
          {}
        );
        Object.assign(this.templateBindDs, groupByName);
      } else {
        console.log(d);
        //this.templateBindDs[data['name']] = [];
      }
    });
  }
  initDs() {
    let obj = {};
    (this.baseRecordDataSourceGroup || []).forEach(
      (b) => (obj[b["name"]] = true)
    );
    let names = Object.keys(obj);
    if (names.length > 0) {
      this.initTemplateDs(names);
    }

    //this.allDs = [{"label":"请选择","value":""}];
    this.allDs = [];
    this.sysParamService.getAllDs().then((d) => {
      if (d["code"] == 10000) {
        d["data"].forEach((dd) => {
          this.allDs.push({ label: dd["name"], value: dd["name"] });
        });
      } else {
        console.log(d);
      }
      this.isAllDsLoaded = true;
    });
  }
  changeBaseDs(data) {
    if (!data["renameDatasource"]) {
      data["renameDatasource"] = data["baseDatasource"] || "";
      data["matchRule"] = "";
      data["realtimeSync"] = "";
      data["renameDatasourceObj"] = {
        code: "",
        name: data["baseDatasource"] || "",
      };
    }
  }
  saveBaseEmrSyncConfig() {
    // 校验数据

    let configBak = JSON.parse(
      JSON.stringify(this.baseRecordDataSourceGroup || [])
    );

    //let flag = true;
    let existObj = {};

    let len = (this.baseRecordDataSourceGroup || []).length;
    for (var i = 0; i < len; i++) {
      let c = this.baseRecordDataSourceGroup[i];
      c["realtimeSync"] = c["realtimeSync"] ? "Y" : "N";

      let selDs = c["renameDatasourceObj"];
      c["renameDatasource"] = (selDs || {})["name"] || "";
      let n = c["name"];
      let bds = c["baseDatasource"];
      let rds = c["renameDatasource"];
      if (!n) {
        this.showMsg("info", "病历名称不能为空");
        //flag = false;
        return;
      }

      if (!bds) {
        this.showMsg("info", "基础数据源不能为空");
        //flag = false;
        return;
      }
      if (!rds) {
        this.showMsg("info", "映射数据源不能为空");
        //flag = false;
        return;
      }

      if (existObj[n + "-" + bds + "-" + rds]) {
        this.showMsg("info", "已有相同配置：【" + n + ":" + bds + "】");
        //flag = false;
        return;
      }
      existObj[n + "-" + bds + "-" + rds] = true;
    }
    //if(flag){
    this.saveHospitalParams();
    //}
  }


  showMsg(type, msg) {
    this.msgs = [];
    this.msgs.push({ severity: type, detail: msg });
  }
  filterDsFun($event) {
    let text = $event.query;

    let ds = this.allDs.filter((d) => !text || d["label"].indexOf(text) > -1);
    let len = ds.length;
    var total = 100;

    if (len > 100) {
      this.filterDs = ds.slice(0, total);
    } else {
      this.filterDs = ds;
    }
  }
} 