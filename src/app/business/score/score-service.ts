import { LoadingService } from 'portalface/services';
import { environment } from './../../../environments/environment';
import { AuthHttpService } from './../../basic/auth/authHttp.service';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import {Subscribable} from "rxjs/Observable";
import {Observable} from "rxjs";
import { ContentQuality } from './score-standard-query/model/content-quality.model';

@Injectable()
export class ScoreService {
    private api = environment.apiUrl;
    constructor(private authHttpService: AuthHttpService, private loadingService: LoadingService ) {

    }


/**
 * 查询模板名称列表
 */
    inittemplateList(hosnum): Promise<Object> {
        this.loadingService.loading(true);
        let urlParams = new URLSearchParams();
        const url = this.api + 'admin-service/scoreCriteria/getTemplateName?hosnum='+hosnum;
        return this.authHttpService.get(url,urlParams)
        .toPromise()
        .then(res => {
            this.loadingService.loading(false);
            return res.data as Object;
        })
        .catch(this.handleError.bind(this));
    }


    /**
     * 获取医院以及对应科室列表
     * @param params
     */
    queryHospitalListBak(isLoadingHidden ?: boolean): Promise<Object> {
        if (!isLoadingHidden) {
            this.loadingService.loading(true);
        }
        const url = this.api + 'admin-service/template/getHospitalList';
        return this.authHttpService.get(url)
        .toPromise()
        .then(res => {
            this.loadingService.loading(false);
            return res.data as Object;
        })
        .catch(this.handleError.bind(this));
    }



    /**
     * 查询评分标准记录
     * @param params
     */
    queryScoreHistory(params: any): Promise<any> {
        const url = this.api + 'admin-service/scoreCriteria/getScoreCriteria';
        return this.authHttpService.get(url, params)
        .toPromise()
        .then((res) => {
            return res.data as Object;
        })

        .catch(this.handleError.bind(this));

    }

     /**
      * 查询数据元
      * @param params
      */
     searchDataSourceListByParams(params): Promise<any> {
        return this.authHttpService.post(`${this.api}admin-service/scoreCriteria/getDataSources`, params)
          .toPromise()
          .then(data => data)
          .catch(this.handleError);
     }

     /**
      * 保存或更新评分标准规则内容
      * @param params
      */
     saveOrUpdateScoreCriteria(params: ContentQuality): Promise<any> {
         let url = this.api + 'admin-service/scoreCriteria/saveOrUpdateScoreCriteria';
         if(params['rules'] && params['rules'].length > 0){
            url += 'New';
         }
        return this.authHttpService.post(url, params)
        .toPromise()
        .then(data => data)
        .catch(this.handleError.bind(this));
     }



    private handleError(error: any): Promise<any> {
        console.error('An error occurred in template module', error);
        if(this.loadingService){
            this.loadingService.loading(false);
        }
        return Promise.reject(error.message || error);
    }

    /***/
    updateScoreCriteriaStatus(updateInfo):Observable<ApiResult>{
      const url = this.api + 'admin-service/scoreCriteria/updateScoreCriteriaStatus';
      return this.authHttpService.post(url,updateInfo);
    }
}
