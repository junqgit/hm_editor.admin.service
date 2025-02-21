import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestOptions,URLSearchParams,RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthTokenService} from './authToken.service';
import { StorageCacheService } from 'portalface/services';


@Injectable()
export class AuthHttpService {

    constructor(
        private http: Http,
        private router:Router,
        private authTokenService:AuthTokenService,
        private storageCacheService:StorageCacheService
    ) {}

    appendAuthHeader(isLogin: boolean = false):Headers {
        let headers = new Headers({'Content-Type': 'application/json'});
        let token = this.authTokenService.getJwtToken();
        if (token !==null && !isLogin) {
            headers.append("Authorization", this.authTokenService.createAuthorizationTokenHeader());
        }
        let urlParams = this.storageCacheService.sessionStorageCache.get('urlParams');
        let currentUserInfo = JSON.parse(this.authTokenService.getCurrentUserInfo()) || {};
        if (urlParams) {
          headers.append("loginUser", encodeURIComponent(JSON.stringify(urlParams)));
        }
        if (currentUserInfo !== null && token !==null && !isLogin) {
            headers.append("currentUserInfo", encodeURIComponent(JSON.stringify(currentUserInfo)));
        }
        return headers;
    }


    getRequestOptions(requestMethod, url:string, urlParam?:URLSearchParams, body?:Object, isLogin: boolean = false):RequestOptions {
        let options = new RequestOptions({
            headers: this.appendAuthHeader(isLogin),
            method : requestMethod,
            url  : url
        });
        if (urlParam){
            options = options.merge({ params: urlParam});
        }
        if (body){
            options = options.merge({body: JSON.stringify(body)});
        }
        return options;
    }

    get(url:string, urlParams?:URLSearchParams):Observable<any>{
        let me = this;
        let requestOptions = this.getRequestOptions(RequestMethod.Get, url, urlParams);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch(function(error:any){
                if (error.status === 401 || error.status === 403){
                    me.router.navigate(['/login']);
                }
            return Observable.throw(error || 'Server error')
        });
    }

    post(url:string, body:Object, isLogin: boolean = false):Observable<any>{
        let me = this;
        let requestOptions = this.getRequestOptions(RequestMethod.Post, url, undefined, body, isLogin);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch(function(error:any){
                if (error.status === 401){
                    me.router.navigate(['/login']);
                }
            return Observable.throw(error || 'Server error')
        });
    }

    put(url:string, body:Object):Observable<any>{
        let me = this;
        let requestOptions = this.getRequestOptions(RequestMethod.Put, url, undefined, body);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch(function(error:any){
                if (error.status === 401){
                    me.router.navigate(['/login']);
                }
            return Observable.throw(error || 'Server error')
        });
    }

    delete(url:string):Observable<any>{
        let me = this;
        let requestOptions = this.getRequestOptions(RequestMethod.Delete, url);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch(function(error:any){  
                if (error.status === 401){
                    me.router.navigate(['/login']);
                }
            return Observable.throw(error || 'Server error')
        });
    }

}
