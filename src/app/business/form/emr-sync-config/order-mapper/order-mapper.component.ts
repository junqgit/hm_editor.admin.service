import { ConfirmationService } from 'portalface/widgets';
import { SyncConfigServices } from '../sync-config.services';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from 'portalface/services';

@Component({
  selector: 'kyee-order-mapper',
  templateUrl: './order-mapper.component.html',
  styleUrls: ['./order-mapper.component.scss']
})
export class OrderMapperComponent implements OnInit {

  type = '医嘱映射';
  @Input() hospitalInfo: any;

  valueList: any[] = [];
  orderDlg: boolean;

  ordersFieldsOptions = [
    { label: '医嘱名称', value: '医嘱名称' },
    { label: '给药方式', value: '给药方式' },
    { label: '频次', value: '频次' },
    { label: '频次名称', value: '频次名称' },
    { label: '一次剂量', value: '一次剂量' },
    { label: '剂量单位', value: '剂量单位' },
  ]

  hosType = '入院';
  ordersType = [];
  ordersFields = [];
  spliceMode = '，';
  syncFlag = false;
  selDs: any;

  rowId: string;
  msgs: any[];

  constructor(
    private syncConfigService: SyncConfigServices,
    private confirmationService: ConfirmationService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.search();
  }

  search() {
    this.loadingService.loading(true);
    this.syncConfigService.getSyncConifg(this.param()).then(res => {
      this.loadingService.loading(false);
      if (res['code'] == 10000) {
        this.valueList = res['data'] || [];
        return;
      }
      this.showMessage('error', '', '获取数据失败')
    })
  }
  addOrderMapper() {
    this.hosType = '';
    this.ordersType = [];
    this.ordersFields = [];
    this.spliceMode = '';
    this.syncFlag = false;
    this.selDs = null;
    this.rowId = '';
    this.orderDlg = true;
  }
  editorOrderMapper(d) {
    this.rowId = d['_id'];
    this.hosType = d['hosType'];
    this.ordersType = d['ordersType'];
    this.ordersFields = d['ordersFields'];
    this.spliceMode = d['spliceMode'];
    this.syncFlag = d['syncFlag'] || false;
    this.selDs = { "code": d['dsCode'], "name": d['dsName'] };
    this.orderDlg = true;
    
  }
  confirmMapper() {
    let obj = this.dataParam();
    if (!this.checkData(obj)) {
      return;
    }
    let param = this.param();
    Object.assign(param, obj);
    if (this.rowId) {
      param['_id'] = this.rowId;
    }
    this.syncConfigService.saveSyncConifg(param).then(res => {
      if (res['code'] == 10000) {
        this.valueList = res['data'] || [];
        this.showMessage('success', '', this.rowId ? '修改成功' : '新增成功');
        this.orderDlg = false;
        return;
      } else if (res['code'] == 10006) {

        this.showMessage('info', '', res['msg']);
        return;
      }
      this.showMessage('error', '', '保存异常')

    })
  }
  checkData(obj) {

    if (!obj['dsName']) {
      this.showMessage('info', '', '数据元不能为空!')
      return false;
    }

    return true;
  }
  param() {
    return this.syncConfigService.syncConfigBasParam(this.hospitalInfo, this.type);
  }
  dataParam() {
    let dsName = '', dsCode = '';
    if (this.selDs && this.selDs['code'] && this.selDs['name']) {
      dsName = this.selDs['name'];
      dsCode = this.selDs['code'];
    }
    return {
      'dsName': dsName,
      'dsCode': dsCode,
      'hosType': this.hosType,
      'ordersType': this.ordersType,
      'ordersFields': this.ordersFields,
      'spliceMode': this.spliceMode,
      'syncFlag':this.syncFlag
    };
  }
  delOrderMapper(data) {
    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除【' + (data['dsName'] || '') + '】配置？',
      accept: () => {
        this.syncConfigService.delSyncConifg(data['_id']).then(res => {
          if (res['code'] == 10000) {
            this.showMessage('success', '', '删除成功');
            this.valueList = this.valueList.filter(d => d['_id'] != data['_id']);
            return;
          }
          this.showMessage('error', '', '删除失败')
        })
      }
    });
  }
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }
}
