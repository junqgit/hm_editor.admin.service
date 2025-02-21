export class BusinessParamBean {
  _id: string;
  createTime: Date;
  modifyTime: Date;
  医院编码: string;
  院区编码: string;
  住院号病案号显示映射: any;
  护理表单生成病历是否弹出打印界面: boolean;
  房颤病人体温单阴影区域绘制: any;
  病历模板排序规则: string;
  书写自动保存: object;
  小助手体征: object;
  是否启用修订: any;
  分页模式下留痕是否打印: any;
  书写编辑权限: any;
  病历公共编辑权限: any;
  聚合病历子病历编辑锁定设置: boolean;
  是否根据职称设置上级医师: boolean;
  病案借阅审批: any;
  借阅归还时限: object;
  三级检诊: any;
  质控定时器: object;
  系统名称以及LOGO: object;
  另页打印设置: object;
  手术后天数计算规则: string;
  新建病历默认范围: string;
  医学表达式末次月经默认值设置: object;
  是否显示区域模板: boolean;
  电子病历历史版本是否显示过期: boolean;
  过期模板是否可新建病历: boolean;
  护理表单保存是否同步生成病历: boolean;
  患者住院天数计算方式: string;
  体温单手术天数是否显示0天: boolean;

  护理表单签名及修改权限设置: object;
  是否使用httpPrinter打印:object;

  质控规则不合格能否提交病历: boolean;
  护理文书未提交能否提交病历: boolean;

  禁止复制其他患者病历: any;
  病历模板套餐收藏: boolean;
  护士批量删除护理记录权限: boolean;
  自动质控设置: object;
  生成产程图: boolean;
  基础病历数据源配置: object;
  质控时是否可修改病历: object;
  医生是否启用收藏科室模板: boolean;
  护士是否启用收藏科室模板: boolean;
  是否实时计算年龄: boolean;
  住院病案首页是否使用快捷输入页面: boolean;
  新生儿是否走质控流程: boolean;
  是否可以查阅全院病人病历: boolean;
  病案管理员设置可编辑病历: string[];
  病案管理导出EXCEL时间字段格式化形式: object;
  是否开启病历重命名: boolean;
  小助手检查是否对接心电图: object;
  小助手是否显示输血项: boolean;
  是否可以查看已归档病历: boolean;
  纸质版归档: object;
  出院患者是否倒序排序: boolean;
  体温单配置: any;
  新生儿体温单配置: any;
  新生婴儿是否使用成人体温单: any;
  体温单显示版本配置: any;
  体温单显示房颤阴影: any;
  体温单显示心率脉搏连线: any;
  体温单是否绘制体温上升下降标记: any;
  体温单显示在前一天的一日一测体征CODE配置: string[];
  病案质控是否显示空病历患者:boolean;
  病案首页默认值设置: string;
  病历书写患者列表是否显示模板别名:boolean;
  中药引入格式:string;
  护理表单数据是否允许复制:boolean;
  入院记录是否聚合显示病历: boolean;
  签名锁定: boolean;
  病历书写粘贴数据格式:string;
  消息提醒是否启用按主治医生提醒:boolean;
  病案首页是否启用验证功能: boolean;
  病案首页是否同步手术信息:boolean;
  逾期锁定病历设置: object;
  逾期天数设置: object;
  病案归档回写归档状态:object;
  病历书写界面点击患者姓名展示病历设置:string;
  登陆立即进行质控提示:boolean;
  护理表单是否顺序排序:boolean;
  护理表单签名是否倒序排序:boolean;
  cdss对接设置:object;
  病案管理可编辑的用户:string;
  病历排序方式:string;
  门诊病历排序方式:string;
  状态项目设置:object;
  病案归档是否需要维护档案号;
  过期模板不能收藏:boolean;
  病历打印前是否自动保存:boolean;
  自动新建病历设置:object;
  成组病历设置:object;
  病历显示尺寸:any;
  首页诊断: object;

  快捷页面名称:string;
  表单录入同步新版体温单字段映射:object;
  是否启用三级检诊:boolean;
  是否强制限制医生填写三级检诊:object;
  就诊历史信息查看配置:object;
  实时编辑分页:object;
  分页模式打印是否生成pdf:boolean;
  是否启用新质控规则配置:boolean;
  质控流程配置:object;
  右键解锁与锁定:boolean;
  是否显示患者列表:boolean;
  需要以病历名称排序的成组病历目录:string;
  出院后未提交质控提醒天数设置: string;
  待办提醒事项设置:object;
  病程记录超过设置个数时按需加载:object;
  经治医生可以编辑患者所有病历:boolean;
  个人收藏模板是否允许跨科室查询:boolean;
  体温单住院天数从入院第二天算起:boolean;
  新版体温单同步表单录入字段映射: object;
  pda全局设置:any;
  pda输血流程设置:any;
  护理表单数据分页数量:object;
  护理表单默认分页数:object;
  出院患者在病历书写页面不能打印病案首页:boolean;
  签名设置:object;
  第三方目录集成:object;
  护理文书显示已提交病案患者:boolean;
  新建病历使用文字按钮:boolean;
  全文检索跳转患者360页面设置:object;
  整改通知书描述: string;
  收藏科室模版是否需要审核:boolean;
  是否显示个人收藏模板:boolean;
  心率超过180绘制箭头标识:boolean;
  水印设置:object;
  病案首页DRG配置:String;
  不使用修订功能的病历:String;
  体温单手术后面显示手术次数: boolean;
  小助手是否显示抗菌药物: boolean;
  病历模板需要清空的数据元: string;
  constructor() {
    this._id = '';
    this.createTime = new Date();
    this.modifyTime = new Date();
    this.医院编码 = '';
    this.院区编码 = '';
    this.住院号病案号显示映射 = 'N';
    this.护理表单生成病历是否弹出打印界面 = true;
    this.房颤病人体温单阴影区域绘制 = '';
    this.书写自动保存 = {
      '启用': false,
      '时间间隔': 1,
      '单位': '分钟'
    };
    this.小助手体征 = {
      '启用': false,
      '移动护理接口ip': '',
      '移动护理接口port': '',
      'tokenPath': '',
      'signPath': ''
    };
    this.是否启用修订 = '';
    this.分页模式下留痕是否打印 = '';
    this.不使用修订功能的病历 = '';
    this.书写编辑权限 = '';
    this.病历公共编辑权限 = '';
    this.聚合病历子病历编辑锁定设置 = false;
    this.是否根据职称设置上级医师 = false;
    this.病案借阅审批 = '';
    this.借阅归还时限 = {
      '启用': false,
      '期限': 72,
      '单位': '小时'
    };
    this.三级检诊 = '';
    this.质控定时器 = {
      '启用': false,
      'areaCode': ''
    };
    this.系统名称以及LOGO = {
      '页签标题': '',
      '页签图标': '',
      '侧栏系统名称': '',
      '侧栏系统LOGO': ''
    };
    this.另页打印设置 = {
      'checkedType': [],
      'anotherTemplates': [],
      'aloneTemplates': [],
      'aloneWriteTemplates': []
    };
    this.手术后天数计算规则 = 'normal';
    this.新建病历默认范围 = 'area';
    this.医学表达式末次月经默认值设置 = {
      '启用': false,
      '默认值': '1900-00-00'
    };
    this.病历模板排序规则 = '默认';
    this.是否显示区域模板 = true;
    this.电子病历历史版本是否显示过期 = false;
    this.过期模板是否可新建病历 = true;
    this.护理表单保存是否同步生成病历 = true;
    this.患者住院天数计算方式 = '入院';
    this.体温单手术天数是否显示0天 = true;
    this.质控规则不合格能否提交病历 = false;
    this.护理文书未提交能否提交病历 =false;

    this.护理表单签名及修改权限设置 = {
      "启用": false,
      "可以修改他人记录": 'N',
      "修改是否可以变更签名": 'N',
      "密码校验": 'N',
      "本人是否密码校验": 'N'
    };
    this.是否使用httpPrinter打印 = {
      '启用': false
    };
    this.禁止复制其他患者病历 = 'N';
    this.病历模板套餐收藏 = false;
    this.护士批量删除护理记录权限 = false;
    this.自动质控设置 = {
      '院级质控自动通过天数': '30',
      '病案室自动归档天数': '30'
    };
    this.生成产程图 = false;
    this.基础病历数据源配置 = [];
    this.质控时是否可修改病历 = {
      '科级质控是否可修改病历': false,
      '院级质控是否可修改病历': false
    };
    this.医生是否启用收藏科室模板 = false;
    this.护士是否启用收藏科室模板 = false;
    this.是否实时计算年龄 = true;
    this.住院病案首页是否使用快捷输入页面 = false;
    this.新生儿是否走质控流程 = true;
    this.是否可以查阅全院病人病历 = false;
    this.病案管理员设置可编辑病历 = [];
    this.病案管理导出EXCEL时间字段格式化形式 = {};

    this.小助手是否显示输血项 = false;
    this.是否可以查看已归档病历 = true;
    this.是否开启病历重命名 = false;
    this.小助手检查是否对接心电图 = {
      '启用': false,
      '心电图网页IP：': '',
      '心电图网页端口号：': ''
    };
    this.纸质版归档 = {
      '启用': false,
      '归档时限': ''
    };
    this.出院患者是否倒序排序 = false;

    // 护理模块 新版的护理参数
    this.新生儿体温单配置 = this.getBabyTempatureParams_BZB();
    this.新生婴儿是否使用成人体温单 = false;
    this.体温单显示版本配置 = 'BZB';
    this.体温单显示房颤阴影 = 'N';
    this.体温单显示心率脉搏连线 = 'N'
    this.体温单是否绘制体温上升下降标记 = 'Y';
    this.体温单配置 = this.getTempatureParams_BZB();
    this.体温单显示在前一天的一日一测体征CODE配置 = [];
    this.病案质控是否显示空病历患者 = true;
    this.病案首页默认值设置 = '';
    this.病历书写患者列表是否显示模板别名=false;
    this.护理表单数据是否允许复制 = false;
    this.病历书写粘贴数据格式 = '带格式粘贴';
    this.入院记录是否聚合显示病历 = false;
    this.签名锁定 = false;
    this.中药引入格式 = '3';
    this.消息提醒是否启用按主治医生提醒 = false;
    this.病案首页是否启用验证功能 = false;
    this.病案首页是否同步手术信息 = true;
    this.逾期锁定病历设置 = {
      '启用': false,
      '出院后未提交质控时间': 7,
      '解锁后再次锁定时间': 3,
      '逾期时长起算天数': 0
    };
    this.逾期天数设置 = {
      '是否工作日':false,
      '出院后提交天数': 3,
      '出院后归档天数': 7,
    };
    this.病案归档回写归档状态 ={
      '更新表名称':"",
      '更新字段':"",

    }
    this.病历书写界面点击患者姓名展示病历设置 = 'emr';
    this.登陆立即进行质控提示 = true;
    this.病历显示尺寸='1';
    this.护理表单是否顺序排序 = false;
    this.护理表单签名是否倒序排序 = false;
    this.cdss对接设置 = {
      '启用':false,
      'ip':'',
      'port':''
    };
    this.状态项目设置 = {};
    this.病案管理可编辑的用户 = '';
    this.病历排序方式 = '按病历名称排序';
    this.门诊病历排序方式 = '按病历名称排序';
    this.需要以病历名称排序的成组病历目录 = '';
    this.病案归档是否需要维护档案号 = false;
    this.过期模板不能收藏 = false;
    this.病历打印前是否自动保存 = true;
    this.自动新建病历设置 = {
      '启用': false,
      '病历': []
    };
    this.成组病历设置 = {
      '启用':false,
      '成组病历':'',
      '成组病历合并打印':false
    };
    this.表单录入同步新版体温单字段映射 = {};
    this.是否启用三级检诊 = false;
    this.是否强制限制医生填写三级检诊 = {
      '启用': false,
      'url':''
    };
    this.就诊历史信息查看配置 = {
      '获取token地址': '',
      '用户名': '',
      '密码': '',
      '就诊历史信息地址':''
    };
    this.首页诊断 = {
      '首页名称': '',
      '诊断数据元': '',
      '诊断编码数据元': '',
    };
    this.实时编辑分页 = {
      '启用': false,
      '不分页病历模板': '',
      '打开病历时分页': false
    };
    this.分页模式打印是否生成pdf = false;
    this.是否启用新质控规则配置 = false;
    this.右键解锁与锁定 = false;
    this.是否显示患者列表 = false;
    this.出院后未提交质控提醒天数设置 = '';
    this.待办提醒事项设置 = {};
    this.个人收藏模板是否允许跨科室查询 = false;
    this.体温单住院天数从入院第二天算起 = false;
    this.新版体温单同步表单录入字段映射 = {
      '映射关系': '',
      '同步时间': '当天',
      '同步来源': '护理小结',
    };
    this.出院患者在病历书写页面不能打印病案首页 = false;
    this.新建病历使用文字按钮 = false;
    this.护理表单数据分页数量 = {};
    this.签名设置 = [
      { 'module': '病历书写', 'type': '', '密码校验': '', '本人是否密码校验': true},
      { 'module': '护理表单', 'type': '文字'}
    ];
    this.第三方目录集成 = [
      { "name": "长期医嘱单", "address": "http://ip:port/his/emr/ordersToEMR.htm?inpno=住院号&hosnum=医院编码&oType=long", "status":false},
      { "name": "临时医嘱单", "address": "http://ip:port/his/emr/ordersToEMR.htm?inpno=住院号&hosnum=医院编码&oType=short","status":false},
      { "name": "费用信息", "address": "http://ip:port/his/emr/NurseNewBusToEMR.htm?inpno=住院号&hosnum=医院编码","status":false},
      { "name": "检验结果", "address": "http://ip:port/his/inpHistory/CheckOutAndInspect.htm?tMake=JY&inpno=住院号&shayneCode=病区ID&hosnum=医院编码&nodecode=院区编码&userId=用户ID&deptcode=科室ID","status":false },
      { "name": "检查结果", "address": "http://ip:port/his/inpHistory/CheckOutAndInspect.htm?tMake=JC&inpno=住院号&shayneCode=病区ID&hosnum=医院编码&nodecode=院区编码&userId=用户ID&deptcode=科室ID","status":false },
      { "name": "麻醉记录单", "address": "http://ip:port/Emr/ViewFrom?PatientID=患者ID&MrClass=ALL","status":false },
      { "name": "护理文书", "address": "http://ip:port/Report/index.htm?patientid=患者ID&visitid=住院次数","status":false },
      { "name": "血糖记录", "address": "http://ip:port/GlucoseReport.aspx?brbh=住院号&starttime=入院时间&endtime=出院时间","status":false}
    ];
    this.护理文书显示已提交病案患者 = false;
    this.全文检索跳转患者360页面设置 = {
      "360页面":"",
      "his360地址":"","his360用户名":"","his360密码":"","his360token":"",
      "集成平台360地址":""
    }
    this.收藏科室模版是否需要审核 = false;
    this.是否显示个人收藏模板 = true;
    this.心率超过180绘制箭头标识 = true;
    this.水印设置 = {
      '启用': false,
      "水印类型":"文字水印",
      "倾斜度数":"15",
      "透明度":"0.3",
      "水印列数":"3",
      "水印高度":"100",
      "文字内容":"",
      "字体大小":"28",
      "字体颜色":"red",
      "图片":"",
      "打印显示水印":false
    };
    this.病案首页DRG配置= '';
    this.体温单手术后面显示手术次数 = false;
    this.小助手是否显示抗菌药物 = false;
    this.病历模板需要清空的数据元 = '健康卡号,身份证号码,病案号,住院号,姓名,性别,出生日期,年龄,住院天数,入院诊断,工作单位名称,联系人姓名,联系人与患者的关系代码,出生地_省,出生地_市,出生地_县,籍贯_省,籍贯_市,住址_省,住址_市,住址_县,户籍_省,户籍_市,户籍_县,单位电话,单位邮编,户籍邮编,床位号,联系人电话,婚姻状况,职业类别代码,患者电话号码,联系人,入院病房,出院病房,科室名称,医师签名,签名位,审签签名位';
  }


  /**
   * 体温单标准版参数
   * @returns
   */
  getTempatureParams_BZB() {
    let config = {
      'font' : 'Microsoft YaHei',
      'sizeConfig' : {
        'curveRowCount' : 45,
        'footRowCount' : 12
      },
      'timePoint' : ['2', '6', '10', '14', '18', '22'],
      "curveConfigs" : [{
        "min" : 34,
        "max" : 42,
        "drawLine" : true,
        "code" : "TW",
        "displayName" : "体温",
        "unit" : "℃",
        "color" : "#00f",
        "regexPattern" : "^(3([5-9])|4([0-3]))(\\.[0-9])?[G,K,Y,E]{0,1}$",
        "errorText" : "体温应在35.0~43.9之间",
        "optionStr" : "不升$拒测$手术$外出$36.$37.",
        "widgetType" : "ComboBox",
        "order" : 22
      }, {
        "min" : 20,
        "max" : 180,
        "drawLine" : true,
        "code" : "XL",
        "displayName" : "心率",
        "unit" : "次/分",
        "color" : "#00f",
        "regexPattern" : "^(?:0|[1-9][0-9]?|100)$",
        "errorText" : "0~100的数字",
        "optionStr" : "",
        "widgetType" : "EditText",
        "order" : 24
      }, {
        "min" : 20,
        "max" : 180,
        "drawLine" : true,
        "code" : "MB",
        "displayName" : "脉搏",
        "unit" : "次/分",
        "color" : "#f00",
        "regexPattern" : "^220$|^(1[0-9][0-9])$|^(2[0,1][0-9])$|^(\\d{2})$|^[0-9]$",
        "errorText" : "0~220的单位为（次/分）的数字",
        "optionStr" : "",
        "widgetType" : "EditText",
        "order" : 26
      }, {
        "min" : 34,
        "max" : 42,
        "drawLine" : false,
        "code" : "JWHTW",
        "displayName" : "降温后体温",
        "unit" : "",
        "color" : "#f00",
        "regexPattern" : "",
        "errorText" : "",
        "optionStr" : "不升",
        "widgetType" : "ComboBox",
        "order" : 29
      }],
      "painConfig" : [{
        "min" : -1,
        "max" : 11,
        "drawLine" : true,
        "code" : "TTZ",
        "displayName" : "疼痛",
        "unit" : "",
        "color" : "#00f",
        "regexPattern" : "^([0-9]|10)$",
        "errorText" : "0-10的数字",
        "optionStr" : "",
        "widgetType" : "EditText",
        "order" : 25
      }, {
        "min" : -1,
        "max" : 11,
        "drawLine" : true,
        "code" : "TTFP",
        "displayName" : "疼痛复评",
        "unit" : "",
        "color" : "#f00",
        "regexPattern" : "^([0-9]|10)$",
        "errorText" : "0-10的数字",
        "optionStr" : "",
        "widgetType" : "EditText",
        "order" : 27
      }],
      "breathConfig" : {
        "code" : "HX",
        "displayName" : "呼吸",
        "unit" : "次/分",
        "color" : "#000",
        "regexPattern" : "^50$|^[1-4][0-9]$|^[0-9]$",
        "errorText" : "0~50的数字",
        "optionStr" : "",
        "widgetType" : "EditText",
        "order" : 28
      },
      "headerConfig" : [{
        "titleText" : "日期",
        "contentType" : "Date"
      }, {
        "titleText" : "住院天数",
        "contentType" : "inpDays"
      }, {
        "titleText" : "手术后天数",
        "contentType" : "operationDays"
      }],
      "relationPairs" : [{
        "area" : "CurveArea",
        "codeA" : "TW",
        "codeB" : "JWHTW"
      }, {
        "area" : "PainArea",
        "codeA" : "TTZ",
        "codeB" : "TTFP"
      }],
      "eventData": [{
        "事件代码": "RY",
        "事件名称": "入院",
        "患者类型": "1",
        "是否显示时间": true,
        "是否绘制竖线": true
      },
        {
          "事件代码": "ZZ",
          "事件名称": "转出",
          "患者类型": "1",
          "是否显示时间": true,
          "是否绘制竖线": true
        },
        {
          "事件代码": "SS",
          "事件名称": "手术",
          "患者类型": "1",
          "是否显示时间": true,
          "是否绘制竖线": true
        },
        {
          "事件代码": "FM",
          "事件名称": "分娩",
          "患者类型": "1",
          "是否显示时间": true,
          "是否绘制竖线": true
        },
        {
          "事件代码": "CY",
          "事件名称": "出院",
          "患者类型": "1",
          "是否显示时间": true,
          "是否绘制竖线": true
        },
        {
          "事件代码": "SW",
          "事件名称": "死亡",
          "患者类型": "1",
          "是否显示时间": true,
          "是否绘制竖线": true
        }],
      'eventShowType': 'show',
      'onceConfigs' : [{
        'isCustom' : false,
        'code' : 'XYA',
        'displayName' : '血压(上午)',
        'unit' : 'mmHg',
        'color' : '#000',
        'regexPattern' : '^([4-9]\\d?|^[1-2]\\d\\d|^300)/([4-9]\\d?|[1-2]\\d\\d|300)$',
        'errorText' : '形如110/80的文字',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 8
      }, {
        'isCustom' : false,
        'code' : 'XYB',
        'displayName' : '血压(下午)',
        'unit' : 'mmHg',
        'color' : '#000',
        'regexPattern' : '^([4-9]\\d?|^[1-2]\\d\\d|^300)/([4-9]\\d?|[1-2]\\d\\d|300)$',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 9
      }, {
        'isCustom' : false,
        'code' : 'SG',
        'displayName' : '身高',
        'unit' : 'cm',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 10
      }, {
        'isCustom' : false,
        'code' : 'TZ',
        'displayName' : '体重',
        'unit' : 'kg',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '卧床$平车$轮椅',
        'widgetType' : 'ComboBox',
        'order' : 11
      }, {
        'isCustom' : false,
        'code' : 'NL',
        'displayName' : '尿量',
        'unit' : 'ml',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 12
      }, {
        'isCustom' : false,
        'code' : 'DBCS',
        'displayName' : '大便',
        'unit' : '次',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : 'ml/C$*',
        'widgetType' : 'ComboBox',
        'order' : 13
      }, {
        'isCustom' : false,
        'code' : 'XBCS',
        'displayName' : '小便',
        'unit' : '次',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 14
      }, {
        'isCustom' : false,
        'code' : 'ZRL',
        'displayName' : '总入量',
        'unit' : 'ml',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 15
      }, {
        'isCustom' : false,
        'code' : 'ZCL',
        'displayName' : '总出量',
        'unit' : 'ml',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 16
      }],
      'inHosEventUseInDeptTimeFirst':false
    };
    return config;
  }

  /**
   * 新生儿体温单标准版参数
   * @returns
   */
  getBabyTempatureParams_BZB() {
    let config = {
      'font' : 'Microsoft YaHei',
      'sizeConfig' : {
        'curveRowCount' : 40,
        'footRowCount' : 12,
      },
      'timePoint' : ['2', '6', '10', '14', '18', '22'],
      'onceConfigs' : [{
        'code' : 'BABY_DBCS',
        'isCustom' : false,
        'displayName' : '大便',
        'unit' : '次',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : 'ml/C$*',
        'widgetType' : 'ComboBox',
        'order' : 1
      }, {
        'code' : 'BABY_XBCS',
        'isCustom' : false,
        'displayName' : '小便',
        'unit' : '次',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 2
      }, {
        'code' : 'BABY_SC',
        'isCustom' : false,
        'displayName' : '身长',
        'unit' : 'cm',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 3
      }, {
        'code' : 'BABY_XW',
        'isCustom' : false,
        'displayName' : '胸围',
        'unit' : 'cm',
        'color' : '#000',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 4
      }, {
        'code' : 'BABY_TTW',
        'isCustom' : false,
        'displayName' : '头围',
        'unit' : 'cm',
        'color' : '#000',
        'regexPattern' : '^(3([5-9])|4([0-3]))(\.[0-9])?[G,K,E,Y]{0,1}$',
        'errorText' : '正确格式：35.6G',
        'optionStr' : '',
        'widgetType' : 'EditText',
        'order' : 5
      }
      ],
      'curveConfigs' : [{
        'code' : 'BABY_TW',
        'color' : '#00f',
        'min' : '34',
        'max' : '42',
        'pattern' : 'cross',
        'drawType' : 'stroke',
        'drawLine' : true,
        'displayName' : '体温',
        'unit' : '℃',
        'regexPattern' : '^(3([5-9])|4([0-3]))(\\.[0-9])?[G,K,Y,E]{0,1}$',
        'errorText' : '体温应在35.0~43.9之间',
        'optionStr' : '不升$拒测$手术$外出$36.$37.',
        'widgetType' : 'ComboBox',
        'order' : 6
      }, {
        'code' : 'BABY_TZ',
        'color' : '#f00',
        'min' : '-400',
        'max' : '400',
        'pattern' : 'circle',
        'drawType' : 'fill',
        'displayName' : '体重',
        'unit' : 'kg',
        'regexPattern' : '',
        'errorText' : '',
        'optionStr' : '卧床$平车$轮椅',
        'widgetType' : 'ComboBox',
        'order' : 7
      }, {
        'code' : 'BABY_JWHTW',
        'color' : '#f00',
        'min' : '34',
        'max' : '42',
        'pattern' : 'circle',
        'drawType' : 'stroke',
        'drawLine' : false,
        'displayName' : '降温后体温',
        'unit' : '',
        'regexPattern' : '^(3([5-9])|4([0-3]))(\\.[0-9])?[G,K,Y,E]{0,1}$',
        'errorText' : '体温应在35.0~43.9之间',
        'optionStr' : '不升',
        'widgetType' : 'ComboBox',
        'order' : 8
      }
      ],
      'painConfig' : [],
      'headerConfig' : [{
        'titleText' : '日期',
        'contentType' : 'Date'
      }, {
        'titleText' : '出生天数',
        'contentType' : 'birthDays'
      }
      ],
      'graduationItemCode' : ['TW', 'MB'],
      'relationPairs' : [{
        'area' : 'CurveArea',
        'codeA' : 'BABY_TW',
        'codeB' : 'BABY_JWHTW'
      }
      ],
      'graduationStep' : 5,
      'eventData': [{
        '事件代码': 'CS',
        '事件名称': '出生',
        '患者类型': '2',
        '是否显示时间': true,
        "是否绘制竖线": true
      },
        {
          '事件代码': 'ZC',
          '事件名称': '转出',
          '患者类型': '2',
          '是否显示时间': true,
          "是否绘制竖线": true
        },
        {
          '事件代码': 'ZR',
          '事件名称': '转入',
          '患者类型': '2',
          '是否显示时间': true,
          "是否绘制竖线": true
        },
        {
          '事件代码': 'CY',
          '事件名称': '出院',
          '患者类型': '2',
          '是否显示时间': true,
          "是否绘制竖线": true
        }],
      'eventShowType': 'show'
    };
    return config;
  }
}
