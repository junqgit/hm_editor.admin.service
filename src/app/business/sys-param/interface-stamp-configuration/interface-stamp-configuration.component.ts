import { Component, OnInit } from '@angular/core';
import {GrowlMessageService} from "../../../common/service/growl-message.service";
import {SysParamService} from "../sys-param.service";
import {CommonJob} from "./interface-stamp-configuration.model";

@Component({
  selector: 'kyee-interface-stamp-configuration',
  templateUrl: './interface-stamp-configuration.component.html',
  styleUrls: ['./interface-stamp-configuration.component.scss']
})
export class InterfaceStampConfigurationComponent implements OnInit {
  searchParm: String = '';//查询入参
  interfaceStamps: any[];//接口数据列表
  selectedConfiguration = new CommonJob();
  displayDialogEdit:boolean = false;

  constructor(private growlMessageService: GrowlMessageService,
              private sysParamService: SysParamService,) {
  }

  ngOnInit() {
    this.queryInterfacesList();
  }

  queryInterfacesList() {
    this.sysParamService.queryInterfacesList(this.searchParm).subscribe(
      apiResult => {
        if(apiResult && apiResult.code==10000){
          this.interfaceStamps = apiResult.data || [];
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

  doSearch(){
    this.queryInterfacesList();
  }

  // 打开编辑窗口
  editConfiguration(item){
    this.selectedConfiguration = item || new CommonJob();
    this.displayDialogEdit = true;
  }

  confirmDialog(){
    if(!this.selectedConfiguration.jobChineseName){
      this.growlMessageService.showWarningInfo('请填写定时器类型');
      return;
    }
    if(!this.selectedConfiguration.desc){
      this.growlMessageService.showWarningInfo('请填写定时器说明');
      return;
    }
    this.selectedConfiguration.createDate = null;
    this.selectedConfiguration.editDate = null;
    this.sysParamService.updateInterfaceStamp(this.selectedConfiguration).subscribe(
      result =>{
        if(result.code == 10000){
          this.growlMessageService.showSuccessInfo('' || '编辑成功');
          this.searchParm = "";//清空搜索条件
          this.displayDialogEdit = false;
          this.queryInterfacesList();
        }
      },
      error =>{
        this.growlMessageService.showErrorInfo('', error);
      }
    );

  }

  dialogModalHidden(){
    this.selectedConfiguration = new CommonJob();
  }

}
