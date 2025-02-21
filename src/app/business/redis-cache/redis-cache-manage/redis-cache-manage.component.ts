import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ConfirmationService } from 'portalface/widgets';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
import { RedisCacheService } from '../redis-cache.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'kyee-redis-cache-manage',
  templateUrl: './redis-cache-manage.component.html',
  styleUrls: ['./redis-cache-manage.component.scss']
})
export class RedisCacheManageComponent implements OnInit, AfterViewInit {
  searchKey: string;
  redisDataList: any = [];
  selectedList: any;
  redisCacheDetail = null;
  isShowDetailDialog: boolean = false;
  @ViewChild('table') table: ElementRef;
  imgFlag = false;
  constructor(
    private render: Renderer2,
    private redisCacheServce: RedisCacheService,
    private confirmationService: ConfirmationService,
    private growlMessageService: GrowlMessageService,private domSanitizer:DomSanitizer) { 

  }

  ngOnInit() {
    this.searchByKey();
  }
  ngAfterViewInit() {
    let timeoutIndex = setTimeout(() => {
        clearTimeout(timeoutIndex);
        if(this.table && this.table['el'] && this.table['el'].nativeElement){
          
          let ptable = this.table['el'].nativeElement;
          let redisCon = ptable.closest('.redis-cache');
          let tableHeader = ptable.querySelector('.ui-widget-header');
          let tableBody = ptable.querySelector('.ui-datatable-scrollable-body');
          if(!redisCon){
            return;
          }
          this.render.setStyle(tableBody, 'max-height', (redisCon.clientHeight - ptable.offsetTop - tableHeader.clientHeight - 10) + 'px');
        }
    }, 2);
  }

  searchByKey() {
    this.selectedList = null;
    this.redisDataList = [];
    let key = this.searchKey ? this.searchKey.trim() : '';
    this.redisCacheServce.getRedisCacheByKey(key).then(
      res => {
        if(res.code == 10000){
          this.redisDataList = res.data;
        }else {
          this.growlMessageService.showErrorInfo(res.msg, '');
        }
      }
    );
  }

  doDeleteEvt() {
    if(!this.selectedList || this.selectedList.length == 0){
      this.growlMessageService.showWarningInfo('请选中需要删除的行！');
      return;
    }
    this.confirmationService.confirm({
      message: '确定要清除当前选择的所有缓存吗？',
      header: '提示',
      icon: 'fa fa-trash',
      accept: () => {
        let keys = this.selectedList.map(item => item.name);
        this.redisCacheServce.flushRedisCache(keys).then(
          (res) => {
            if (res && res.code == 10000) {
              this.searchByKey();
              this.growlMessageService.showSuccessInfo(res.msg || '清除成功！');
            } else {
              this.growlMessageService.showErrorInfo('', res ? res.msg : '');
            }
          },
          (err) => {
            this.growlMessageService.showErrorInfo('', err);
          });
      }
    });
  }

  doDeleteAllEvt() {
    this.confirmationService.confirm({
      message: '确定要一键清除所有缓存吗？',
      header: '提示',
      icon: 'fa fa-trash',
      accept: () => {
        this.redisCacheServce.flushRedisAllCache().then(
          (res) => {
            if (res && res.code == 10000) {
              this.searchByKey();
              this.growlMessageService.showSuccessInfo(res.msg || '清除成功！');
            } else {
              this.growlMessageService.showErrorInfo('', res ? res.msg : '');
            }
          },
          (err) => {
            this.growlMessageService.showErrorInfo('', err);
          });
      }
    });
  }

  doPreviewDetail(rowData: any) {
    this.redisCacheDetail = null;
    this.imgFlag = false;
    this.redisCacheServce.doPreviewDetail(rowData.name).then(res => {
      if(res.code == 10000){
          this.isShowDetailDialog = true;
          if(res.data && typeof(res.data) == 'string' && this.isImg(res.data)){
            this.imgFlag = true;
            this.redisCacheDetail = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data);
            return;
          }
          this.redisCacheDetail = JSON.stringify(res.data);
      }else {
        this.growlMessageService.showErrorInfo(res.msg , '');
      }
    });
  }

  isImg(str){
    return str && str.indexOf('data:image/png;base64,') == 0;
  }
}
