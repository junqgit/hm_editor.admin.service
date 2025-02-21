import { Injectable } from '@angular/core';
import { Router, ActivatedRoute , CanActivate, CanActivateChild,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthTokenService } from './authToken.service';
import { AuthLoginService } from './authLogin.service';
import {CurrentPatientInfo} from "../common/model/currentPatientInfo.model";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
        private authTokenService: AuthTokenService,
        private authLoginService: AuthLoginService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        let params:object = route.queryParams;
        return this.checkLogin(url,params);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string,params:object): boolean {
        if (this.authTokenService.isLoggedIn()) {
            return true;
        }
        AuthLoginService.landingPage = url;

        if(params['isPatientFocus']){
          let currentPatientInfo: CurrentPatientInfo = new CurrentPatientInfo();
          currentPatientInfo.inpNo = params['inpNo'];
          currentPatientInfo.patientId = params['patientId'];
          currentPatientInfo.bedNo = params['bedNo'];
          this.authTokenService.setCurrentPatientInfo(currentPatientInfo);
        }

        this.router.navigate(['/login'],{ queryParams: params });
        return false;

    }
}
