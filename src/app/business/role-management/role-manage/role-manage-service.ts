import { AuthHttpService } from './../../../basic/auth/authHttp.service';
import { environment } from './../../../../environments/environment';
import { LoadingService } from 'portalface/services';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import {Observable} from "rxjs";
// import {ClientUser} from "../user-manage/clientUser";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable()
export class RoleManageService {
    private api = environment.apiUrl;
    private postHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    constructor(private http: HttpClient,private authHttpService: AuthHttpService, private loadingService: LoadingService ) {

    }

    queryRoleList(searchParams: any): Promise<Object> {
        this.loadingService.loading(true);
        let urlParams = new URLSearchParams();
        for (let key in searchParams) {
            if (searchParams.hasOwnProperty(key)) {
                urlParams.append(key, searchParams[key]);
            }
        }
        const url = this.api + 'admin-service/rolesManage/getRolesList';
        return this.authHttpService.get(url, urlParams)
        .toPromise()
        .then(res => {
            this.loadingService.loading(false);
            return res as Object;
        })
        .catch(this.handleError.bind(this));
    }

    getAllRoles(params):Observable<ApiResult>{
      const url = this.api + 'admin-service/rolesManage/getAllRoles';
      return this.authHttpService.get(url,params);
    }

    getDefaultMenus():Observable<ApiResult>{
      const  url = this.api + 'admin-service/rolesManage/getDefaultMenus';
      return this.authHttpService.get(url);
    }

    queryUserList(params):Observable<ApiResult>{
      const url = this.api+ 'admin-service/user/getPagedUsers';
      return this.authHttpService.post(url, params);
    }

    querAllDoctors(params):Observable<ApiResult>{
      const url = this.api+ 'admin-service/user/getAllDoctors';
      return this.authHttpService.post(url,params);
    }

    getAllLowerDoctors(params):Observable<ApiResult>{
      const url = this.api + 'admin-service/user/getAllLowerDoctors';
      return this.authHttpService.post(url,params);
    }

    updateUser(params):Observable<ApiResult>{
      const url = this.api + 'admin-service/user/saveUser';
      return this.http.post<ApiResult>(url, params, {
        headers: this.postHeader
      });
    }

    getSignature(param):Observable<ApiResult>{
      const url = this.api + 'admin-service/user/getUserPic';
      return this.http.post<ApiResult>(url,param,{
        headers:this.postHeader
      });
    }

    deleteSignature(param):Observable<ApiResult>{
        const url = this.api + 'admin-service/user/deleteUserPic';
        return this.http.post<ApiResult>(url,param,{
          headers:this.postHeader
        });
    }

    addRole(params:Object): Promise<any> {
        this.loadingService.loading(true);
        const url = this.api + 'admin-service/rolesManage/addRoles';
        return this.authHttpService.post(url, params)
        .toPromise()
        .then((res) => {
            this.loadingService.loading(false);
            return res;
        })
        .catch(this.handleError.bind(this));
    }

    deleteRole(params:Object): Promise<any> {
        this.loadingService.loading(true);
        const url = this.api + 'admin-service/rolesManage/deleteRoles';
        return this.authHttpService.post(url, params)
        .toPromise()
        .then((res) => {
            this.loadingService.loading(false);
            return res as Object;
        })
        .catch(this.handleError.bind(this));
    }

    updateRole(params:Object): Promise<any> {
        this.loadingService.loading(true);
        const url = this.api + 'admin-service/rolesManage/updateRoles';
        return this.authHttpService.post(url, params)
        .toPromise()
        .then((res) => {
            this.loadingService.loading(false);
            return res;
        })
        .catch(this.handleError.bind(this));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred in template module', error);
        this.loadingService.loading(false);
        return Promise.reject(error.message || error);
    }

}
