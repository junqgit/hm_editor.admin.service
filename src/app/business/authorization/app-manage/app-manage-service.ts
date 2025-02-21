import { AuthHttpService } from '../../../basic/auth/authHttp.service';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class AppManageService {
    private api = environment.apiUrl;
    private postHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    constructor(private http: HttpClient, private authHttpService: AuthHttpService) {

    }

    getAuthorizationInfo(username, pageNo, pageSize, sysname): Promise<any> {
        const url = this.api + 'admin-service/jwtUser/getJwtUserList?username=' + username + '&pageNo=' + pageNo + '&pageSize=' + pageSize + '&sysname=' + sysname;
        return this.authHttpService.get(url)
            .toPromise()
            .then(data => data)
            .catch(this.handleError);
    }

    updateAuthorizationInfo(params: Object): Promise<any> {
        const url = this.api + 'admin-service/rolesManage/addRoles';
        return this.authHttpService.post(url, params)
            .toPromise()
            .then(data => data)
            .catch(this.handleError);
    }


    deleteAuthorizationInfo(params: Object): Promise<any> {
        const url = this.api + 'admin-service//jwtUser/delJwtUserInfo';
        return this.authHttpService.post(url, params)
            .toPromise()
            .then(data => data)
            .catch(this.handleError);
    }

    addorUpdateAuthorizationInfo(params: Object): Promise<any> {
        const url = this.api + 'admin-service/jwtUser/saveJwtUserInfo';
        return this.authHttpService.post(url, params)
            .toPromise()
            .then(data => data)
            .catch(this.handleError);
    }

    getHospitalPrams(searchParams: any): Promise<Object> {
        return this.authHttpService.get(this.api + "admin-service/paramsConfig/getHospitalConfig", searchParams)
            .toPromise()
            .then(res => {
                return res.data as Object;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
