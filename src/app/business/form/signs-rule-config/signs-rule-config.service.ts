import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { PublicCommService } from '../../../common/service/public-comm.service';

@Injectable()
export class SignsRuleConfigService {

  constructor(public authHttpService: AuthHttpService,
              public publicservice: PublicCommService) { }

    private api_url = environment.apiUrl + 'admin-service/Documents/Norm/Signs/SignsRuleConfig/';

    // 获取体征配置项和数据
    public getConfig(selectedWard: string, hosNum: string, nodecode: string, searchNewBronConfig: boolean): Promise<object> {
        let url = this.api_url + 'getConfig';
        return this.authHttpService.post(url,
            {
                hosNum: hosNum,
                nodecode: nodecode,
                wardId: selectedWard,
                reportId: 'tiwendan',
                parameter: '1',
                searchNewBronConfig:searchNewBronConfig?"1":"0"
            })
        .toPromise()
        .then(res => res as object)
        .catch(this.handleError);
    }

    /**
     * 保存配置数据
     * @param pointor
     * @param dataArr
     * @param dataFlag
     * @constructor
     */
    public SaveConfig(selectedWard: string, dataArr: any , hosNum: string): Promise<object> {
        let url = this.api_url + 'saveConfig?wardId=' + selectedWard + '&hosNum=' + hosNum;
        return this.authHttpService.post(url, dataArr)
        .toPromise()
        .then(res => res as object)
        .catch(this.handleError);
    }

    /**
     * 删除配置记录
     * @param pointor
     */
    public deleteConfig(recID: any, selectedWard: string, hosNum: string):  Promise<object> {
        let url = this.api_url + 'deleteConfig?hosNum=' + hosNum + '&wardId=' + selectedWard + '&_id=' + recID;
        return this.authHttpService.get(url)
        .toPromise()
        .then(res => res as object)
        .catch(this.handleError);
    }

    /**
     * 获取时间点配置信息
     * @param param
     */
    public queryTimePoint(hosNum: string, newBornConfig:boolean): Promise<object> {
        let url = this.api_url + 'queryTimePoint?hosNum=' + hosNum + '&type='+(newBornConfig?"新生儿":"成人");
        return this.authHttpService.get(url)
        .toPromise()
        .then(res => res as object)
        .catch(this.handleError);
    }

    // 保存时间点配置
    public saveTimePoint(timePointArr): Promise<object>  {
        let url = this.api_url + 'saveTimePoint';
        return this.authHttpService.post(url, timePointArr)
        .toPromise()
        .then(res => res as object)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
