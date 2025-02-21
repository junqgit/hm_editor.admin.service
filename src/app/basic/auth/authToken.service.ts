
import { Injectable, Inject } from '@angular/core';

import {CurrentUserInfo} from "../common/model/currentUserInfo.model";
import {BasUser} from "../common/model/basUser.model";
import {CurrentPatientInfo} from "../common/model/currentPatientInfo.model";
import {CurrentSystemParam} from "../common/model/currentSystemParam";
import {EmrSetting} from "../common/model/emrSetting.model";

@Injectable()
export class AuthTokenService {

    public TOKEN_KEY:string = "emr_jwtToken";
    public CURRENT_USER_INFO:string = "emr_currentUserInfo";
    public BAS_USER_INFO:string = "emr_basUserInfo";
    public CURRENT_PATIENT_INFO:string = "emr_currentPatientInfo";
    public CURRENT_SYSTEM_PARAM:string = "emr_currentSystemParam";
    public EMR_SETTINGS = "emr_settings";

    constructor(
    ) {}


    createAuthorizationTokenHeader():any  {
        var token = this.getJwtToken();
        if (token) {
            return "Bearer " + token;
        } else {
            return "";
        }
    }

    isLoggedIn():boolean{
        return this.getJwtToken() ? true : false;
        // return true;
    }

    getJwtToken() :string{
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    setJwtToken(token:string) :void{
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    removeJwtToken() :void{
      sessionStorage.removeItem(this.TOKEN_KEY);
    }

    getCurrentUserInfo() :string{
        return sessionStorage.getItem(this.CURRENT_USER_INFO);
    }

    setCurrentUserInfo(currentUserInfo:CurrentUserInfo) :void{
      sessionStorage.setItem(this.CURRENT_USER_INFO, JSON.stringify(currentUserInfo) );
    }

    removeCurrentUserInfo() :void{
      sessionStorage.removeItem(this.CURRENT_USER_INFO);
    }

    getBasUserInfo() :string{
      return sessionStorage.getItem(this.BAS_USER_INFO);
    }

    setBasUserInfo(basUser:BasUser) :void{
      sessionStorage.setItem(this.BAS_USER_INFO, JSON.stringify(basUser) );
    }

    removeBasUserInfo() :void{
      sessionStorage.removeItem(this.BAS_USER_INFO);
    }

    getCurrentPatientInfo() :string{
      return sessionStorage.getItem(this.CURRENT_PATIENT_INFO);
    }

    setCurrentPatientInfo(currentPatientInfo:CurrentPatientInfo) :void{
      sessionStorage.setItem(this.CURRENT_PATIENT_INFO, JSON.stringify(currentPatientInfo) );
    }

    removeCurrentPatientInfo() :void{
      sessionStorage.removeItem(this.CURRENT_PATIENT_INFO);
    }

    getCurrentSystemParam(): string{
      return sessionStorage.getItem(this.CURRENT_SYSTEM_PARAM);
    }

    setCurrentSystemParam(currentSystemParam: CurrentSystemParam): void{
      sessionStorage.setItem(this.CURRENT_SYSTEM_PARAM, JSON.stringify(currentSystemParam));
    }

    removeCuurentSystemParam(): void{
      sessionStorage.removeItem(this.CURRENT_SYSTEM_PARAM);
    }

    setEmrSetting(emrSetting:EmrSetting):void{
      sessionStorage.setItem(this.EMR_SETTINGS,JSON.stringify(emrSetting));
    }
    removeEmrSetting():void{
      sessionStorage.removeItem(this.EMR_SETTINGS);
    }

  getEmrSetting() :string{
    return sessionStorage.getItem(this.EMR_SETTINGS);
  }
}
