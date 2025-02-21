import { environment } from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';

import {AuthHttpService} from "./authHttp.service";
import {AuthTokenService} from "./authToken.service";
import {CurrentUserInfo} from "../common/model/currentUserInfo.model";
import {Router} from "@angular/router";
import { BasUser } from '../common/model/basUser.model';

@Injectable()
export class BasUserService {

  constructor(private authHttpService: AuthHttpService,
              private authTokenService: AuthTokenService,
              private router: Router) {
  }

  setUserInfoThenNavigate(currentUserInfo: CurrentUserInfo,url): void {
    console.log(this.authTokenService.getCurrentUserInfo());
    this.router.navigateByUrl(url);
  }

  getUserInfo(areaCode,userId): Observable<BasUser>{
    const url = environment.apiUrl + 'admin-service' + '/user/bas-user/?areaCode=' + areaCode + '&userId='  + userId;
    return this.authHttpService.get(url);
  }
   initRoles(basUser:BasUser,currentUserInfo:CurrentUserInfo){
    currentUserInfo.userName = basUser.用户名;
    currentUserInfo.hosNum = basUser.医院编码;
    currentUserInfo.hosName = basUser.医院名称;
    currentUserInfo.nodeCode = basUser.院区编码;
    currentUserInfo.currentRoles = this.getRoles(basUser);

    currentUserInfo.currentRole = this.getUserType(currentUserInfo.currentRoles, basUser.登陆帐号);

    this.authTokenService.setCurrentUserInfo(currentUserInfo);
   }
   private getRoles(basUser: BasUser): string[] {
    const roles: string[] = [];
    for (let i = 0; i < basUser.角色列表.length; i++) {
      const roleCode = basUser.角色列表[i].角色编码;
      if (roles.indexOf(roleCode) == -1) {
        roles.push(roleCode);
      }
    }
    return roles;
  }

  private getUserType(roles: string[], loginAccount: string): string {
    const showAdminRoles = ['NZYJGLY', 'ADMIN', 'ROOT', 'administrator', 'kyeeEditorAdmin'];
    // 判断用户类型: 区域管理员、医院管理员、普通用户
    if (loginAccount && '000' === loginAccount) {
      return '区域';
    } else if (roles.some(r => showAdminRoles.includes(r))) {
      return '医院';
    }
    return '用户';
  }
}
