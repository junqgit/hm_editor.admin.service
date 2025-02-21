import { DateUtil } from './../../../../basic/common/util/DateUtil';
import { CurrentUserInfo } from './../../../../basic/common/model/currentUserInfo.model';
import { ScoreConfigComponent } from './../score-config/score-config.component';
import { Component, Input, OnInit } from '@angular/core';
import { ContentQuality } from '../model/content-quality.model';
import { Completeness } from '../model/completeness.model';
import { Consistency } from '../model/consistency.model';
import { Score } from '../model/score.model';

@Component({
  selector: 'kyee-score-config-new',
  templateUrl: './score-config-new.component.html',
  styleUrls: ['./score-config-new.component.scss']
})
export class ScoreConfigNewComponent  extends ScoreConfigComponent{

  ruleIndex:any;
  flag:boolean = true;


  showRegDiag:boolean =false;
  testReg:string;
  testText:string;
  regRes:string;

  operations:any=[
    { label: '时间相减', value: "0" },
    { label: '数值相加', value: "1" },
    { label: '数值相减', value: "2" },
    { label: '数值相乘', value: "3" },
    { label: '数值相除', value: "4" },
    { label: '时间比较', value: "5" }
  ]

  containRange:any=[
    { label: '大于', value: "0" },
    { label: '大于等于', value: "1" },
    { label: '等于', value: "2" },
    { label: '不等于', value: "3" },
    { label: '小于等于', value: "4" },
    { label: '小于', value: "5" }
  ]

/**
   * 显示新增内容质控弹框
   */
 showContentQualityDialog() {
  //this.resetValueLimit();
  this.resetContentQuality();
  this.isShowContentQualityDialog = true;
}

/**
 * 重置内容质控弹框内容
 */
resetContentQuality() {
  this.contentQuality = new ContentQuality();
  this.completeness = new Completeness();
  this.consistency = new Consistency();
  this.childScore.score = new Score();
  this.childScore.createScoreCriteria = false;
  this.addRule();
  this.contentQualityHeader = '新建内容质控';
  // this.contentQuality.scoreType = '完整性';
  // this.completenessLimitType = '必填项';
  // this.completeness.required = true;
  // this.selectedvalueRegex = '身份证号码';
  // this.lengthLimitVisible = false;
  // this.rangeLimitVisible = false;
  // this.valueLimitVisible = false;
   this.selectedTemplate = [];
  // this.isCompareTime = false;
}
    addRule(){
      if(!this.contentQuality.rules){
        this.contentQuality.rules = [];
      }
      this.contentQuality.rules = this.contentQuality.rules.concat(this.defaultRule());
      console.log(this.contentQuality.rules);
    }
    defaultRule(){
      return [{"same":"","reg":"","dataSources":"","rangeValue":this.containRange[0].value,"calculateOperation":this.operations[0].value}];
    }
    delRule(index){
      this.contentQuality.rules.splice(index, 1);
    }

    clearValue(index){
      this.contentQuality.rules[index]['startVal'] = '';
      this.contentQuality.rules[index]['endVal'] = '';
      this.contentQuality.rules[index]['dataSources'] = '';
    }

