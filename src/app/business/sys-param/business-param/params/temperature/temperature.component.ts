import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'temperature-params',
  templateUrl: './temperature.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class TemperatureParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() _showOptionsLabel;
  @Input() saveHospitalParams;
  @Input() selectParamType;
  @Input() paramBean;
  @Input() config;
  @Input() msgs;
  tempatureItemsOptions: any[];
  // 体温单配置的疼痛、呼吸是否使用
  enableConfig = {
    pain : false,
    breath : false
  };
  showItems = []; // 是否显示项配置
  templateLogo:string;
  nursingToTempSyncTime = [
    {label:'当天',value:'当天'},
    {label:'前一天',value:'前一天'}
  ];
  nursingToTempSyncSource = [
    {label:'护理小结',value:'护理小结'},
    {label:'护理总结',value:'护理总结'}
  ];
  widgetTypeOptions = [{label:'ComboBox',value:'ComboBox'},{label:'Spinner',value:'Spinner'},{label:'EditText',value:'EditText'}];
  trueOrFalseOptions = [{label:'是',value:true},{label:'否',value:false}];
  eventShowTypeOptions = [{ label: '展示', value: 'show' },{ label: '隐藏', value: 'hidden' }];

  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  showOptionsLabel(list, value) {
    return this._showOptionsLabel(list, value);
  }

  //增加配置
  addConfig(type, data) {
    if (type == 'curve' || type == 'pain') {
      data.push({
        "min": null,
        "max": null,
        "drawLine": null,
        "code": "",
        "displayName": "",
        "unit": "",
        "color": "",
        "regexPattern": "",
        "errorText": "",
        "optionStr": "",
        "widgetType": "",
        "order": null
      });
    } else if (type == 'relation') {
      data.push({
        "area": "",
        "codeA": "",
        "codeB": ""
      });
    } else if (type == 'event') {
      data.push({
        "事件代码": "",
        "事件名称": "",
        "患者类型": "",
        "是否显示时间": null,
        "是否绘制竖线": true,
      });
    } else if (type == 'once') {
      data.push({
        'isCustom': null,
        'code': '',
        'displayName': '',
        'unit': '',
        'color': '',
        'regexPattern': '',
        'errorText': '',
        'optionStr': '',
        'widgetType': '',
        'order': null
      });
    } else if (type == 'dictionary') {
      data.push({
        "体征名称": "",
        "体征代码": "",
        "体征单位": ""
      });
    }
  }

  removeConfig(data, index, type) {
    if (type) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', detail: '删除时注意【绘制关联关系的配置项】是否存在该项，若存在则删除对应的关联关系！' });
    }
    data.splice(index, 1);
  }

  // 保存 体温单配置
  saveConfig(type) {
    let arr1 = [];
    let arr2 = [];
    let flag = false;
    this.config['relationPairs'].forEach(element => {
      arr1.push(element.codeA);
      arr1.push(element.codeB);
    });
    this.config['curveConfigs'].forEach(element => {
      arr2.push(element.code);
    });
    this.config['painConfig'].forEach(element => {
      arr2.push(element.code);
    });
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) == -1) {
        flag = true;
        break;
      }
    }
    if (flag) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', detail: '【绘制关联关系的配置项】有不存在的数据项！' });
      return;
    }
    if (this.config['logo'] && this.config['logo']['open'] && !this.config['logo']['图标']) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', detail: '若开启【体温单标题是否使用图片logo】，请上传医院标题logo图片！' });
      return;
    }
    // 组装【是否显示项配置】的校验信息
    let onceConfigs = JSON.parse(JSON.stringify(this.config['onceConfigs']));
    if (this.showItems.length > 0) {
      let onceConfigsStr = JSON.stringify(onceConfigs);
      let showItemFlag = flag;
      for (let i = 0; i < this.showItems.length; i++) {
        let showItem = this.showItems[i];
        let code = '"code":"' + showItem['code'] + '"';
        if (onceConfigsStr.indexOf(code) == -1) {
          showItemFlag = true;
          break;
        } else {
          for (let j = 0; j < onceConfigs.length; j++) {
            if (onceConfigs[j]['code'] == showItem['code']) {
              onceConfigs[j]['checkField'] = showItem['checkField'];
              onceConfigs[j]['checkRule'] = showItem['checkRule'];
            }
          }
        }
      }
      if (showItemFlag) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', detail: '【是否显示项配置】在一日一次配置项中不存在！' });
        return;
      }
    }

    // 删除 一日一测项目 里面没有在【是否显示项配置】里配置的校验信息
    let showItemsStr = JSON.stringify(this.showItems);
    for (let i = 0; i < onceConfigs.length; i++) {
      if (onceConfigs[i]['checkField']) {
        let code = '"checkField":"' + onceConfigs[i]['checkField'] + '"';
        if (showItemsStr.indexOf(code) == -1) {
          delete onceConfigs[i]['checkField'];
          delete onceConfigs[i]['checkRule'];
        }
      }
    }
    this.config['onceConfigs'] = onceConfigs;
    if (type == 'baby') {
      this.paramBean['新生儿体温单配置'] = this.config;
    } else {
      this.paramBean['体温单配置'] = this.config;
    }
    this.saveHospitalParams();
  }

  tempLogoUploader(event, type) {
    if (!event.files || !event.files[0]) {
      return;
    }
    var _this = this;
    var reader = new FileReader();
    reader.onload = function (evt) {
      _this.paramBean[type]['logo']['图标'] = evt.target['result'];
      _this.templateLogo = evt.target['result'];
    }
    reader.readAsDataURL(event.files[0]);
  }

  // 呼吸、疼痛是否启用
  switchEnableConfig(type, val) {
    if (type == 'pain') {
      if (val) {
        this.config['painConfig'] = [{
          "min": -1,
          "max": 11,
          "drawLine": true,
          "code": "TTZ",
          "displayName": "疼痛",
          "unit": "",
          "color": "#00f",
          "regexPattern": "^([0-9]|10)$",
          "errorText": "0-10的数字",
          "optionStr": "",
          "widgetType": "EditText",
          "order": 25
        }, {
          "min": -1,
          "max": 11,
          "drawLine": true,
          "code": "TTFP",
          "displayName": "疼痛复评",
          "unit": "",
          "color": "#f00",
          "regexPattern": "^([0-9]|10)$",
          "errorText": "0-10的数字",
          "optionStr": "",
          "widgetType": "EditText",
          "order": 27
        }];
      } else {
        this.config['painConfig'] = [];
      }
    }
    if (type == 'breath') {
      if (val) {
        this.config['breathConfig'] = {
          "code": "HX",
          "displayName": "呼吸",
          "unit": "次/分",
          "color": "#000",
          "regexPattern": "^50$|^[1-4][0-9]$|^[0-9]$",
          "errorText": "0~50的数字",
          "optionStr": "外出$拒测",
          "widgetType": "ComboBox",
          "order": 28,
          "useIcon": true
        };
      } else {
        this.config['breathConfig'] = {};
      }
    }
  }

  // 增加是否显示项配置
  addShowItems(data) {
    data.push({
      'displayName': '',
      'code': '',
      'checkField': '',
      'checkRule': ''
    });
  }
  removeShowItems(data, index) {
    data.splice(index, 1);
  }
}
