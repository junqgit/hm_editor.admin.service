export class DeadLine {
    event: string; // 是否单项否决
    conditions: string; // 否决级别
    timeValue: string; // 评分类型
    timeUnit: string; // 分值
    isCycle: boolean;
    frequency: string;
    frequercyTime: string;
    frequencyUnit: string;
    type:string;// 病历分类（入院记录、病案首页，标识多个病历是否为同一类别）
    constructor() {
        this.event = '';
        this.conditions = '';
        this.timeValue = '24';
        this.timeUnit = '小时';
        this.isCycle = false;
        this.frequency = '';
        this.frequercyTime = '';
        this.frequencyUnit = '';
    }
}
