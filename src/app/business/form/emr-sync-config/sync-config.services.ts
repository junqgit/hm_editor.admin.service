import {Injectable} from '@angular/core';
import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { PublicCommService } from '../../../common/service/public-comm.service';

import { environment } from '../../../../environments/environment';
import { CurrentUserInfo } from '../../../basic/common/model/currentUserInfo.model';

@Injectable()
export class SyncConfigServices {
    baseUrl = environment.apiUrl + 'admin-service/Documents/Norm/Config/';
    constructor( private http: AuthHttpService, private pubServ: PublicCommService) {}
    
    public syncConfigBasParam(hosInfo,type){
        return {"areaCode":hosInfo['areaCode'],"医院编码":hosInfo['hosNum'],"院区编码":hosInfo['nodeNum'],"类型":type}
    }
    public getAllDs(){
        return this.http.get(`${environment.apiUrl}admin-service/datasource/ds/getAllDs`)
      .toPromise()
      .then(data => data as object)
      .catch(this.handleError);
    }
    public getSyncConifg(data): Promise<ApiResult> {
        let url = this.baseUrl+'getSyncConfig';
        return this.http.post(url,
            data)
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }
    public saveSyncConifg(data): Promise<ApiResult> {
        let url = this.baseUrl+'saveSyncConfig';
        return this.http.post(url,
            data)
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }
    public delSyncConifg(id): Promise<ApiResult> {
        let url = this.baseUrl+'delSyncConfig';
        return this.http.post(url+`?id=${id}`,{})
            .toPromise()
            .then(res => res as ApiResult)
            .catch(this.handleError.bind(this));
    }


    getOptionDictList(params): Promise<any> {
        let url = environment.apiUrl + 'admin-service/emr-recordmapper-service/getOptionDictList?'
          + 'areaCode=' + params.areaCode
          + '&hosnum=' + params.hosNum
          + '&nodecode=' + params.nodeCode
          + '&value=' + params.value
          + '&type=' + params.type
        return this.http.get(url)
          .toPromise()
          .then(res => res as Object)
          .catch(this.handleError);
      }
    
      deleteOptionDict(params):Promise<any>{
        let url = environment.apiUrl + 'admin-service/emr-recordmapper-service/deleteOptionDict?'
        + 'areaCode=' + params.areaCode
        +'&hosnum='+params.hosNum
        +'&nodecode='+params.nodeCode
        +'&_id=' + params.id
        return this.http.get(url)
          .toPromise()
          .then(res => res as Object)
          .catch(this.handleError);
      }
    
      saveOptionDict(data):Promise<any>{
        let url = environment.apiUrl + 'admin-service/emr-recordmapper-service/saveOptionDict'
        return this.http.post(url,data)
          .toPromise()
          .then(res => res as Object)
          .catch(this.handleError);
      }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
