import { Component, OnInit } from '@angular/core';
import { DatasourceManageService } from '../datasource-manage.service';
import { ConfirmationService } from 'portalface/widgets';

@Component({
  selector: 'kyee-datasource-group',
  templateUrl: './datasource-group.component.html',
  styleUrls: ['../datasource-manage.scss','./datasource-group.component.scss']
})
export class DatasourceGroupComponent implements OnInit {
  msgs: any[];

  dsGroupFilterText:string;
  dsGroupFirst: number = 0;
  dsGroupRecord:any = {'total':0,'data':[]};


  selDsGroup: any;

  dsGroupPageSize: number = 10;
  dsGroupPageNo: number = 1;

  selData:any;


  diagFlag:boolean;
  diagTitle:string;
  editorData:any = {};


  groupRefList:any[] = [];
  selRef:any;


  refDiagTitle:string;
  refDiagFlag:boolean;

  allDs:any[] = [];
  dropDS:any[] = [];
  selDs:any;
  loadAllDs:boolean = false;

  refrenceList:any[] = [];
 
  selDsData:any;
  notShowCode = [];
  constructor(private dsManageService: DatasourceManageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.initAllDs();
  }


  initAllDs(){
    // if(this.loadAllDs){
    //   return;
    // }
    // this.dsManageService.allDs().then(d => {
    //   this.allDs = (d['data']||[]).reduce((p,c) => {
    //     p.push({"label":c['name'],"value":c['code']});
    //     return p;
    //   },[{"label":'',"value":''}]);
    //   if(d['code'] != 10000){
    //     this.showMessage('error','','获取数据元列表异常');
    //     return;
    //   }
    //   this.loadAllDs = true;
    // })
  }
  dsGroupRowSel($event){
    this.selData = $event.data;
    this.searchRef();

    this.dsManageService.getGroupRef(this.selData['code']).then(d => {
      this.refrenceList = d['data'] || [];
    })
  }

  dictFilterBlur(event){
    if(event){
      if(event.keyCode != 13){
        return;
      }
    }
    this.dsGroupFirst = 0;
    this.dsGroupPageNo = 1;
    this.search();
  }
  loadDsGroupLazy($event){
    this.dsGroupFirst = $event.first;
    this.dsGroupPageNo = ($event.first / $event.rows) + 1;
    this.dsGroupPageSize = $event.rows;
    this.search();
  }

  search(){
    this.selData = null;
    this.selRef = null;
    this.groupRefList = [];
    this.refrenceList = [];
    this.dsManageService.getDsGroup(this.dsGroupFilterText || '', this.dsGroupPageNo, this.dsGroupPageSize).then(d => {
      if (d['code'] == 10000) {
        this.dsGroupRecord = d['data'];
      } else {
        this.showMessage('error', '', '获取数据组列表异常');
      }
    })
  }
  searchRef(){
    this.dsManageService.searchDsGroupRef(this.selData['code']).then(d => {
      this.groupRefList = d['data'] || [];
    })
  
  }

  addRow(){
    this.editorData = {};
    this.diagFlag = true;
    this.diagTitle = '新增数据组';
  }
  editorRow(){
    if(!this.selData || !this.selData['_id']){
      this.showMessage('info','','请选择数据');
      return;
    }
    this.diagTitle = '修改数据组';
    this.editorData = Object.assign({},this.selData);
    this.diagFlag = true;
  }
  confirmDiag(){
    let msg = this.dsManageService.checkData(this.editorData);
    if(msg){
      this.showMessage('info','',msg);
      return;
    }
    this.dsManageService.editorDsGroup(this.editorData).then(d => {
      let addFlag = !this.editorData['_id'];
      if(d['code'] == '10000'){
        this.diagFlag = false;
        this.showMessage('success','',d['code'] == '10006'?d['msg']:(addFlag?'新增成功':'修改成功'));
        this.search();
      }else{
        this.showMessage('error','',d['code'] == '10006'?d['msg']:(addFlag?'新增失败':'修改失败'));
      }
    })
  }
  delGroupRow(){
    if (!this.selData) {

      this.showMessage('info','','请选择数据');
      return;
    }
    let me = this;
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除【'+this.selData['name']+'】吗？',
      accept: () => {
        me.dsManageService.delDsGroup(me.selData['_id']).then(d => {
          if (d['code'] == 10000) {
            me.showMessage('success', '', '删除成功');
            me.search();
          } else {
            me.showMessage('success', '', '删除失败');
          }
        })
      }
    });
  }
  addRefRow(){
    if(!this.selData){
      this.showMessage('info','','请先选择数据组');
      return;
    }
    this.selRef = null;
    //this.initAllDs();
    this.initDropDS();
    this.refDiagFlag = true;
    this.refDiagTitle = '新增数据元';
    
  }
  editorRefRow(){
    if(!this.selData){
      this.showMessage('info','','请先选择数据组');
      return;
    }
    //this.initAllDs();
    if(!this.selRef){
      this.showMessage('info','','请选择数据');
      return;
    }
    this.refDiagTitle = '修改数据元';
    this.initDropDS();
    this.refDiagFlag = true;
  }
  initDropDS(){
    this.notShowCode = this.groupRefList.reduce((p,c) => {p.push(c['refCode']);return p;},[]);
    this.selDs = null;
    let alSelDs = (this.groupRefList || []).reduce((p,c) => {
      p.push(c['refCode']);
      return p;
    },[]);
    this.dropDS = this.allDs.filter(a => alSelDs.indexOf(a['value']) == -1);
  }
  confirmRef(){
    if(!this.selDs || !this.selDs['code']){
      return;
    }

    let data = {refCode:this.selDs['code'],code:this.selData['code'],'type':'数据组'};
    if(this.selRef){
      data['_id'] = this.selRef['_id'];
    }

    var exists = this.groupRefList.find(vd => vd['_id'] != data['_id'] && vd['refCode'] == data['refCode']);
    if(exists){
      this.showMessage('info', '', '已包含数据元【'+exists['name']+'】');
        return;
    }

    this.dsManageService.editorDsGroupRef(data).then(d => {
      let addFlag = !this.selRef;
      if(d['code'] == '10000'){
        this.showMessage('success','',addFlag?'添加成功':'修改成功');
        this.refDiagFlag = false;
        this.searchRef();
      }else{
        this.showMessage('success','',addFlag?'添加失败':'修改失败');
      }
    })
  }

  delRef(){
    if (!this.selRef) {

      this.showMessage('info','','请选择数据');
      return;
    }
    let me = this;
    this.confirmationService.confirm({
      header: '确认删除',
      icon: 'fa fa-trash',
      message: '确认删除【'+this.selRef['name']+'】吗？',
      accept: () => {
        me.dsManageService.delDsGroupRef(me.selRef['_id']).then(d => {
          if (d['code'] == 10000) {
            me.showMessage('success', '', '删除成功');
            me.searchRef();
          } else {
            me.showMessage('success', '', '删除失败');
          }
        })
      }
    });
  }

  /**
  * 消息提醒
  */
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }
}
