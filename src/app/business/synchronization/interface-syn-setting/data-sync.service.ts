import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {CommonSyncBean} from "./commonSyncBean";
import {environment} from "../../../../environments/environment";


@Injectable()
export class DataSyncService {

  private dataSyncContextPath = environment.apiUrl + "admin-service/data-sync";
  private postHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  private interfaceSynPath = environment.apiUrl + "admin-service/data-sync";
  constructor(private http: HttpClient){
  }

  getAreaSettingList():Observable<ApiResult>{
   return this.http.get<ApiResult>(this.interfaceSynPath + "/getAreaSettingList")
  }

  getJobNameList():Observable<ApiResult>{
    return this.http.get<ApiResult>(this.dataSyncContextPath + "/job-name-list")
  }

  getSyncBeanList():Observable<ApiResult>{
    return this.http.get<ApiResult>(this.dataSyncContextPath + "/sync-list")
  }

  /**
   *
   * @param syncBean 立即同步
   */
  syncNow(syncBean: CommonSyncBean): Observable<ApiResult> {
    let paramMap = new HttpParams();
    for (let key in syncBean) {
      if (syncBean.hasOwnProperty(key)) {
        let val = syncBean[key];
        paramMap = paramMap.set(key, val);
      }
    }
    return this.http.get<ApiResult>(this.dataSyncContextPath + '/sync-one-now', {
      params: paramMap
    });
  }

  saveSyncBean(syncBean: CommonSyncBean): Observable<ApiResult> {
    return this.http.post<ApiResult>(this.dataSyncContextPath + '/sync-save', syncBean, {
      headers: this.postHeader
    });
  }

  removeSyncBean(syncBean: CommonSyncBean[]): Observable<ApiResult>{
    return this.http.post<ApiResult>(this.dataSyncContextPath + "/sync-remove", syncBean, {
      headers: this.postHeader
    })
  }
  stopSyncBean(syncBean: CommonSyncBean): Observable<ApiResult> {
    return this.http.post<ApiResult>(this.dataSyncContextPath + '/stop-job', syncBean, {
      headers: this.postHeader
    });
  }
  startSyncBean(syncBean: CommonSyncBean): Observable<ApiResult> {
    return this.http.post<ApiResult>(this.dataSyncContextPath + '/start-job', syncBean, {
      headers: this.postHeader
    });
  }
  
}
