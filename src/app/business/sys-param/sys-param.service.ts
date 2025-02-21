import { AuthTokenService } from './../../basic/auth/authToken.service';
import { CurrentUserInfo } from './../../basic/common/model/currentUserInfo.model';
import { BusinessParamBean } from './business-param/model/businessParamBean';

import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import { AuthHttpService } from './../../basic/auth/authHttp.service';
import {CommonJob} from "./interface-stamp-configuration/interface-stamp-configuration.model";
import { LoadingService } from "portalface/services";

@Injectable()
export class SysParamService {
  private api  = environment.apiUrl;
  private bathPath = environment.apiUrl + 'admin-service/data-sync/';
  private areasInterfacePath = environment.apiUrl + "admin-service/paramsConfig";
  private postHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private authHttpService: AuthHttpService,private loadingService: LoadingService,private authToeknService: AuthTokenService) {
  }

  getAreasAndHospitalsByRole(filterHospitalName:String): Observable<ApiResult> {
    const cur = this.getCurUser();
    let hosnum = '';
    let nodecode = '';
    if(!this.isAreaUser(cur)){
      hosnum = cur.hosNum;
      nodecode = cur.nodeCode;
    }
    return this.http.get<ApiResult>(this.areasInterfacePath + "/getAreaHospitalList?hospitalName="+filterHospitalName+`&hosnum=${hosnum}&nodecode=${nodecode}`);
  }
  getAreasAndHospitalsListBak(filterHospitalName:String): Observable<ApiResult> {
    return this.http.get<ApiResult>(this.areasInterfacePath + "/getAreaHospitalList?hospitalName="+filterHospitalName);
  }

  getHospitalInfo(areaCode, hosNum, nodeNum): Promise<ApiResult> {
    return this.http.get(this.areasInterfacePath + '/getHospitalInfo?areaCode=' + areaCode + '&医院编码=' + hosNum + '&院区编码=' + nodeNum)
    .toPromise()
    .then(res => {
      return res as ApiResult;
    })
    .catch(this.handleError);
  }


  getHospitalPrams(searchParams: any): Promise<Object> {
    let paramMap = new HttpParams();
    for (let key in searchParams) {
      if (searchParams.hasOwnProperty(key)) {
        let val = searchParams[key];
        paramMap = paramMap.set(key, val);
      }
    }
    return this.http.get<Object>(this.areasInterfacePath + "/getHospitalConfig", {params: paramMap})
      .toPromise()
      .then(res => {
        return res['data'] as Object;
      })
      .catch(this.handleError);
  }



  saveHospitalParams(businessParamBean: BusinessParamBean,curKey:string): Observable<ApiResult> {
    if(curKey.indexOf('pda') == 0){
      curKey = 'pda全局设置';
    }
    return this.authHttpService.post(this.areasInterfacePath + '/updateHospitalConfig?key='+curKey, businessParamBean);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  queryAreaSettingList(): Observable<ApiResult> {
    return this.authHttpService.get(this.bathPath + 'getAreaSettingList');
  }

  saveAreaSetting(params): Observable<ApiResult> {
    return this.authHttpService.post(this.bathPath + 'saveAreaSetting', params);
  }

  removeAreaSetting(params): Observable<ApiResult> {
    return this.authHttpService.post(this.bathPath + 'removeAreaSetting', params);
  }

  queryInterfacesList(params):Observable<ApiResult>{
    return this.authHttpService.get(this.bathPath + 'job-name-list?key='+params,)
  }

  /*
  * 编辑定时器设置
  * */
  updateInterfaceStamp(commonJob:CommonJob):Observable<ApiResult>{
    return this.authHttpService.post(this.bathPath + 'saveJob',commonJob);
  }

  checkUrl(url):Observable<ApiResult> {
    return this.authHttpService.get(this.bathPath + 'testUrl?url='+url);
  }

  migrateData(params): Observable<ApiResult> {
    return this.authHttpService.post(environment.apiUrl + 'admin-service/migrate/nursingData', params);
  }

  getAllTemplateList(hosnum): Promise<Object> {
    const url = this.api + 'admin-service/scoreCriteria/getTemplateName?hosnum='+hosnum;
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => {
        this.loadingService.loading(false);
        return res.data as Object;
    })
    .catch(this.handleError.bind(this));
  }

  searchDataSourceListByParams(params): Promise<any> {
    return this.authHttpService.post(`${environment.apiUrl}admin-service/scoreCriteria/getAllDataSources`, params)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }
  /**
   * 获取所有一日一测体征项（包含自定义项，新生儿的一日一测项）
   * @param hosNum
   * @param nodeCode
   * @returns
   */
  getAllOnceConfigItems(hosNum: string, nodeCode: string): Promise<ApiResult> {
    const url = this.areasInterfacePath + '/getAllOnceConfigItems?hosNum=' + hosNum + '&nodeCode=' + nodeCode;
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => res as ApiResult)
    .catch(this.handleError.bind(this));
  }

  // 获取模板目录
  queryDirAndTemplateList(searchParams: any): Promise<any> {
    const url = this.api + 'admin-service/template/getDirAndTemplateList';
    return this.authHttpService.get(url, searchParams)
    .toPromise()
    .then(res => res)
    .catch(this.handleError.bind(this));
  }

  getWardList(areaCode:String,hosNum: string, nodeCode: string): Promise<ApiResult> {
    const url = this.areasInterfacePath + '/getWardList?医院编码=' + hosNum + '&院区编码=' + nodeCode+ '&areaCode=' + areaCode;
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => res as ApiResult)
    .catch(this.handleError.bind(this));
  }
  isAreaUser(cur:CurrentUserInfo){
    if(!cur){
      cur = this.getCurUser();
    }
    return cur.currentRole == '区域';
  }
  isHosUser(cur:CurrentUserInfo){
    if(!cur){
      cur = this.getCurUser();
    }
    return cur.currentRole == '医院';
  }
  isCommonUser(cur?:CurrentUserInfo){
    if(!cur){
      cur = this.getCurUser();
    }
    return cur.currentRole == '用户';
  }
  getCurUser():CurrentUserInfo{
    return JSON.parse(this.authToeknService.getCurrentUserInfo() || '');
  }
  queryHospitalList(isLoadingHidden ?: boolean,hosnum = '',nodecode=''): Promise<any[]> {
    if (!isLoadingHidden) {
        this.loadingService.loading(true);
    }
    const url = this.api + 'admin-service/template/getHospitalList?hosnum='+hosnum+'&nodecode='+nodecode;
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => {
        this.loadingService.loading(false);
        return res.data || [] as any[];
    })
    .catch(this.handleError.bind(this));
}
queryHospitalListByRole(isLoadingHidden ?: boolean): Promise<any[]> {
  let cu = this.getCurUser();
  let hosnum = '';
  let nodecode = '';
  if(!this.isAreaUser(cu)){
    hosnum = cu.hosNum;
    nodecode = cu.nodeCode;
  }
  return this.queryHospitalList(isLoadingHidden,hosnum,nodecode);
}
getPicFile(id: string): Promise<string> {
  const url = this.api + 'admin-service/template/getRecordFile?linkAddr=' + id ;
  return this.authHttpService.get(url)
    .toPromise()
    .then(res => res.data as string)
    .catch(this.handleError);
}
pdaParams(hosnum,nodecode){
  const url = this.api + 'admin-service/paramsConfig/defaultPadConfig?hosnum=' + hosnum+'&nodecode='+nodecode ;
  return this.authHttpService.get(url)
    .toPromise()
    .then(res => res.data as string)
    .catch(this.handleError);
}
editorMedicalIp(){
  const url = this.api + 'admin-service/paramsConfig/editorMedicalIp' ;
  return this.authHttpService.get(url)
    .toPromise()
    .then(res => res.data)
    .catch(this.handleError);
}
public getAllDs(){
  return this.http.get(`${environment.apiUrl}admin-service/datasource/ds/getAllDs`)
.toPromise()
.then(data => data as object)
.catch(this.handleError);
}
}

