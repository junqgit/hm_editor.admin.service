import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthHttpService } from '../../basic/auth/authHttp.service';

@Injectable()
export class RedisCacheService {
  private api = environment.apiUrl + 'admin-service/cache/';
  constructor(private authHttpService: AuthHttpService) { 

  }
  getRedisCacheByKey(key: String): Promise<ApiResult>  {
    let url = this.api + 'getRedisCache?key=' + key;
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => {
        return res as ApiResult; 
    })
    .catch(this.handleError.bind(this));
  }

  flushRedisCache(keys: any): Promise<ApiResult>  {
    let url = this.api + 'flushRedisCache';
    return this.authHttpService.post(url, keys)
    .toPromise()
    .then(res => {
        return res as ApiResult;
    })
    .catch(this.handleError.bind(this));
  }

  flushRedisAllCache(): Promise<ApiResult> {
    let url = this.api + 'flushAll';
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => {
        return res as ApiResult;
    })
    .catch(this.handleError.bind(this));
  }

  doPreviewDetail(key: any): Promise<ApiResult> {
    let url = this.api + 'getDetailContent/' + key;
    return this.authHttpService.get(url)
    .toPromise()
    .then(res => {
        return res as ApiResult;
    })
    .catch(this.handleError.bind(this));
  }

  private handleError(error: any): Promise<any> {
      console.error('An error occurred in redis-cache module', error);
      return Promise.reject(error.message || error);
  }
}
