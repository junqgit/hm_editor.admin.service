import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import { AuthHttpService } from './../../basic/auth/authHttp.service';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable()
export class SynchronizationService {

  private interfaceSynPath = environment.apiUrl + 'admin-service/data-sync';
  private postHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private authHttpService: AuthHttpService) {
  }

  queryAreaSettingList(): Observable<ApiResult> {
   return this.authHttpService.get(this.interfaceSynPath + '/getAreaSettingList');
  }

  queryJobNameList(): Observable<ApiResult> {
    return this.authHttpService.get(this.interfaceSynPath + '/job-name-list');
  }

  querySyncMonitorList(params): Observable<ApiResult> {
    return this.authHttpService.post(this.interfaceSynPath + '/sync-monitor-list', params);
  }

  removeSyncMonitor(params): Observable<ApiResult>{
    return this.authHttpService.post(this.interfaceSynPath + "/sync-monitor-remove?monitorId="+params,null);
  }
}
