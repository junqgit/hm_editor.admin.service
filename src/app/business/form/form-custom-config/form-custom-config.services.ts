import {Injectable} from '@angular/core';
import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { PublicCommService } from '../../../common/service/public-comm.service';
import {Observable} from "rxjs";
import { environment } from '../../../../environments/environment';
import { CustomItems } from '../model/customItems.model';

@Injectable()
export class FormCustomConfigServices {
    baseUrl = environment.apiUrl + 'admin-service/Documents/Norm/Config/';
    // 自定义项一级已选定的项目，二级与三级在查询配置项时已经添加
    configItemsSelectedData: any = null;
    param: any;
    constructor( private http: AuthHttpService, private pubServ: PublicCommService) {}

    getCustomItemsList(hosInfo: any, reportInfo: any): Promise<ApiResult> {
        let url = this.baseUrl + 'getCustomItemsList?hosNum=' + hosInfo.hosNum + '&reportName=' + encodeURI(reportInfo.reportName);
        return this.http.get(url)
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }

    deleteCusItemById(signItem: CustomItems): Promise<ApiResult>  {
        let url = this.baseUrl + 'deleteCusItemById';
        return this.http.post(url, signItem)
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }

    checkCustomItemsByCode(data: CustomItems): Promise<ApiResult>  {
        let url = this.baseUrl + 'checkCustomItemsByCode';
        return this.http.post(url, data)
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }

    saveAndUpdateCustomItems(data: CustomItems): Promise<ApiResult>  {
        let url = this.baseUrl + 'saveAndUpdateCustomItems';
        return this.http.post(url, data)
        .toPromise()
        .then(res => res as ApiResult)
        .catch(this.handleError.bind(this));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
