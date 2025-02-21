import { Injectable } from '@angular/core';


import { environment } from '../../../environments/environment';
import { Headers, Http } from '@angular/http';
import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { LoadingService } from 'portalface/services';
import { EmrTemplate } from './model/emr-template';
import { BasUser } from '../../basic/common/model/basUser.model';



@Injectable()
export class CollectedTemplateReplaceService {

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private baseUrl = environment.apiUrl + 'admin-service';
    constructor(private http: Http,
        private authHttpService: AuthHttpService) {

    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
    searchCollectedTemplate(searchData): Promise<EmrTemplate[]> {
        return this.authHttpService.post(this.baseUrl + "/templateReplace/searchCollectedTemplate", searchData)
            .toPromise()
            .then(res => {
                return res.data as EmrTemplate[];
            })
            .catch(this.handleError.bind(this));
    }

    getEmrDeptUser(searchData): Promise<BasUser[]> {
        return this.authHttpService.post(this.baseUrl + "/templateReplace/getEmrDeptUser", searchData)
            .toPromise()
            .then(res => {
                return res.data as BasUser[];
            })
        .catch(this.handleError.bind(this));
    }

    searchDropTemplate(searchData): Promise<EmrTemplate[]> {
        return this.authHttpService.post(this.baseUrl + "/templateUpdate/searchTemplateList", searchData)
            .toPromise()
            .then(res => {
                return res.data as EmrTemplate[];
            })
            .catch(this.handleError.bind(this));
    }

    replaceCollectedTemplate(replaceData): Promise<Object> {
        return this.authHttpService.post(this.baseUrl + "/templateReplace/replaceCollectedTemplate", replaceData)
        .toPromise()
        .then(res => res)
        .catch(this.handleError);
    }

    queryNeedReplacedRecordFileAndTemplateFile(queryFile): Promise<Object> {
        return this.authHttpService.post(this.baseUrl + "/templateReplace/replaceCollectedFile", queryFile)
        .toPromise()
        .then(res => res)
        .catch(this.handleError);
    }
}