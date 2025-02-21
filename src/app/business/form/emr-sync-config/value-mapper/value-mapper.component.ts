import { SyncConfigServices } from './../sync-config.services';
import { CurrentUserInfo } from './../../../../basic/common/model/currentUserInfo.model';
import { Component, OnInit, Input } from '@angular/core';

import { AuthTokenService } from '../../../../basic/auth/authToken.service';
import { ConfirmationService } from 'portalface/widgets';

declare var $: any;

@Component({
  selector: 'kyee-value-mapper',
  templateUrl: './value-mapper.component.html',
  styleUrls: ['./value-mapper.component.scss']
})
export class ValueMapperComponent implements OnInit {
  type:string;
  isShowDictionaryDialog: boolean = false;
  isShowAddDialog: boolean = false;
  openType: string;
  dictionaryList = [];
  dictionaryItem: any = {};
  msgs: any[] = [];
  searchData = {
    areaCode: '',
    hosnum: '',
    nodecode: '',
    value: '',
    type:''
  }
  currentUserInfo:CurrentUserInfo
  constructor(
    private syncConfigServices:SyncConfigServices,private confirmationService: ConfirmationService,private authTokenService:AuthTokenService
) { }

  ngOnInit() {
    this.init();
  }
  init(){
    this.currentUserInfo = JSON.parse(this.authTokenService.getCurrentUserInfo());
    this.searchData['areaCode'] = this.currentUserInfo.areaCode;
    this.searchData['hosNum'] = this.currentUserInfo.hosNum;
    this.searchData['nodeCode'] = this.currentUserInfo.nodeCode;
  }
  
  backgroundSearch(type){
    this.init();
    this.type = type;
    this.searchData['type'] = type;
    this.doSearch();
  }

  doSearch() {
    this.searchData['areaCode'] = this.currentUserInfo.areaCode;
    this.searchData['hosNum'] = this.currentUserInfo.hosNum;
    this.searchData['nodeCode'] = this.currentUserInfo.nodeCode;

    this.syncConfigServices.getOptionDictList(this.searchData).then(res => {
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

    }, () => {

      this.showMessage('error', '', '数据元列表获取失败，请稍后再试。')
    });
  }

  showDictionaryDialog(type) {
    this.type = type;
    this.searchData['type'] = type;
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
      areaCode: this.currentUserInfo['areaCode'],
      hosnum: this.currentUserInfo['hosNum'],
      nodecode: this.currentUserInfo['nodeCode'],
      value: this.dictionaryItem['值域名称'],
      choice: choice,
      type:this.type
    }
    if (this.dictionaryItem['_id']) {
      body['_id'] = this.dictionaryItem['_id'];
    }

    this.syncConfigServices.saveOptionDict(body).then(res => {
      if (res['code'] == 10000) {
        this.showMessage('success', '', '保存成功');
        this.doSearch();
        this.closeAddDialog();
      } else {
        this.showMessage('error', '', res['msg'] || '保存失败，请稍后再试。')
      }

    }, () => {

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
      areaCode: this.currentUserInfo['areaCode'],
      hosNum: this.currentUserInfo['hosNum'],
      nodeCode: this.currentUserInfo['nodeCode'],
      id: id
    }
    this.syncConfigServices.deleteOptionDict(params).then(res => {
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