import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { PublicCommService } from '../../common/service/public-comm.service';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable()
export class DataTransmitService {
    baseUrl = environment.apiUrl + 'admin-service/';
    constructor(
        private http: AuthHttpService
    ) { }

    getDataList(params): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/getDataList?'
            + 'areaCode=' + params.areaCode
            + '&医院编码=' + params.hosNum
            + '&院区编码=' + params.nodeCode
            + '&jsonType=' + params.jsonType
            + '&emrType=' + ''
            + '&mapperJsonName=' + ''
            + '&clcType=' + params.clcType
            + '&pageNo=' + 1
            + '&pageSize=' + 10000
            + '&sortOrder=' + 1
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    //  数据补传 
     public reportHistoryData(params): Promise<ApiResult> {
        let url = this.baseUrl + 'emr-recordmapper-service/reportHistoryData';
        return this.http.post(url, params)
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
