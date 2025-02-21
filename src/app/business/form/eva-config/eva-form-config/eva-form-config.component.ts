import { ConfirmationService } from 'portalface/widgets';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { AuthTokenService } from '../../../../basic/auth/authToken.service';
import { EvaConfigService } from '../eva-config.service';
import { environment } from '../../../../../environments/environment.prod';
import { ChineseUtils } from '../../../../utils/ChineseUtils';

@Component({
  selector: 'kyee-eva-form-config',
  templateUrl: './eva-form-config.component.html',
  styleUrls: ['./eva-form-config.component.scss'],
  providers: [EvaConfigService]
})
export class EvaFormConfigComponent implements OnInit {

  @Input() isSysAdmin: boolean;
  @Input() hospitalInfo: any;
  formList: any[];
  formListBak: any[];

  commonSwitchDP = this.buildDropDown(["是", "否"]);
  commonSearchDP = this.buildDropDown(["", "评估文书类", "评估表单类", "护理表单类"]);
  commonTypeDP = this.buildDropDown(["", "护理记录单类", "入院类", "风险评估类", "普通类"]);
  commonGroupDP = this.buildDropDown(["", "基本信息", "体征信息", "医嘱管理", "护理管理", "风险评估", "其他"]);
  dymicImgDp: any[];
  dymicDeptDp: any[];

