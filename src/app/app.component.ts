import { BasUserService } from './basic/auth/bas-user.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StorageCacheService } from 'portalface/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss',
        './styles/common.scss'
        ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    constructor(
        private basUserService:BasUserService,
        private router:Router,
        private storageCacheService:StorageCacheService
    ) { }

    ngOnInit() {
        let urlParams = this.storageCacheService.sessionStorageCache.get('urlParams');
        if (!urlParams) {
            urlParams = {};
            urlParams['areaCode'] = this.GetQueryString('areaCode');
            urlParams['userId'] = this.GetQueryString('userId');
            urlParams['adminRole']=this.GetQueryString('adminRole');
            urlParams['loginAccount'] = this.GetQueryString('loginAccount');
            this.storageCacheService.sessionStorageCache.set('urlParams',urlParams);
        }
        this.router.navigate(['/login']);
      }

      GetQueryString(name) {
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        if(location.href.split('?')[1]){
            let r = location.href.split('?')[1].match(reg);
            if(r!=null){
                return r[2];
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}
