export class Completeness {
    required:boolean; //必填项
    lengthLimit:boolean; //长度限制
    rangeLimit:boolean; //值域限制
    valueLimit:boolean; //输入限制
    minLength:string;
    maxLength:string;
    valueRange:string;
    valueRegex:string;
    commitCheckedType: string; // 提交病历时，该属性控制当前这条规则是否强制拦截，默认不拦截仅提示
    saveCheckedType:string; //保存病历时，该属性控制当前这条规则是否强制拦截，默认不强制拦截，仅提示
    constructor() {
        this.required = false;
        this.lengthLimit = false;
        this.rangeLimit = false;
        this.valueLimit = false;
        this.minLength = '';
        this.maxLength = '';
        this.valueRange = '';
        this.valueRegex = '';
        this.commitCheckedType = '提交时仅显示';
        this.saveCheckedType='保存时仅显示';
    }
}
