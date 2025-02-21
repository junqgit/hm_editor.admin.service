import {Injectable} from '@angular/core';
import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { PublicCommService } from '../../common/service/public-comm.service';
import {Observable} from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable()
export class FormService {
    baseUrl = environment.apiUrl + 'admin-service/Documents/Norm/Config/';
}