  dymicTemplateDp: any[];
  imgDlg: boolean;
  imgName: string;
  @ViewChild('fileUpload') fileUpload: ElementRef;

  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'admin-service/pda/form/uploadImg',
    method: 'POST',
    itemAlias: 'file',
    authToken: this.authTokenService.createAuthorizationTokenHeader(),
    autoUpload: false,
    parametersBeforeFiles: true,
    headers: [{ name: 'charset', value: 'UTF-8' }]
  });


  msgs: any[];

  nfdDlg: boolean;
  selectRow: object;



  constructor(private authTokenService: AuthTokenService, private evaService: EvaConfigService, private confirmationService: ConfirmationService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.init();
    // this.initImg();
    // this.initDeptDp();
    // this.initUpload();
    // this.initFormData();
  }
  init() {
    this.initUpload();
    this.initTemplates();
    let ps = [];
    ps[0] = new Promise((rs, rj) => {
      this.initImg(rs);
    })
    ps[1] = new Promise((rs, rj) => {
      this.initDeptDp(rs);
    })
    Promise.all(ps).then(d => this.initFormData());

  }
  initImg(resolve) {
    this.evaService.allImg(this.hospitalInfo.areaCode, this.hospitalInfo.hosNum, this.hospitalInfo.nodeNum).then(d => {
      if (d['code'] == '10000' && d['data'] && d['data'].length > 0) {
        this.dymicImgDp = this.buildDropDownByFiled(d['data'], '名称', '地址');
      } else {
        this.dymicImgDp = [];
      }
      resolve('');

    })
  }
  initFormData() {
    this.formList = [];
    this.evaService.getNursingForm(this.hospitalInfo.areaCode, this.hospitalInfo.hosNum, this.hospitalInfo.nodeNum).then(d => {
      if (d['code'] == '10000') {
        this.formList = d['data'] || [];
      } else {
        this.showMessage('error', '', '获取表单配置列表异常');
      }
      this.formListBak = JSON.parse(JSON.stringify(this.formList));
    })
  }

  initUpload() {
    this.uploader.onBuildItemForm = this.buildItemForm.bind(this);
    this.uploader.onSuccessItem = this.successFile.bind(this);
    this.uploader.onAfterAddingFile = this.afterAddFile.bind(this);
    this.uploader.onErrorItem = this.errorUploadFile.bind(this);
  }
  initDeptDp(resolve) {
    this.evaService.getWards(this.hospitalInfo.areaCode, this.hospitalInfo.hosNum, this.hospitalInfo.nodeNum).then(d => {
      if (d['code'] == '10000' && d['data'] && d['data'].length > 0) {
        this.dymicDeptDp = this.buildDropDownByFiled(d['data'], '科室名称', '科室ID');
      } else {
        this.dymicDeptDp = [];
      }
      resolve('');
    })
  }

  initTemplates() {
    this.dymicTemplateDp = [];
    this.evaService.getAllTemplate().then(ts => {
      if (ts['code'] != '10000') {
        this.showMessage('error', '', '获取模板列表异常');
        return;
      }
      this.dymicTemplateDp = this.buildDropDownByFiled(ts['data']['dataList'] || [], 'templateName', 'templateName');
    })
  }
  addRow() {
    let e = this.formList.filter(r => !r['REPORT_NAME']);
    if (e.length > 0) {
      this.showMessage('info', '', '请先完善未填写的表单信息');
      return;
    }
    this.formList = this.formList.concat({'IS_CUSTOM':'否', 'IS_HIDE': "否", 'IS_QUERY': '', 'SHOW_INDEX': (this.formList.length + 1) + '' });
  }
  saveAll() {
    let len = this.formList.length;
    if (len == 0) {
      return;
    }
    let insert = [], update = [];
    let trueNameObj = {};
    for (let i = 0; i < len; i++) {
      let r = this.formList[i];
      let n = r['REPORT_NAME']
      // 名称不能重复、且不为空，序号必须正整数
      if (!n) {
        this.showMessage('error', '', '表单名称不能为空');
        return;
      }
      if (trueNameObj[n]) {
        this.showMessage('error', '', '表单名称不能重复');
        return;
      }
      trueNameObj[n] = true;
      let order = r['SHOW_INDEX'] || '1';
      order = order.replace(/[^\d]/g, '') || '1';

      let _r = {};
      Object.assign(_r, r);
      _r['SHOW_INDEX'] = order * 1;
      if (!_r['_id']) {
        insert.push(_r);
      } else {
        let b = this.formList.find(f => f['_id'] == r['_id']);
        if (JSON.stringify(b) != JSON.stringify(_r)) {
          update.push(_r);
        }
      }
    }
    // insert

    // update

    let param = {};

    let f = false;
    if (insert.length > 0) {
      f = true;
      insert.forEach(i => {
        i['areaCode'] = this.hospitalInfo.areaCode;
        i['医院编码'] = this.hospitalInfo.hosNum;
        i['院区编码'] = this.hospitalInfo.nodeNum;
      })
      param['insert'] = insert;
    }
    if (update.length > 0) {
      f = true;
      param['update'] = update;
    }
    if (f) {
      this.evaService.saveNursingForm(param).then(d => {
        if (d['code'] == '10000') {
          this.showMessage('success', '', '保存成功');
          this.initFormData();
        } else {
          this.showMessage('error', '', '保存失败');
        }
      })
    }
  }

  del(data, i) {
    this.confirmationService.confirm({
      header: '确认删除',
      message: '确认删除此配置？',
      accept: () => {
        if (data['_id']) {

          this.evaService.delNursingForm(data['_id']).then(d => {
            if (d['code'] == '10000') {
              this.formList.splice(this.formList.findIndex(f => f['_id'] == data['_id']), 1);
              this.formList = [...this.formList];
              this.formListBak = JSON.parse(JSON.stringify(this.formList));
              this.showMessage('success', '', '删除成功');
            } else {
              this.showMessage('error', '', '删除失败');
            }
          })
        } else {
          this.formList.splice(i, 1);
          this.formList = [...this.formList];
          this.showMessage('success', '', '删除成功');
        }
      }
    });


  }
  buildDropDown(valArr) {
    return valArr.reduce((p, c) => {
      p.push(this.doBuildDP(c, c));
      return p;
    }, []);
  }
  buildDropDownByFiled(list, nameField, valField) {
    return list.reduce((p, c) => {
      p.push(this.doBuildDP(c[nameField], c[valField]));
      return p;
    }, [this.doBuildDP('请选择', '')]);
  }
  doBuildDP(name, val) {
    return { "label": name, "value": val };
  }

  showDetail(data) {
    this.nfdDlg = false;
    this.selectRow = data;
    this.ref.detectChanges();
    this.nfdDlg = true;
  }

  showVal(type, val) {

    let data = [];
    if (type == 'img') {
      data = this.dymicImgDp;
    } else if (type == 'dept') {
      data = this.dymicDeptDp;
    }
    var d = data.find(d => d.value == val);
    if (d) {
      return d['label'] || '';
    }
    return '';
  }

  /**
   * 上传图片
   */
  showImgDlg() {
    this.imgDlg = true;
  }
  beforeHideImportFileDialog(evt) {
    this.fileUpload.nativeElement.value = '';
    this.imgName = '';
    this.uploader.clearQueue();
  }
  importFile(evt) {
    this.fileUpload.nativeElement.click();
  }
  confirmUpload() {
    if (this.uploader.queue.length === 0) {
      this.showMessage('warn', '', '请先选择文件，再上传');
      return;
    }
    if (this.uploader.queue[0].isUploading) {
      this.showMessage('warn', '', '文件正在上传中...');
      return;
    }
    const fileItem = this.uploader.queue[0];
    if (fileItem._file.name.startsWith("template")) {
      this.showMessage('warn', '', '此处请导入console平台模板，该模板可在模板管理处导入');
      return;
    }
    fileItem.upload();
  }
  buildItemForm(fileItem: FileItem, form: any): any {
    let additionalParameter = {};

    additionalParameter['areaCode'] = this.hospitalInfo.areaCode;
    additionalParameter['hosnum'] = this.hospitalInfo.hosNum;
    additionalParameter['nodecode'] = this.hospitalInfo.nodeNum;
    additionalParameter['imgName'] = this.imgName;
    fileItem.file['name'] = this.imgName;
    this.uploader.setOptions({ 'additionalParameter': additionalParameter });
  }
  successFile(fileItem: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    if (status === 200) {
      // 上传文件后获取服务器返回的数据
      let resData;
      if (response && (resData = JSON.parse(response)).code == 10000) {
        this.addImg2Drop(this.imgName,resData.data);
        this.showMessage('success', '', '导入成功');
      } else {
        this.showMessage('error', '', '图片导入失败');
      }
      this.closeUploadDialog();
    } else {
      // 上传文件后获取服务器返回的数据错误
      this.showMessage('error', '', '文件导入失败');
    }
  }
  addImg2Drop(name,fid){
    let editorFlag = false;
    this.dymicImgDp.forEach(d => {
      if(d['label'] == name){
        d['value'] = fid;
        editorFlag = true;
      }
    })
    if(!editorFlag){
      this.dymicImgDp.push({"label":name,"value":fid});
      this.dymicImgDp = [...this.dymicImgDp];
    }
  }
  /**
   * 添加文件上传之前事件处理
   * @param fileItem
   */
  afterAddFile(fileItem: FileItem): any {
    this.imgName = fileItem.file ? fileItem.file.name : '未命名文件';
    if (this.imgName.indexOf('.') > -1) {
      this.imgName = this.imgName.substring(0, this.imgName.indexOf('.'));

    }


  }

  /**
   * 文件上传异常监听
   * @param fileItem
   */
  errorUploadFile(fileItem: FileItem): any {
    this.showMessage('error', '', '网络异常');
  }

  /**
   * 移除添加的文件
   */
  removeFile() {
    this.fileUpload.nativeElement.value = '';
    this.imgName = '';
  }
  closeUploadDialog() {
    this.imgDlg = false;
  }
  /**
   * 消息提醒
   */
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }
  showNameBlur(rowData){
    let ch = ChineseUtils.getChineseFirstPY(rowData['REPORT_SHOW_NAME'],null);
    rowData['REPORT_PY_NAME'] = ch;
  }
}