    getDataSources() {
      let params = {
        templateNameList: this.selectedTemplate,
        key: this.dlgSearchParams.key,
        pageSize: this.dlgSearchParams.page.pageSize,
        currentPage: this.dlgSearchParams.page.currentPage
      };

      this.dataSourceTableLoadingFlag = true;
      let me = this;
      this.scoreService.searchDataSourceListByParams(params)
        .then(
        data => {
          if (data.code == '10000') {
            this.dataSources = data.data.dataElementList;
            if(this.dataSources.length>0){
              this.dataSources.forEach(item => {
                if(item.createDate){
                  item.createDate = DateUtil.format(item.createDate,"yyyy-MM-dd HH:mm");
                }
                for(let i=0;i<this.dataSourceTypeArray.length;i++){
                  if(this.dataSourceTypeArray[i].code == item.typeCode){
                    item.typeName = this.dataSourceTypeArray[i].name;
                  }
                }
                if(this.dlgSearchParams.scoreType === '完整性'){
                for(let i=0;i<this.contentQuality.dataSources.length;i++){
                  if(this.contentQuality.dataSources[i] == item.dataSourceName){
                    this.selectedDataSources = item;
                  }
                }
              }


                if(this.dlgSearchParams.scoreType === '质控条件' && this.valueName && this.valueName == item.dataSourceName){
                  this.selectedDataSources = item;
                }
                if(this.dlgSearchParams.scoreType === '一致性' && this.consistency.datasourceName == item.dataSourceName){
                  this.selectedDataSources = item;
                }
              });
            }
            if(data.data.page.totalRecords > 5){
              me.el.nativeElement.querySelector('#datasourcedialog').firstElementChild.style.top = '0';
            }else{
              me.el.nativeElement.querySelector('#datasourcedialog').firstElementChild.style.top = '200px';
            }
            this.dlgSearchParams.page = data.data.page;
          } else {
            this.showMessage('error', '获取数据元列表失败', data.msg);
          }
          this.dataSourceTableLoadingFlag = false;
        },
        err => {
          this.dataSourceTableLoadingFlag = false;
          this.showMessage('error', '获取数据元列表失败', err);
        });
    }
    showDataSourceMsgDialogNew(event: any, scoreType: string,index) {
      this.dlgSearchParams.scoreType = scoreType;
      this.selectedDataSources = null;
      this.dlgSearchParams.key = '';
      if (scoreType === '一致性') {
        if (!this.consistency.templateName) {
          this.growlMessageService.showWarningInfo('请先选择一致性类型的病历模版！');
          return;
        }
      }else {
        if (!this.selectedTemplate) {
          this.growlMessageService.showWarningInfo('请先选择病历模版！');
          return;
        }
      }
      event.target.blur();
      this.getDataSources();
      this.ruleIndex = index;
      setTimeout(() => {
        this.displayDataSourceMsgDialog = true;
      }, 0);
    }
    confirmDataSourceDialog() {
      let dataSourceName = this.selectedDataSources ? this.selectedDataSources.dataSourceName : '';
        if(this.dlgSearchParams.scoreType == 'startVal'){
          this.contentQuality.rules[this.ruleIndex]['startVal'] = dataSourceName;
        }else if(this.dlgSearchParams.scoreType == 'endVal'){
          this.contentQuality.rules[this.ruleIndex]['endVal'] = dataSourceName;
        }else{
          this.contentQuality.rules[this.ruleIndex]['dataSources'] = dataSourceName;
        }

      this.displayDataSourceMsgDialog = false;
    }

    confirmContentQuality() {
      if (!this.selectedTemplate) {
        this.growlMessageService.showWarningInfo('请选择病历！再保存');
        return;
      }
      // if (this.contentQuality.dataSources.length < 1) {
      //   this.growlMessageService.showWarningInfo('请选择数据元！再保存');
      //   return;
      // }
      if (!this.contentQuality.ruleDescription) {
        this.growlMessageService.showWarningInfo('请填写规则描述！再保存');
        return;
      }

      const msg = this.checkRules();
      if(msg){
        this.growlMessageService.showWarningInfo(msg);
        return;
      }
    //  let msg = this.checkValueLimit();
    //  if(msg){
    //   this.growlMessageService.showWarningInfo(msg);
    //    return;
    //  }

      // if ('完整性' === this.contentQuality.scoreType) {
         this.updateCompletenessData();
      //   if (this.selectedvalueRegex != '其它') {
      //     this.completeness.valueRegex =  this.selectedvalueRegex;
      //   }
      //   if (!this.checkCompletenessRule()) {
      //     return;
      //   }
      //   this.completeness.minLength += '';
      //   this.completeness.maxLength += '';
         this.contentQuality.rule = this.completeness;
      // }else {
      //     this.clearIntegrityRuleContent();
      //     if (!this.consistency.templateName) {
      //       this.growlMessageService.showWarningInfo('请选择一致性规则的病历模板');
      //       return;
      //     }
      //     if (!this.consistency.datasourceName) {
      //       this.growlMessageService.showWarningInfo('请选择一致性规则的病历模板中数据元');
      //       return;
      //     }
      //     this.contentQuality.rule = this.consistency;
      // }
      this.childScore.score.value += '';
      this.contentQuality.score = this.childScore.score;
      this.contentQuality.createScoreCriteria = this.childScore.createScoreCriteria;
      this.contentQuality.ruleType = '内容质控';
      this.contentQuality.autoOrHand = '自动评分';
      // if(this.isCompareTime){
      //   this.contentQuality.rule['required'] = false;
      //   this.contentQuality.rule['timeLimit'] = true;
      // }else{
      //   this.contentQuality.rule['timeLimit'] = false;
      // }
      // if(this.emrType){
      //   this.contentQuality.type = this.emrType;
      // }
      // if (this.valueName) {
      //   if(this.valueType != 'reg' && this.valueType != 'range' && this.valueType != 'acc' && this.valueType != 'limit'){
      //     this.valueType = '';
      //   }
      //   let regType = this.regType;
      //   this.contentQuality.valueLimit = {type:this.valueType,name:this.valueName,value1:this.value1,value2:this.value2,containMin:this.containMin,containMax:this.containMax, accValueType: this.accValueType,regType:regType,rangeValue:this.rangeValue};
      // }
      this.saveScoreCriteria(() => {
        this.isShowContentQualityDialog = false;
      });
    }
    saveScoreCriteria(callback: Function) {
      this.contentQuality.areaCode = this.currentAreaCode;
      this.contentQuality.院区编码 = this.hosAreaCode;
      this.contentQuality.医院编码 = this.currentHosCode;
      this.contentQuality.templates = [].concat(this.selectedTemplate);
      this.contentQuality.templateName = [].concat(this.selectedTemplate);
      this.scoreService.saveOrUpdateScoreCriteria(this.contentQuality).then(
        data => {
          if (data.code == 10000) {
            this.growlMessageService.showSuccessInfo(data.msg || '保存成功');
            this.search();
            if (callback) {
              callback();
            }
          }else {
            this.growlMessageService.showErrorInfo('', data.msg || '保存失败');
          }
        },
        error => {
          this.growlMessageService.showErrorInfo('', error);
        }
      );
    }

