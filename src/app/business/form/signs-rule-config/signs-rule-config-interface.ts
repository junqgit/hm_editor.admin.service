export interface VitalSignsRegs {
    体征代码: string;
    频率代码: string;
    体征名称: string;
}


export interface ConfigDict {
    _id?: string; // SERIAL_NO

    区域编码: string;
    院区编码: string;
    医院编码: string; // HOSNUM
    科室ID: string;
    病区ID: string; // NURSING_UNIT

    来源代码: string; // SOURCE_CODE
    来源名称: string; // SOURCE_NAME
    // 来源内容: string; // SOURCE_XML
    来源描述: string; // SOURCE_DESC
    来源类型: string; // SOURCE_TYPE
    项目类型: string; // ITEM_TYPE  项目类型 状态、护理等级、手术级别
    小时数: string; // HOURS
    上限: string; // UPPER
    下限: string; // LOWER
    手术阶段: string; // OPER_STAGE
    项目单位: string; // UNIT
    类型: string;//新生儿/成人
    vitalSignsRegs: VitalSignsRegs[];
}
export interface TimePoint {
    day1?: string;
    day2?: string;
    day3?: string;
    day4?: string;
    day5?: string;
    day6?: string;
    day12?: string;
}
