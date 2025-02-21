import { environment } from './../../../environments/environment';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { Observable,Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AuthHttpService } from './authHttp.service';
import {AuthTokenService} from './authToken.service';
import {BasUserService} from './bas-user.service';

import {CurrentUserInfo} from "../common/model/currentUserInfo.model";
import {CurrentSystemParam} from "../common/model/currentSystemParam";

@Injectable()
export class AuthLoginService {

    public static landingPage:string = "main";
    constructor(
        private router:Router,
        private http: Http,
        private authHttpService: AuthHttpService,
        private authTokenService:AuthTokenService,
        private basUserService: BasUserService,
    ) {}


    doLogin(currentUserInfo:CurrentUserInfo, currentSystemParam:CurrentSystemParam): void {
        this.authTokenService.setCurrentSystemParam(currentSystemParam);
        if(!this.authTokenService.getCurrentUserInfo()){
            this.basUserService.getUserInfo(currentUserInfo.areaCode,currentUserInfo.userId).subscribe(bu => {
                if(bu['code'] != '10000'){
                    this.doLogout();
                    return;
                }
                this.authTokenService.setBasUserInfo(bu['data']);
                this.basUserService.initRoles(bu['data'],currentUserInfo);
                this.basUserService.setUserInfoThenNavigate(currentUserInfo,"/main/business/authorization/userManage");
            });
            return;
        }
        this.basUserService.setUserInfoThenNavigate(currentUserInfo,"/main/business/authorization/userManage");
    }


    doLogout(navigatetoLogout=true): void {
        this.authTokenService.removeCurrentUserInfo();
        this.authTokenService.removeBasUserInfo();
        this.authTokenService.removeJwtToken();
        this.router.navigate(["main/**"]);
        this.authTokenService.removeEmrSetting();
    }
}
