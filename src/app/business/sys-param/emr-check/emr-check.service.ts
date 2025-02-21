import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthHttpService } from './../../../basic/auth/authHttp.service';
import { environment } from './../../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { LoadingService } from 'portalface/services';

@Injectable()
export class EmrCheckService {

  private apiUrl = environment.apiUrl;
  private bathPath = environment.apiUrl + 'admin-service/data-sync/';
  private areasInterfacePath = environment.apiUrl + "admin-service/paramsConfig";
  private postHeader: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient,private authHttpService: AuthHttpService, private loadingService: LoadingService) { }

  getCheckHospitals(): Observable<ApiResult>{
    return this.http.get<ApiResult>(this.areasInterfacePath + "/getCheckHospitals");
  }
  getEmrCheck(hosnum,nodecode): Observable<Object>{
    return this.http.get<Object>(this.areasInterfacePath + "/getEmrCheck?医院编码="+hosnum+"&院区编码="+nodecode);
  }
  saveEmrCheck(hosnum,nodecode,data): Observable<Object>{
    return this.http.post<Object>(this.areasInterfacePath + "/saveEmrCheck?医院编码="+hosnum+"&院区编码="+nodecode,data, {
      headers: this.postHeader
    });
  }


}
