import { Injectable } from '@angular/core';

import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class FolderService {

  private bathPath = environment.apiUrl + 'admin-service';

  constructor(private authHttpService: AuthHttpService) { }


  /**
   * 获取全部目录
   * @returns 
   */

  getAllFolders():Promise<any>{
    return this.authHttpService.get(`${this.bathPath}/baseFolders?folderName=`)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }
  move(param):Promise<any>{
    return this.authHttpService.post(`${this.bathPath}/moveFolder`,param)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }
  getBasTemplateList(params){
    return this.authHttpService.post(`${this.bathPath}/getBasTemplates`, params)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }
  mapDirTemplate(){
    return this.authHttpService.post(`${this.bathPath}/mapDirTemplate`, {})
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  // del ======================


  searchBaseFolderListByParams(params: any): Promise<any> {
    return this.authHttpService.get(`${this.bathPath}/baseFolders?folderName=${params}`)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  addBaseFolder(baseFolder: any): Promise<any> {
    return this.authHttpService.post(`${this.bathPath}/baseFolder`, baseFolder)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  editBaseFolder(baseFolder: any): Promise<any> {
    return this.authHttpService.post(`${this.bathPath}/baseFolder`, baseFolder)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  deleteBaseFolder(baseFolder: any): Promise<any> {
    return this.authHttpService.delete(`${this.bathPath}/delBaseFolder?id=${baseFolder._id}`)
      .toPromise()
      .then((data) => data)
      .catch(this.handleError);
  }

  getBaseFolderList(): Promise<any> {
    return this.authHttpService.get(`${this.bathPath}/baseFolders?folderName=`)
    .toPromise()
    .then(data => data)
    .catch(this.handleError);
  }

  searchBaseTemplateListByParams(params): Promise<any> {
    return this.authHttpService.post(`${this.bathPath}/baseTemplates`, params)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  addBaseTemplate(baseTemplate,hosnum): Promise<any> {
    return this.authHttpService.post(`${this.bathPath}/baseTemplate?hosnum=`+hosnum, baseTemplate)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  editBaseTemplate(baseTemplate,hosnum): Promise<any> {
    return this.authHttpService.post(`${this.bathPath}/baseTemplate?hosnum=`+hosnum, baseTemplate)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }

  deleteBaseTemplate(baseTemplate): Promise<any> {
    return this.authHttpService.post(`${this.bathPath}/delBaseTemplate`,{id:baseTemplate.idStr})
      .toPromise()
      .then((data) => data)
      .catch(this.handleError);
  }

  publishedDsSet(): Promise<any> {
    return this.authHttpService.get(`${this.bathPath}/datasource/set/allPublishedDsSet`)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  isNewTemplate(templateTrueName): Promise<Object> {
    return this.authHttpService.get(`${this.bathPath}/isNewTemplate?templateTrueName=${templateTrueName}`)
      .toPromise()
      .then(data => data)
      .catch(this.handleError);
  }
}
