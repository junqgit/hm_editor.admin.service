import { OnInit,Component } from "@angular/core";
import { Score } from "../score.model";

@Component({
    selector: 'child-score',
    templateUrl: './child-score.component.html',
    styleUrls: ['./child-score.component.scss']
})
export class ChildScoreComponent implements OnInit{
    
    createScoreCriteria:boolean = false;
    score:Score = new Score();
    rejectLevelList: any[] = [];
    scoreTypeList: any[] = [];

    ngOnInit(){

        this.rejectLevelList = [
            {label:'甲级',value:'甲级'},
            {label:'乙级',value:'乙级'},
            {label:'丙级',value:'丙级'},
            {label:'丁级',value:'丁级'}
        ]

        this.scoreTypeList = [
            {label:'单项扣分',value:'单项扣分'},
            {label:'单次扣分',value:'单次扣分'}
        ]

    }

    vertifyNumber(evt: any) {
        let value = evt.target.value ? evt.target.value.toString() : '';
        evt.target.value = value;
        this.score.value = value;
    }

    /**
 * 更新是否创建评分标准时，同时更新里面的字段值
 * @param flag
 */
  updateScoreCriteria(flag: Boolean) {
    this.score.singleReject = false;
    this.score.value = '';
    this.score.rejectLevel = '';
    if (flag) {
      this.score.markType = '单次扣分';
    }else {
      this.score.markType = '';
    }
  }

  /**
   * 更新创建评分标准里面的是否单次否决
   * @param flag
   */
  updateSingleReject(flag: Boolean) {
    if (flag) {
      this.score.rejectLevel = '丙级';
    }else {
      this.score.rejectLevel = '';
    }
  }
}
