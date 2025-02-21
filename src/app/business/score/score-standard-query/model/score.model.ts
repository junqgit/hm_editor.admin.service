export class Score {
    singleReject: boolean; // 是否单项否决
    rejectLevel: string; // 否决级别
    markType: string; // 评分类型
    value: string; // 分值
    scoreContent: string;
    constructor() {
        this.singleReject = false;
        this.rejectLevel = '';
        this.markType = '';
        this.value = '';
        this.scoreContent = '';
    }
}
