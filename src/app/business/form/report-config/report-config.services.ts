import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { PublicCommService } from '../../../common/service/public-comm.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class EmrReportService {
    baseUrl = environment.apiUrl + 'admin-service/';
    // 自定义项一级已选定的项目，二级与三级在查询配置项时已经添加
    configItemsSelectedData: any = null;
    param: any;
    constructor(private http: AuthHttpService, private pubServ: PublicCommService) { }
    getDataList(params): Promise<any> {
        let emrType = params['emrType'].length ? params['emrType'].join(',') : '';
        let url = this.baseUrl + 'emr-recordmapper-service/getDataList?'
            + 'areaCode=' + params.areaCode
            + '&医院编码=' + params.hosNum
            + '&院区编码=' + params.nodeCode
            + '&jsonType=' + params.jsonType
            + '&emrType=' + emrType
            + '&mapperJsonName=' + params.mapperJsonName
            + '&clcType=' + params.clcType
            + '&pageNo=' + params.pageNo
            + '&pageSize=' + params.pageSize
            + '&sortOrder=' + params.sortOrder
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    getRecordMapperById(params): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/getRecordMapperById?'
            + 'areaCode=' + params.areaCode
            + '&医院编码=' + params.hosNum
            + '&院区编码=' + params.nodeCode
            + '&_id=' + params.id
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    getallFileds(params): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/getallFileds?'
            + 'names=' + params.names
            + '&clcType=' + params.clcType
            + '&key=' + params.key
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    deleteRecordMapperData(params): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/deleteRecordMapperData?'
            + 'areaCode=' + params.areaCode
            + '&医院编码=' + params.hosNum
            + '&院区编码=' + params.nodeCode
            + '&_id=' + params.id
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    saveRecordMapperData(data): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/saveRecordMapperData'
        return this.http.post(url, data)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    getOptionDictList(params): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/getOptionDictList?'
            + 'areaCode=' + params.areaCode
            + '&hosnum=' + params.hosNum
            + '&nodecode=' + params.nodeCode
            + '&value=' + params.value
            + '&type=上报配置'
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    deleteOptionDict(params): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/deleteOptionDict?'
            + 'areaCode=' + params.areaCode
            + '&hosnum=' + params.hosNum
            + '&nodecode=' + params.nodeCode
            + '&_id=' + params.id
        return this.http.get(url)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    saveOptionDict(data): Promise<any> {
        let url = this.baseUrl + 'emr-recordmapper-service/saveOptionDict'
        return this.http.post(url, data)
            .toPromise()
            .then(res => res as Object)
            .catch(this.handleError);
    }

    getDirAndTemplateListByLoginUser(loginUser): Promise<any> {
        return this.http.post(environment.apiUrl + 'template-service/getDirAndTemplateListByLoginUser?scope=医院', loginUser)
            .toPromise()
            .then(res => res.data)
            .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
