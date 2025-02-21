import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from 'portalface/services';
import { EmrReportService } from '../report-config.services';
import { Message } from 'primeng/primeng';
import { ConfirmationService } from "portalface/widgets";
import { AuthTokenService } from '../../../../basic/auth/authToken.service';

declare var $: any;

@Component({
  selector: 'dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['../report-config.component.scss']
})
export class DictionaryComponent implements OnInit {
  isShowDictionaryDialog: boolean = false;
  isShowAddDialog: boolean = false;
  openType: string;
  dictionaryList = [];
  dictionaryItem: any = {};
  msgs: Message[] = [];
  searchData = {
    areaCode: '',
    hosNum: '',
    nodeCode: '',
    value: ''
  }
  @Input() areaCode;
  @Input() hosNum;
  @Input() nodeCode;

  constructor(
    private loadingService: LoadingService,
    private emrReportService: EmrReportService,
    private confirmationService: ConfirmationService,
    private authTokenService: AuthTokenService) { }

  ngOnInit() {
    this.searchData['areaCode'] = this.areaCode;
    this.searchData['hosNum'] = this.hosNum;
    this.searchData['nodeCode'] = this.nodeCode;
  }


  doSearch() {
    this.searchData['areaCode'] = this.areaCode;
    this.searchData['hosNum'] = this.hosNum;
    this.searchData['nodeCode'] = this.nodeCode;
    this.loadingService.loading(true);
    this.emrReportService.getOptionDictList(this.searchData).then(res => {
      if (res['code'] == 10000 && res['data']) {
        let resData = res['data'];
        resData.forEach(item => {
          item['值域名称'] = item.value;
          let value = [];
          let keys = Object.keys(item.choice);
          keys.forEach(keyItem => {
            value.push({ key: keyItem, value: item.choice[keyItem] })
          })
          item.value = value;
        })
        this.dictionaryList = resData;
      }
      this.loadingService.loading(false);
    }, () => {
      this.loadingService.loading(false);
      this.showMessage('error', '', '数据元列表获取失败，请稍后再试。')
    });
  }

  showDictionaryDialog() {
    this.doSearch();
    this.isShowDictionaryDialog = true;
  }

  showAddDialog(data, type) {
    this.isShowAddDialog = true;
    this.openType = type;
    if (data) {
      this.dictionaryItem = data;
      if (type === '查看') {
        setTimeout(() => {
          $('#dictionary-value').jsonViewer(data.choice);
        }, 200);
      }
    } else {
      this.dictionaryItem = { 值域名称: '', value: [] };
    }
  }

  closeAddDialog() {
    this.isShowAddDialog = false;
  }

  doAddDictionaryData(data) {
    data.push({ key: '', value: '' })
  }

  removeDictionaryData(data, index) {
    data.splice(index, 1)
  }

  doSave() {
    let hasEmpty = false;
    let keyValueItem = this.dictionaryItem['value'];
    keyValueItem.find(item => {
      if (!item.key || !item.value) {
        hasEmpty = true;
        return true;
      }
    })
    if (!this.dictionaryItem['值域名称'] || hasEmpty) {
      this.showMessage('warn', '提示', '存在未填写的值!');
      return;
    }
    let choice = {};
    keyValueItem.forEach(item => {
      choice[item.key] = item.value;
    })
    let body = {
      areaCode: this.areaCode,
      hosnum: this.hosNum,
      nodecode: this.nodeCode,
      value: this.dictionaryItem['值域名称'],
      type: '上报配置',
      choice: choice
    }
    if (this.dictionaryItem['_id']) {
      body['_id'] = this.dictionaryItem['_id'];
    }
    this.loadingService.loading(true);
    this.emrReportService.saveOptionDict(body).then(res => {
      if (res['code'] == 10000) {
        this.showMessage('success', '', '保存成功');
        this.doSearch();
        this.closeAddDialog();
      } else {
        this.showMessage('error', '', res['msg'] || '保存失败，请稍后再试。')
      }
      this.loadingService.loading(false);
    }, () => {
      this.loadingService.loading(false);
      this.showMessage('error', '', '保存失败，请稍后再试。')
    });
  }

  doDelete(data) {
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除值域：'+data['值域名称']+' 吗？',
      accept: () => {
        this.delete(data['_id']);
      }
    });
  }

  delete(id) {
    let params = {
      areaCode: this.areaCode,
      hosNum: this.hosNum,
      nodeCode: this.nodeCode,
      id: id
    }
    this.emrReportService.deleteOptionDict(params).then(res => {
      if (res['code'] == 10000) {
        this.showMessage('success', '', '删除成功');
        this.doSearch();
      }
    }, () => {
      this.showMessage('error', '', '删除失败，请稍后再试。')
    });
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }
}
