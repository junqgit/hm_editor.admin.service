
export interface ReportWidget {
    _id?: string; // 主键
    表单ID?: string; // 控件所属表单主键
    表单名称?: string; // 表单名称
    表单版本?: string;
    控件类型名称?: string; // 控件类型 WIDGET_TYPE
    控件类型代码?: string; // 控件类型 WIDGET_TYPE
    控件名称?: string; // 控件名称 WIDGET_NAME
    控件显示名称?: string; // 控件显示名 WIDGET_SHOW_NAME
    备注?: string; // 备注 REMARK
    控件排序值?: number; // 控件显示排序值 SHOW_INDEX
    // 是否为保存的控件?: any; // 控件内容是否保存到数据库 WIDGET_SAVE
    父控件ID?: string; // 父控件ID PARENT_ID
    是否可用?: string; // 是否可用 ISVISITY
    默认值?: string; // 控件默认值 WIDGET_DEFAULT
    约束项?: string; // 控件约束项 BOUND_TERMS
    约束项显示项?: string; // 约束项显示项 BOUND_TERMS_VISITY
    是否冻结?: number; // 表格显示时，该列是否冻结 IS_FREEZE
    控件宽度?: string; // 控件宽度 WIDGET_WIDTH
    打印值?: string; // pc 报表打印值 VALUEPRINT
    规则?: string; // 规则 REGULAR
    下拉框选项?: string; // 下拉框的选项 ITEMS
    // textPda?: string; // 下拉框选项的显示内容 textPda
    // valuePda?: string; // 下拉框选项的值 valuePda
    // scorePda?: string; // 下拉数据分数 SCOREPDA
    正则表达式?: string; // 正则表达式 REGULARVERIFICATION
    错误信息提示?: string; // 正则表达式验证错误提示信息 ERRORTEXT
    // SYS_FLAG?: string; // 产品代码
    控件列宽度?: number; // 控件宽度 widgetWidthBs
    是否同源?: any; // COMMON_SOURCE
    是否同源文本?: string; // IS_COMMON_SOURCE_TEXT
    医院编码: string; // 医院编码 HOSNUM
    是否大文本字段: any; // 是否是clob字段 BIG_FIELD

    所属部分?: string; // 所属部分 NOTE
    所属部分类型?: string; // 所属部分类型 NOTE_TYPE

    是否可为空?: string; // 是否可为空 CANEMPTY
}

export interface Report {
    表单ID?:  number; // 记录主键
    表单名称?: string; // 表单名称
    表单版本?: string; // 表单版本 VERSION_CODE
    备注?: string; // 备注 REMARK
    控件排序值?: number; // 排序值 SHOW_INDEX
    表单类型?: number; // 表单类型 REPORT_TYPE
    表单显示名?: string; // 报表显示名 REPORT_SHOW_NAME
    // SYS_FLAG?: string; // 产品代码
    菜单ID?: number; // 菜单ID OPERATION_ID
    科室ID?: string; // 科室代码 DEPT_CODE
    表单查询类型?: string; // 表单查询类型 IS_QUERY
    表单名称备注?: string; // 表单名称备注 REPORT_NAME_REMARK
    医院编码: string; // 医院编码 HOSNUM
}

export interface AssReport {
    _id?: number; // 记录主键 THEME_CODE
    表单名称?: string; // 表单名称 THEME_NAME
    表单显示名?: string; // 表单显示名称 THEME_SHOW_NAME
    表单简称?: string; // 表单简称 THEME_SHORT_NAME
    表单版本?: string; // 表单版本 VERSION_CODE
    科室ID?: string; // 科室代码 DEPT_CODE
    风险走向?: string; // 风险走向 IS_TREND
    icon?: string; // 图标 ICON
    是否启用?: string; // 是否启用 IS_USE
    排序值?: number; // 排序值 ORDERNUM
    备注?: string; // 备注 REMARK
    // SYS_FLAG?: string; // 产品代码
    菜单ID?: number; // 菜单ID OPERATION_ID
    表单名称备注?: string; // 表单名称备注 REPORT_NAME_REMARK
    医院编码: string; // 医院编码 HOSNUM
}

