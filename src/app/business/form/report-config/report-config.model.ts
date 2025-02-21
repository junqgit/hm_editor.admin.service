export class ConfigDataInfo {
    id?: string;
    name?: string;
    idno?: number;               //要转换成"id"
    value: string|string[];           //string  对应病历模板或者患者信息中的字段
    code?: boolean;          //true/false  是否编码
    fee?: boolean;            //true/false  是否从ermInfo中取值
    patient?: boolean;        //true/false  是否从patientInfo中取值
    diagMapperType?: string;          // true/false 诊断标识
    format?: string;          //日期格式  yyyyMMdd
    choice?: object;
    defaultval?: string;      //默认值 由于"default"是保留字，得转换
    age?: string;             //年龄转换
    maxLength?: string;          //超长后截取 int
    index?: number;  
    groupFlag?: number;
    formatToDate?: string;
    time?: boolean;  //当前时间
    acsn?: boolean;  //序号
}

export class ConfigDataInfoCustom extends ConfigDataInfo{
    sort?: number;              //排序字段
    flag?:string;   
    choiceid?:string;
    choiceName?:string;
    _value?:string[];
    _diagMapperType?:string;
}