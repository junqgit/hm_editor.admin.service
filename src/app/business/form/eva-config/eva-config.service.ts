import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { PublicCommService } from '../../../common/service/public-comm.service';

@Injectable()
export class EvaConfigService {

  constructor(public authHttpService: AuthHttpService,
    public publicservice: PublicCommService) { }

  private api_url = environment.apiUrl + 'admin-service/pda/form/';


  public allImg(areaCode, hosnum, nodecode): Promise<object> {
    let url = this.api_url + 'allImg';
    return this.authHttpService.get(url + `?areaCode=${areaCode}&hosnum=${hosnum}&nodecode=${nodecode}`)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }

  public getWards(areaCode, hosnum, nodecode): Promise<object> {
    let url = this.api_url + 'getWards';
    return this.authHttpService.get(url + `?areaCode=${areaCode}&hosnum=${hosnum}&nodecode=${nodecode}`)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }

  public getNursingForm(areaCode, hosnum, nodecode): Promise<object> {
    let url = this.api_url + 'getNursingForm';
    return this.authHttpService.get(url + `?areaCode=${areaCode}&hosnum=${hosnum}&nodecode=${nodecode}`)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }
  public saveNursingForm(param): Promise<object> {
    let url = this.api_url + 'saveNursingForm';
    return this.authHttpService.post(url, param)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }
  public delNursingForm(id): Promise<object> {
    let url = this.api_url + 'delNursingForm';
    return this.authHttpService.get(url + `?id=${id}`)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }

  // 模板对应数据集的数据元
  public getSetDsList(templateName): Promise<object> {
    return this.authHttpService.get(environment.apiUrl+'admin-service/templateDs'+'?name='+templateName)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }
  // 模板上已维护的数据元
  public getTemplateDs(templateName): Promise<object> {
    return this.authHttpService.get(environment.apiUrl+'admin-service/templateDatasource'+'?name='+templateName)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }
  public getNursingDetail(formId): Promise<object> {
    let url = this.api_url + 'getNursingFormDetail?formId=' + formId;
    return this.authHttpService.get(url)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }
  public saveNursingDetail(data): Promise<object> {
    let url = this.api_url + 'saveNursingFormDetail';
    return this.authHttpService.post(url, data)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }
  public delNursingDetail(id): Promise<object> {
    let url = this.api_url + 'delNursingFormDetail';
    return this.authHttpService.get(url + `?id=${id}`)
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  public getAllTemplate(): Promise<object> {
    let url = environment.apiUrl + 'admin-service/baseTemplates';
    return this.authHttpService.post(url,{page:{currentPage:1,pageSize:10000}})
      .toPromise()
      .then(res => res as object)
      .catch(this.handleError);
  }


  buildDropDown(valArr) {
    return valArr.reduce((p, c) => {
      p.push(this.doBuildDP(c, c));
      return p;
    }, []);
  }
  buildDropDownByFiled(list, nameField, valField) {
    return list.reduce((p, c) => {
      p.push(this.doBuildDP(c[nameField], c[valField]));
      return p;
    }, [this.doBuildDP('请选择', '')]);
  }
  doBuildDP(name, val) {
    return { "label": name, "value": val };
  }
}
