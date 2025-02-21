import {NgModule} from '@angular/core';

import {AuthLoginComponent} from './authLogin.component';
import {AuthGuard} from './authGuard.service';
import {AuthHttpService} from './authHttp.service';
import {AuthLoginService} from './authLogin.service';
import {AuthTokenService} from './authToken.service';
import {BasUserService} from './bas-user.service';
import {GrowlModule} from 'primeng/primeng';


@NgModule({
  declarations: [AuthLoginComponent],
  imports: [
    GrowlModule
  ],
  providers: [
    AuthGuard,
    AuthHttpService,
    AuthLoginService,
    AuthTokenService,
    BasUserService
  ],
  exports: [AuthLoginComponent]
})
export class AuthModule {
}
