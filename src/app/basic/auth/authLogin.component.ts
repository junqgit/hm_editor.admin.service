import { StorageCacheService } from 'portalface/services';
import { Component, OnInit } from '@angular/core';
import { AuthLoginService  } from './authLogin.service';
import {CurrentUserInfo} from "../common/model/currentUserInfo.model";
import {CurrentSystemParam} from "../common/model/currentSystemParam";

@Component({
	selector   : 'authLogin',
	templateUrl: './authLogin.html',
  styleUrls  : [ './authLogin.scss'],
})

export class AuthLoginComponent implements OnInit {

    constructor(
      private authLoginService : AuthLoginService,
      private storageCacheService:StorageCacheService
      ) { }

    ngOnInit() {
      let urlParams = this.storageCacheService.sessionStorageCache.get('urlParams');
      let currentUserInfo:CurrentUserInfo = new CurrentUserInfo();
      if (!urlParams || !urlParams['areaCode'] || !urlParams['userId'] 
        || !urlParams['loginAccount'] || urlParams['loginAccount'] != '000') {
        this.authLoginService.doLogout();
      } else {
        //必选参数
        currentUserInfo.areaCode = urlParams['areaCode'];
        currentUserInfo.userId = urlParams['userId'];
        let currentSystemParam: CurrentSystemParam = new CurrentSystemParam();
        this.authLoginService.doLogin(currentUserInfo, currentSystemParam);
      }
    }
}