    structureNewcontentQuality(data: any) {
      this.contentQuality._id = data._id;
      this.contentQuality.areaCode = data.areaCode;
      this.contentQuality.autoOrHand = data.autoOrHand;
      this.contentQuality.createScoreCriteria = data.createScoreCriteria;
      //this.contentQuality.dataSources = [data.dataSourceName];
      this.contentQuality.rule = {};
      this.contentQuality.ruleDescription = data.ruleDescription;
      this.contentQuality.ruleType = data.ruleType;
      this.contentQuality.score = Object.assign({}, data.score);
      this.contentQuality.scoreType = data.scoreType;
      this.selectedTemplate = data.templateName;
      this.contentQuality.医院编码 = data.医院编码;
      this.contentQuality.院区编码 = data.院区编码;
      this.contentQuality.rules = data.rules;
      this.contentQuality.expression = data.expression;
      this.contentQuality.msg = data.msg;
      this.contentQuality.status = data.status;
      this.contentQuality.code = data.code;
    }
    checkRules(){

      let rules = this.contentQuality.rules || [];
      let len = rules.length;
      if(len == 0){
        return '请先维护原子条件';
      }

      for(let i=0;i<len;i++){
        let r = rules[i];
        let same = r['same'];
        let num = (i + 1);
        r['index'] = num;
        if(!r['dataSources'] && r['same'] != '验证出生日期与身份证日期不相等'){
          return '原子条件【序号:'+num+'】未选择数据元';
        }
        if(same == '数值比较' || same == '验证出生日期与身份证日期不相等'){
          if(!r['startVal']){
            return '原子条件【序号:'+num+'】未选择'+(same == '数值比较'?"起始":"出生日期")+'数据元';
          }
          if(!r['endVal']){
            return '原子条件【序号:'+num+'】未选择'+(same == '数值比较'?"结束":"身份证号")+'数据元';
          }
        }
        if(!r['same'] && !r['reg']){
          return '原子条件【序号:'+num+'】未配置正则表达式';
        }
      }

      return '';



    }

    doEditOrViewRule(data: any, editType: string) {
      let content = (editType === '查看') ? data.data : data;
      content = Object.assign({}, content);
      this.structureNewcontentQuality(content || new ContentQuality());
      const ruleType = content.ruleType;
      this.emrType = data.type ||'';
      switch (ruleType) {
        case '手动质控':
          this.manualScoreHeader = editType + '手动质控';
          this.showManualScoreFlag = true;
          break;
        case '内容质控':
          this.contentQualityHeader = editType + '内容质控';

            this.completeness = Object.assign({}, content.rule);

          this.childScore.createScoreCriteria = content.createScoreCriteria;
          this.childScore.score = Object.assign({}, content.score);
          this.setCompletenessLimit(this.completeness);
          this.isShowContentQualityDialog = true;

          break;
        case '时限质控':
          this.timeLimitHeader = editType + '时限质控';
          this.deadLine = Object.assign({}, content.rule);
          this.showTimeLimitFlag = true;
          break;
      }
    }
    showReg(): void {
      this.testReg = '';
      this.testText = '';
      this.regRes = '';
      this.showRegDiag = true;
    }
    reg() {
        if(!this.testReg || !this.testText){
          return;
        }
        try{
          this.regRes = new RegExp(this.testReg).test(this.testText)?'通过':"不通过";
        }catch(e){
          this.regRes = '不通过';
        }
    }
}
