import { FolderService } from './../folder.service';
import { Component, OnInit } from '@angular/core';
import { GrowlMessageService } from '../../../common/service/growl-message.service';
import { EmrBaseTemplate } from '../model/emr-base-template';
import { PageClazz } from '../../../common/model/page-clazz';
import { LoadingService } from 'portalface/services';
import * as _ from 'underscore';

import { Utils } from '../../../basic/common/util/Utils';
import { ConfirmationService } from 'portalface/widgets';

declare const HMEditorLoader: any;

@Component({
  selector: 'kyee-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  treeNodes:object[];
  curFolder:object;

  emrBaseTemplateList: EmrBaseTemplate[] = [];
  searchParams = {page: new PageClazz(), folder: '', templateName: ''};
  first: number = 0;
  templateSearchName: String;
  emrBaseTemplate:EmrBaseTemplate;
  isCreateEmrBaseTemplate = false;
  displayEmrBaseTemplateDialog = false;
  templateTypeList = [
    {name: '住院', code: '住院'},
    {name: '门诊', code: '门诊'},
    {name: '急诊', code: '急诊'},
  ];
  searchTemplateTypeList = [{name: '请选择', code: ''}].concat(this.templateTypeList);
  folderList = [];
  editorNameFlag:boolean;
  currentUserInfo: any;
  hosnum: string;

  dsSet:any[] = [];
  selSet:any;
  dsSetObj:object = {};
  constructor(private folderService:FolderService,private growlMessageService: GrowlMessageService,private loadingService: LoadingService,private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getAllFolders();
    this.initAllDsSet();
    this.getDynamicDict();
  }
  getAllFolders(){
    this.folderList = [];
    this.treeNodes = [];
    this.folderService.getAllFolders().then(d => {
      if(d.code == 10000){
        this.treeNodes = d.data.reduce((p,c) => {
          delete c['_id'];
          this.folderList.push({"folder":c.name,"idStr":c.idStr,"_id":c._id});
          let _d = {"name":c.name,"value":c};
          p.push(_d);
          return p;
        },[]);
        if(this.treeNodes.length > 0){
        this.curFolder = this.treeNodes[0];
        this.getEmrBaseTemplateList('');
      }
      }else{
        console.log('获取目录异常：'+d.msg);
      }
    }).catch(e => {

      console.log('获取目录异常：'+e);
    })
  }
  initAllDsSet(){
    // 初始化数据集
    this.folderService.publishedDsSet().then(res => {
      if(res['code'] != 10000){
        this.growlMessageService.showErrorInfo('获取数据集列表异常','');
        return;
      }

      this.dsSet = [];

      this.dsSetObj = {};
      (res.data || []).forEach(c => {
        this.dsSet.push({"label":c['name'],"value":c['code']});
        this.dsSetObj[c['code']] = c['name'];
      });
      // this.dsSet = (res.data || []).reduce((p,c) => {
      //   p.push({"label":c['name'],"value":c['code']});
      //   return p;
      // },[])
    })
  }
  nodeSelect($event){
    this.curFolder = $event;
    this.searchParams = {page: new PageClazz(), folder: '', templateName: ''};
    this.templateSearchName = '';
    this.getEmrBaseTemplateList('');
  }
  mup(cur){
    let next = cur - 1;
    let p = [{"idStr":this.treeNodes[cur]['value']['idStr'],"order":cur},{"idStr":this.treeNodes[next]['value']['idStr'],"order":cur + 1}];
    this.move(cur,next,p);
  }
  mdown(cur){
    let next = cur + 1;
    let p = [{"idStr":this.treeNodes[cur]['value']['idStr'],"order":next + 1},{"idStr":this.treeNodes[next]['value']['idStr'],"order":next}];
    this.move(cur,next,p);
  }
  move(cur,next,p){
    const treeNodesClone = [...this.treeNodes];
    [treeNodesClone[cur], treeNodesClone[next]] = [treeNodesClone[next], treeNodesClone[cur]];
    this.folderService.move(p).then(d => {
      if(d.code == 10000){
        this.treeNodes = treeNodesClone;
      }else{
        this.growlMessageService.showErrorInfo('移动失败!','');
      }

    })
  }
  // 模板目录

  loadCarsLazy(evt: any) {
    if (evt && evt.first >= 0 && evt.rows) {
      this.searchParams.page.currentPage = (evt.first / evt.rows) + 1;
    }else if (!evt) {
      this.first = 0;
    }
    this.getEmrBaseTemplateList('');
  }
  getEmrBaseTemplateList(searchName) {
    if(!this.curFolder){
      return;
    }
    this.searchParams.folder = this.curFolder['value']['idStr'];
    this.searchParams.templateName = searchName;
    this.loadingService.loading(true);
    this.folderService.searchBaseTemplateListByParams(this.searchParams)
      .then(
        data => {
          if (data && data.code == '10000') {
            const tmpData = data.data || {};
            this.emrBaseTemplateList = tmpData.dataList || [];
            this.searchParams.page = tmpData.page || new PageClazz();
            this.first = 0;
          } else {
            this.growlMessageService.showErrorInfo('', data ? (data.msg || '获取模板列表失败') : '获取模板列表失败');
          }
        },
        (err) => {
          this.growlMessageService.showErrorInfo('获取模板列表失败：', err);
        }
      ).then(() => {
        this.loadingService.loading(false);
      });
  }

  showDialogToCreateEmrBaseTemplate() {
    this.editorNameFlag = false;
    this.isCreateEmrBaseTemplate = true;
    this.emrBaseTemplate = new EmrBaseTemplate();
    if (!_.isEmpty(this.treeNodes)) {
      this.emrBaseTemplate.folderStr = this.curFolder['value']['idStr'];
      this.emrBaseTemplate.folder = this.curFolder['value'];
    }
    this.emrBaseTemplate.typeObject = this.templateTypeList[0];
    this.displayEmrBaseTemplateDialog = true;
  }
  saveEmrBaseTemplate() {
    if(!this.emrBaseTemplate.templateName){
      this.growlMessageService.showWarningInfo('模板名称不能为空');
      return;
    }

    if((this.emrBaseTemplate.dsSet || []).length == 0 && this.emrBaseTemplate.templateName != '体温单' && this.emrBaseTemplate.templateName != '新生儿体温单'){
      this.growlMessageService.showWarningInfo('数据集不能为空');
      return;
    }
    this.emrBaseTemplate.type = this.emrBaseTemplate.typeObject.code;
    this.emrBaseTemplate.folderStr = this.emrBaseTemplate.folder['idStr'];

    if (this.isCreateEmrBaseTemplate) {
      this.folderService.addBaseTemplate(this.emrBaseTemplate,this.hosnum)
        .then(
          (data) => {
            if (data && data.code == '10000') {
              this.displayEmrBaseTemplateDialog = false;
              this.getEmrBaseTemplateList('');
              this.growlMessageService.showSuccessInfo('新建模板成功！');
            } else {
              this.growlMessageService.showErrorInfo('新建模板失败', data ? data.msg : '新建模板失败');
            }
          },
          (err) => {
            this.growlMessageService.showErrorInfo('新建模板失败：', err);
          }
        );
    } else {
      this.folderService.editBaseTemplate(this.emrBaseTemplate,this.hosnum)
        .then(
          (data) => {
            if (data && data.code == '10000') {
              this.displayEmrBaseTemplateDialog = false;
              this.getEmrBaseTemplateList('');
              this.growlMessageService.showSuccessInfo('编辑模板成功！');
            } else {
              this.growlMessageService.showErrorInfo('', data ? data.msg : '编辑模板失败');
            }
          },
          (err) => {
            this.growlMessageService.showErrorInfo('编辑模板失败：', err);
          }
        );
    }
  }
  showDialogToEditEmrBaseTemplate(emrBaseTemplate) {
    this.isNewTemplate(emrBaseTemplate.templateName,(data) => {
      this.editorNameFlag = data;
      this.isCreateEmrBaseTemplate = false;
      this.emrBaseTemplate = <EmrBaseTemplate>Utils.deepCopyObjAndArray(emrBaseTemplate);
      this.emrBaseTemplate.typeObject = _.find(this.templateTypeList, type => {
        return type.code === emrBaseTemplate.type;
      }) || this.templateTypeList[0];
      this.displayEmrBaseTemplateDialog = true;
    }
    )

  }
  removeEmrBaseTemplate(emrBaseTemplate: EmrBaseTemplate) {
    this.isNewTemplate(emrBaseTemplate.templateName,(data) => {
      if(data){
        this.growlMessageService.showWarningInfo('已经创建过模板，不能删除病历名称');
        return;
      }
      this.confirmationService.confirm({
        message: `确定删除模板${emrBaseTemplate.templateName}?`,
        header: '删除模板',
        icon: 'fa fa-trash',
        accept: () => {
          this.folderService.deleteBaseTemplate(emrBaseTemplate).then(
            (data) => {
              if (data && data.code == '10000') {
                this.getEmrBaseTemplateList('');
                this.growlMessageService.showSuccessInfo(`删除模板${emrBaseTemplate.templateName}成功！`);
              } else {
                this.growlMessageService.showErrorInfo(`删除模板${emrBaseTemplate.templateName}失败`, data ? data.msg : '');
              }
            },
            (err) => {
              this.growlMessageService.showErrorInfo(`删除模板${emrBaseTemplate.templateName}失败：`, err);
            });
        }
      });

    })

  }
  /**
   * 是否创建过模板
   * @param templateTrueName
   */
  isNewTemplate(templateTrueName,callback){
    this.folderService.isNewTemplate(templateTrueName).then(d =>
      d && callback && callback(d['data'])
    )
  };
  searchName() {
    let searchName = this.templateSearchName;
    this.searchParams.page.currentPage = 1;
    this.first = 0 ;
    this.getEmrBaseTemplateList(searchName);
  }
  formatDSet(dsSet){
    if(!dsSet || dsSet.length == 0){
      return '';
    }

    let names = [];
    dsSet.forEach(e => {
      if(this.dsSetObj[e]){

        names.push(this.dsSetObj[e]);
      }
    });

    return names.join(',');
  }
  editorDisplay = false;
  editorTemplateName = '';
  editorId = '';
  dynamicDictList = [];
  // 制作模板
  makeTemplate(template) {
    this.editorDisplay = true;
    this.editorTemplateName = template.templateName;

    this.getBaseTemplateHtml(template.idStr, template.templateName, (htmlData) => {
      this.getTemplateDs(template.templateName, (datasources) => {
        setTimeout(() => {
          this.createTab(this.editorTemplateName, template.idStr, datasources, [
            {
              "code": template.idStr,
              "docContent": htmlData
            }
          ]);
        }, 10);
      });
    });
  }
  // 创建编辑器
  createTab(title,id, datasources, content) {
    this.editorId = 'editor_' + id;
    const _this = this;  // 保存 this 引用
    try {
        // 创建编辑器
        HMEditorLoader.createEditorAsync({
          container: "#editorContainer",
          sdkHost: 'http://'+window.location.host+'/hmEditor',
          style: {
              width: '100%',
              height: '100%',
              border: '1px solid #ddd'
          },
          editorConfig: {
              // 编辑器配置项
          },
          // 模式设置
          designMode: true,  // 是否启用设计模式
          reviseMode: false,  // 是否启用修订模式
          readOnly: false,     // 是否启用只读模式
          customParams: {     // 自定义参数
            
          }
        })
        .then(function(result) {
            // 编辑器初始化完成
            var editorInstance = result;
            
            if (content) {
              // 如果有内容，则设置文档内容
              editorInstance.setDocContent(content);
              editorInstance.setTemplateDatasource({
                'datasource': datasources,
                'dynamicDict': _this.dynamicDictList || []
              });
              editorInstance.onToolbarCommandComplete = function(command, type, data) {
                // 根据命令类型执行不同操作
                if (command === 'save') {
                  console.log('保存命令执行完成');
                  let obj = editorInstance.getDocHtml(id);
                  if(obj && obj.length > 0){
                    _this.saveBaseTemplateHtml({id: id, html: obj[0]['html']});
                  }
                }
              };
            } else {
                // 否则设置默认内容
                editorInstance.editor.setData(`<p style='height:300px;position:relative;'>这是${title}的内容</p>`);
            }
        })
        .catch(function(error) {
            console.error("编辑器初始化失败:", error);
        });
    } catch (error) {
        console.error('创建编辑器失败:', error);
        throw error;
    }
  }
  
  // 关闭编辑器
  backToList() {
    this.editorDisplay = false;
    HMEditorLoader.destroyEditor(this.editorId);
  }

  /**
   * 获取模板数据集
   * @param templateName 模板名称
   * @param callback 回调函数
   */
  getTemplateDs(templateName: string, callback?: (data: any) => void) {
    this.loadingService.loading(true);
    this.folderService.getTemplateDs(templateName)
      .then(data => {
        this.loadingService.loading(false);
        if (data && data.code === 10000) {
          if (callback) {
            callback(data.data);
          }
        } else {
          this.growlMessageService.showErrorInfo('获取模板数据集失败', data ? data.msg : '');
        }
      })
      .catch(error => {
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('获取模板数据集失败', error);
        return null;
      });
  }
  
  /**
   * 获取动态字典数据
   */
  getDynamicDict() {
    this.loadingService.loading(true);
    this.folderService.getDynamicDict()
      .then(data => {
        this.loadingService.loading(false);
        if (data && data.code === 10000) {
          this.dynamicDictList = data['data'] || [];
        } else {
          this.growlMessageService.showErrorInfo('获取动态字典失败', data ? data.msg : '');
        }
      })
      .catch(error => {
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('获取动态字典失败', error);
      });
  }
  // 获取模板HTML
  getBaseTemplateHtml(id: string, templateName: string, callback?: (htmlData: any) => void) {
    this.loadingService.loading(true);
    this.folderService.getBaseTemplateHtml(id)
      .then(data => {
        this.loadingService.loading(false);
        if (data && data.code === 10000) {
          if (callback) {
            callback(data.data);
          }
        } else {
          callback("");
          // this.growlMessageService.showErrorInfo('获取模板HTML失败', data ? data.msg : '');
        }
      })
      .catch(error => {
        this.loadingService.loading(false);
        this.growlMessageService.showErrorInfo('获取模板HTML失败', error);
      });
  }
  // 保存模板HTML
  saveBaseTemplateHtml(params: { id: string, html: string }) {
    this.folderService.saveBaseTemplateHtml(params)
      .then(data => {
        if (data && data.code === 10000) {
          this.growlMessageService.showSuccessInfo('保存模板HTML成功！');
        } else {
          this.growlMessageService.showErrorInfo('保存模板HTML失败', data ? data.msg : '');
        }
      })
      .catch(error => {
        this.growlMessageService.showErrorInfo('保存模板HTML失败', error);
      });
  }
}
