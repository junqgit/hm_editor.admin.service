import { ConfirmationService } from 'portalface/widgets';
import { GrowlMessageService } from './../../../common/service/growl-message.service';
import { SysParamService } from './../sys-param.service';
import { Component, OnInit } from '@angular/core';
import { RegionalConfigurationBean } from './regional-configuration.model';

@Component({
  selector: 'kyee-regional-configuration',
  templateUrl: './regional-configuration.component.html',
  styleUrls: ['./regional-configuration.component.scss']
})
export class RegionalConfigurationComponent implements OnInit {

  configurationList: RegionalConfigurationBean[] = [];
  displayDialogEditOrAdd: Boolean = false;
  headerTitle: String = '新增';
  selectedConfiguration = new RegionalConfigurationBean();
  loadingFlag: Boolean = false;
  constructor(
    private sysParamService: SysParamService,
    private growlMessageService: GrowlMessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.initAreaSettingList();
  }

  initAreaSettingList() {
    this.loadingFlag = true;
    this.sysParamService.queryAreaSettingList().subscribe(
      data => {
        if (data && data.code == 10000) {
          this.configurationList = data.data || [];
        }else {
          this.growlMessageService.showErrorInfo('', data);
        }
        this.loadingFlag = false;
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
        this.loadingFlag = false;
      }
    );
  }

  addConfiguration() {
    this.headerTitle = '新增';
    this.displayDialogEditOrAdd = true;
  }

  editConfiguration(item) {
    this.headerTitle = '编辑';
    this.selectedConfiguration = item || new RegionalConfigurationBean();
    this.displayDialogEditOrAdd = true;
  }

  deleteConfiguration(item) {
    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除该条数据吗？',
      accept: () => {
        let deleteList = [];
        deleteList.push(item);
        this.sysParamService.removeAreaSetting(deleteList).subscribe(
          (data) => {
            if (data.code == 10000) {
              this.growlMessageService.showSuccessInfo(data && data.msg);
              this.initAreaSettingList();
            }else {
              this.growlMessageService.showErrorInfo('', data && data.msg);
            }
          },
          error => {
            this.growlMessageService.showErrorInfo('', error);
          }
        );
      }
    });
  }

  dialogModalHidden() {
    this.selectedConfiguration = new RegionalConfigurationBean();
  }

  confirmDialog() {
    if (!this.selectedConfiguration.areaName) {
      this.growlMessageService.showWarningInfo('请填写区域名称');
      return;
    }
    if (!this.selectedConfiguration.areaCode) {
      this.growlMessageService.showWarningInfo('请填写区域CODE');
      return;
    }
    if (!this.selectedConfiguration.targetContextPath) {
      this.growlMessageService.showWarningInfo('请填写接口地址');
      return;
    }
    this.sysParamService.saveAreaSetting(this.selectedConfiguration).subscribe(
      data => {
        if (data.code == 10000) {
          let newMsg = this.headerTitle == '编辑' ? '编辑成功' : data.msg;
          this.growlMessageService.showSuccessInfo(newMsg || '操作成功');
          this.displayDialogEditOrAdd = false;
          this.initAreaSettingList();
        }else {
          this.growlMessageService.showErrorInfo('', data.msg || '操作失败');
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

  checkUrl() {
    if (!this.selectedConfiguration.targetContextPath) {
      this.growlMessageService.showWarningInfo('请填写接口地址');
      return;
    }
    this.sysParamService.checkUrl(this.selectedConfiguration.targetContextPath).subscribe(
      data => {
        if (data.code == 10000) {
          this.growlMessageService.showSuccessInfo(data.msg || '测试通过');
        }else {
          this.growlMessageService.showErrorInfo('', data.msg || '测试失败');
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

}
