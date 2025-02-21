import { Injectable } from '@angular/core';


import { environment } from '../../../environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { LoadingService } from 'portalface/services';
import { URLSearchParams } from '@angular/http';
import { EmrTemplate } from './model/emr-template';

@Injectable()
export class TemplateUpdateService {

  private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
  private options = new RequestOptions({headers: this.headers});
  private baseUrl = environment.apiUrl+'admin-service';
  constructor(private http: Http,
              private loadingService: LoadingService,
              private authHttpService:AuthHttpService) {
   
  }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); 
        return Promise.reject(error.message || error);
    }

    //查询医院列表
    getHospitals(params): Promise<any> {
        return this.http.post(`${this.baseUrl}/hospitals?test=123`,params)
        .toPromise()
        .then(data => data.json())
        .catch(this.handleError);
    }

    /**
     * 获取医院配置
     * @param searchParams 
     */
    getHospitalPrams(searchParams: any): Promise<Object> {
    return this.authHttpService.get(this.baseUrl + "/paramsConfig/getHospitalConfig", searchParams)
      .toPromise()
      .then(res => {
        return res.data as Object;
      })
      .catch(this.handleError.bind(this));
    }
  
    searchTemplateList(searchParams): Promise<EmrTemplate[]> {
        return this.authHttpService.post(this.baseUrl + "/templateUpdate/searchTemplateList", searchParams)
        .toPromise()
        .then(res => {
          return res.data as EmrTemplate[];
        })
        .catch(this.handleError.bind(this));
    }

    getTemplateUseInfo(searchData: any): Promise<object> {
        return this.authHttpService.post(this.baseUrl + "/templateUpdate/getTemplateUseInfo", searchData)
        .toPromise()
        .then(res => {
            if(res['code'] == 10000){
                return res.data;
            }else{
                return null;
            }
        })
        .catch(this.handleError.bind(this));
    }

    getTemplateUseInfoSize(searchData: any): Promise<Object> {
        return this.authHttpService.post(this.baseUrl + "/templateUpdate/getTemplateUseInfoSize", searchData)
        .toPromise()
        .then(res => res.data as Object)
        .catch(this.handleError);
    }

    // 获取模板目录(模板与目录的映射关系)
    queryDirAndTemplateList(searchParams: any): Promise<Object> {
        this.loadingService.loading(true);
        let urlParams = new URLSearchParams();
        for (let key in searchParams) {
            if (searchParams.hasOwnProperty(key)) {
                urlParams.append(key, searchParams[key]);
            }
        }
        const url = this.baseUrl + '/template/getDirAndTemplateList';
        return this.authHttpService.get(url, urlParams)
        .toPromise()
        .then(res => {
            this.loadingService.loading(false);
            return res.data as Object;
        })
        .catch(this.handleError.bind(this));
    }

    replaceCurEmrRecord(replaceList): Promise<Object> {
        const tmpUrl = this.baseUrl +  '/templateUpdate/replaceCurEmrRecord';
        return this.authHttpService.post(tmpUrl, replaceList)
          .toPromise()
          .then(res => res)
          .catch(this.handleError);
    }

    canReplaceRecordList(replaceList): Promise<Object> {
        const tmpUrl = this.baseUrl +  '/templateUpdate/canReplaceRecordList';
        return this.authHttpService.post(tmpUrl, replaceList)
          .toPromise()
          .then(res => res)
          .catch(this.handleError);
    }

    getAllRecordDataAndTemplateFIle(params): Promise<Object> {
        const tmpUrl = this.baseUrl +  '/templateUpdate/getAllRecordDataAndTemplateFIle';
        return this.authHttpService.post(tmpUrl, params)
          .toPromise()
          .then(res => res.data as Object)
          .catch(this.handleError);
    }
}