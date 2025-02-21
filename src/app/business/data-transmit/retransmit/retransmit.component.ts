import { CurrentUserInfo } from './../../../basic/common/model/currentUserInfo.model';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'portalface/widgets';
import { AuthTokenService } from '../../../basic/auth/authToken.service';
import { DatePipe } from '@angular/common';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
import { LoadingService } from 'portalface/services';
import { SysParamService } from "../../sys-param/sys-param.service";
import { DataTransmitService } from '../data-transmit.service';
import { format } from 'date-fns';
@Component({
  selector: 'kyee-retransmit',
  templateUrl: './retransmit.component.html',
  styleUrls: ['./retransmit.component.scss']
})
export class RetransmitComponent implements OnInit {
  currentUserInfo: CurrentUserInfo = new CurrentUserInfo();
  clcTypes = [
    { label: '住院', value: '2' },
    { label: '门诊', value: '1' }
  ];
  clcType = '2';
  dataList = [];
  constructor(
    private loadingService: LoadingService,
    private sysParamService: SysParamService,
    private growlMessageService: GrowlMessageService,
    private dataTransmitService: DataTransmitService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.currentUserInfo = this.sysParamService.getCurUser();
    this.doSearch();
  }

  doSearch() {
    this.dataList = [];
    let params = {
      areaCode: this.currentUserInfo.areaCode,
      hosNum: this.currentUserInfo.hosNum,
      nodeCode: this.currentUserInfo.nodeCode,
      clcType: this.clcType,
      jsonType: '回写HIS'
    }
    this.loadingService.loading(true);
    this.dataTransmitService.getDataList(params).then(res => {
      if (res['code'] == 10000 && res['data']) {
        let data = res['data'];
        this.dataList = res['data']['datalist'] || [];
      } else {
        this.growlMessageService.showGrowl({ severity: 'error', detail: "数据获取失败，请稍后再试。" });
      }
      this.loadingService.loading(false);
    }, () => {
      this.loadingService.loading(false);
      this.growlMessageService.showGrowl({ severity: 'error', detail: "数据获取失败，请稍后再试。" });
    });
  }
  handle(data) {
    if (!data['startDate'] || !data['endDate']) {
      this.growlMessageService.showGrowl({ severity: 'warn', detail: "请输入开始时间或者结束时间" });
      return;
    }

    let sd = this.datePipe.transform(data['startDate'],'yyyy-MM-dd'),ed = this.datePipe.transform(data['endDate'],'yyyy-MM-dd');
    let params = {
      areaCode: this.currentUserInfo.areaCode,
      医院编码: this.currentUserInfo.hosNum,
      院区编码: this.currentUserInfo.nodeCode,
      类型: this.clcType == '2' ? '住院' : '门诊',
      开始日期: sd,
      结束日期: ed,
      病历名称: data['emrType'],
      recodeid: data['recodeid'],
      table: data['mapperJsonName']
    };
    this.dataTransmitService.reportHistoryData(params).then(res => {
      if (res['code'] == 10000) {
        this.growlMessageService.showGrowl({ severity: 'info', detail: res['data'] });

      } else {
        this.growlMessageService.showGrowl({ severity: 'error', detail: "操作失败，请稍后再试。" });
      }
    }, () => {
      this.growlMessageService.showGrowl({ severity: 'error', detail: "操作失败，请稍后再试。" });

    });
  }
}
