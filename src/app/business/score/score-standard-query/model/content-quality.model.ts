import { Score } from './score.model';
export class ContentQuality {
    _id?: string;
    areaCode: string;
    医院编码: string;
    院区编码: string;
    ruleType: string; // 质控类型
    scoreType: string; // 评分类型
    ruleDescription: string; // 规则描述
    templates: any[]; // 病历
    dataSources: any[];  // 数据源
    rule: any = {};
    createScoreCriteria: boolean; // 是否同时创建评分
    autoOrHand: string;
    score: Score;  // 评分
    type:string;
    valueLimit:any={};

    status:string;
    msg:string;
    rules:any[];
    expression:string;
    templateName:any;
    code:string;// 手动质控编码
    constructor() {
        this._id = '';
        this.areaCode = '';
        this.医院编码 = '';
        this.院区编码 = '';
        this.ruleType = '';
        this.scoreType = '';
        this.templates = [];
        this.dataSources = [];
        this.ruleDescription = '';
        this.rule = {};
        this.createScoreCriteria = false;
        this.autoOrHand = '';
        this.score = new Score();
        this.type = '';
        this.valueLimit = {};
        
        this.status = '启用';
      }
}

