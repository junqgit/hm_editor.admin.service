import { AreaCodeBean, JobNameBean } from './interface-syn-monitor.model';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PageClazz } from '../../../common/model/page-clazz';
import { GrowlMessageService } from './../../../common/service/growl-message.service';
import { SynchronizationService } from './../synchronization.service';
import {Message} from "portalface/widgets/commons/message";
import { ConfirmationService } from 'portalface/widgets';
@Component({
  selector: 'kyee-interface-syn-monitor',
  templateUrl: './interface-syn-monitor.component.html',
  styleUrls: ['./interface-syn-monitor.component.scss'],
  providers: [DatePipe]
})
export class InterfaceSynMonitorComponent implements OnInit {

  areaCodeList: AreaCodeBean[];
  jobNameList: JobNameBean[]; // 标识列表
  statusList: any[];
  selectedAreaCode: AreaCodeBean; // 选中区域code
  selectedJobName: JobNameBean; // 选中标识
  startDate: Date;
  endDate: Date;
  page = new PageClazz();
  selectedStatus: ''; // 选中状态
  dynamicSyncBeanList: any[];

  selectedItem: any= {};
  selectedDynamicSyncBean: any= {};
  detialDisplay: Boolean = false;
  isShowDeleteDialog: Boolean = false;
  msgs: Message[] = [];
  first: Number = 0;

  constructor(
    private datePipe: DatePipe,
    private synchronizationService: SynchronizationService,
    protected confirmationService: ConfirmationService,
    private growlMessageService: GrowlMessageService) { }
  ngOnInit() {
    const date = new Date();
    this.startDate = new Date(this.datePipe.transform(date, 'yyyy-MM-dd 00:00:00'));
    this.endDate = new Date(this.datePipe.transform(date, 'yyyy-MM-dd 23:59:59'));
    this.statusList = [
      {label: '全部', value: 0},
      {label: '成功', value: 1},
      {label: '失败', value: 2},
      {label: '未执行', value: 3}
    ];
    this.selectedStatus = this.statusList[0].value;
    this.initAreaCodeList();
    this.initJobNameList();
  }

  /**
   * 获取区域code列表
   */
  initAreaCodeList() {
    this.synchronizationService.queryAreaSettingList().subscribe(
      data => {
        if (data && data.code == 10000) {
            this.areaCodeList = data.data || [];
            let emptyObj = new AreaCodeBean();
            emptyObj.areaCode = '请选择';
            this.areaCodeList.unshift(emptyObj);
            this.selectedAreaCode = this.areaCodeList[0];
        }else {
          this.growlMessageService.showErrorInfo('', data);
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

  /**
   * 获取标识列表
   */
  initJobNameList() {
    this.synchronizationService.queryJobNameList().subscribe(
      data => {
        if (data && data.code == 10000) {
          this.jobNameList = data.data || [];
          let emptyObj = new JobNameBean();
          emptyObj.jobName = '请选择';
          this.jobNameList.unshift(emptyObj);
          this.selectedJobName = this.jobNameList[0];
        }else {
          this.growlMessageService.showErrorInfo('', data);
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

  queryDetail() {
    this.detialDisplay = true;
  }

  /**
   * 数据分页懒加载
   * @param evt
   */
  loadDataLazy(evt) {
    if (evt && evt.first >=0 && evt.rows) {
      this.page.currentPage = (evt.first / evt.rows) + 1;
    }else if (!evt) {
      this.resetPage();
    }
    if (this.startDate > this.endDate) {
      this.growlMessageService.showWarningInfo('开始时间不能大于结束时间');
      return;
    }
    let areaCode = this.selectedAreaCode && this.selectedAreaCode.areaCode !== '请选择' ? this.selectedAreaCode.areaCode : '';
    let jobName = this.selectedJobName && this.selectedJobName.jobName !== '请选择' ? this.selectedJobName.jobName : '';
    const searchParams = {
      areaCode: areaCode,
      jobName: jobName,
      startTime: this.datePipe.transform(this.startDate, 'yyyy-MM-dd HH:mm:ss'),
      endTime: this.datePipe.transform(this.endDate, 'yyyy-MM-dd HH:mm:ss'),
      status: this.selectedStatus,
      page: this.page
    };
    if(searchParams.startTime.indexOf(' 24:') != -1)
    {
      searchParams.startTime = searchParams.startTime.replace(/ 24:/, " 00:");
    }
    if(searchParams.endTime.indexOf(' 24:') != -1)
    {
      searchParams.endTime = searchParams.endTime.replace(/ 24:/, " 00:");
    }
    this.synchronizationService.querySyncMonitorList(searchParams).subscribe(
      data => {
        if (data.code == 10000) {
          let newData = data.data || {};
          this.page = newData.page;
          this.dynamicSyncBeanList = newData.dataList || [];
        }else {
          this.growlMessageService.showErrorInfo('', data);
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }

  /**
   * 重置页码至第一页
   */
  resetPage() {
    this.first = 0;
  }

  /**
   * 执行搜索功能
   */
  doSearch() {
    this.page = new PageClazz();
    this.loadDataLazy(null);
  }

  /**
   * 执行删除功能
   */
   doDelete(){
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除吗？',
      accept: () => {
        this.doRemove();
      }
    });
  }

  doRemove() {
    let selectedDynamicSyncBeanList = this.selectedDynamicSyncBean;
    let arr = Object.keys(this.selectedDynamicSyncBean);
    if(arr.length == 0){
     
      this.growlMessageService.showWarningInfo('需至少选中一项');
      return;
    }
    
    
    this.synchronizationService.removeSyncMonitor(this.selectedDynamicSyncBean._dynamicId).subscribe(
      data => {
        if (data.code == 10000) {
          this.growlMessageService.showSuccessInfo('删除成功');
          this.isShowDeleteDialog = false;
          this.selectedDynamicSyncBean={};
          this.doSearch();
        }else {
          this.growlMessageService.showErrorInfo('', data);
        }
      },
      error => {
        this.growlMessageService.showErrorInfo('', error);
      }
    );
  }




  /**
   * 更新状态对应背景色
   * @param rowData
   * @param rowIndex
   */
  updateStateBg(rowData: any, rowIndex: any) {
    if ('失败' === rowData.status) {
      return 'bg_yellow_color';
    }else {
      return '';
    }
  }
}
