import { Component, OnInit } from '@angular/core';
import { DatasourceManageService } from '../datasource-manage.service';
import { ConfirmationService } from 'portalface/widgets';

@Component({
  selector: 'kyee-dynamic-dict',
  templateUrl: './dynamic-dict.component.html',
  styleUrls: ['../datasource-manage.scss', './dynamic-dict.component.scss']
})
export class DynamicDictComponent implements OnInit {
  // 动态值域列表
  dynamicDictList: any[] = [];
  // 选中的动态值域
  selectedDynamicDict: any;
  // 对话框显示控制
  displayDialog: boolean = false;
  // 对话框标题
  dialogTitle: string = '';
  // 编辑对象
  editDynamicDict: any = {};

  // 分页相关
  pageSize: number = 10;
  pageNo: number = 1;
  totalRecords: number = 0;
  filterText: string = '';
  first: number = 0;

  // 消息提示
  msgs: any[] = [];

  constructor(
    private datasourceManageService: DatasourceManageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDynamicDictList();
  }

  // 加载动态值域列表
  loadDynamicDictList() {
    this.datasourceManageService.getDynamicDict(this.filterText, this.pageNo, this.pageSize)
      .then(res => {
        if (res['code'] === 10000) {
          this.dynamicDictList = res['data']['data'] || [];
          this.totalRecords = res['data']['total'] || 0;
        } else {
          this.showMessage('error', '', res['message'] || '加载动态值域列表失败');
        }
      })
      .catch(error => {
        this.showMessage('error', '', '加载动态值域列表失败');
        console.error('加载动态值域列表失败', error);
      });
  }

  // 懒加载数据处理
  loadLazy(event) {
    this.first = event.first;
    this.pageNo = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadDynamicDictList();
  }

  // 新增动态值域
  addDynamicDict() {
    this.dialogTitle = '新增动态值域';
    this.editDynamicDict = {};
    this.displayDialog = true;
  }

  // 编辑动态值域
  editDynamicDictRow() {
    if (!this.selectedDynamicDict) {
      this.showMessage('warn', '', '请先选择一条记录');
      return;
    }
    this.dialogTitle = '编辑动态值域';
    this.editDynamicDict = { ...this.selectedDynamicDict };
    this.displayDialog = true;
  }

  // 删除动态值域
  deleteDynamicDict() {
    if (!this.selectedDynamicDict) {
      this.showMessage('warn', '', '请先选择一条记录');
      return;
    }

    let me = this;
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除吗？',
      accept: () => {
        me.datasourceManageService.delDynamicDict(me.selectedDynamicDict._id)
          .then(res => {
            if (res['code'] === 10000) {
              me.showMessage('success', '', '删除成功');
              me.loadDynamicDictList();
            } else {
              me.showMessage('error', '', res['message'] || '删除失败');
            }
          })
          .catch(error => {
            me.showMessage('error', '', '删除失败');
            console.error('删除失败', error);
          });
      }
    });
  }

  // 保存动态值域
  saveDynamicDict() {
    if (!this.validateDynamicDict()) {
      return;
    }

    this.datasourceManageService.editorDynamicDict(this.editDynamicDict)
      .then(res => {
        if (res['code'] === 10000) {
          this.displayDialog = false;
          this.showMessage('success', '', '保存成功');
          this.loadDynamicDictList();
        } else {
          this.showMessage('error', '', res['message'] || '保存失败');
        }
      })
      .catch(error => {
        this.showMessage('error', '', '保存失败');
        console.error('保存失败', error);
      });
  }

  // 取消对话框
  cancelDialog() {
    this.displayDialog = false;
  }

  // 验证动态值域信息
  validateDynamicDict(): boolean {
    if (!this.editDynamicDict.code) {
      this.showMessage('warn', '', '请输入值域编码');
      return false;
    }
    if (!this.editDynamicDict.name) {
      this.showMessage('warn', '', '请输入值域名称');
      return false;
    }
    if (!this.editDynamicDict.url) {
      this.showMessage('warn', '', '请输入请求URL');
      return false;
    }
    return true;
  }

  // 过滤值域
  filterDynamicDict(event) {
    if (event.keyCode === 13) {
      this.pageNo = 1;
      this.first = 0;
      this.loadDynamicDictList();
    }
  }

  // 显示消息
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
    setTimeout(() => {
      this.msgs = [];
    }, 3000);
  }
}