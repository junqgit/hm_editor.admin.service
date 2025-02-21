import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { AuthTokenService } from '../../basic/auth/authToken.service';
import { SysParamService } from '../sys-param/sys-param.service';
import { WidgetsModule } from 'portalface/widgets';
import { HttpClientModule } from '@angular/common/http';
import { DataTransmitRoutingModule } from './data-transmit-routing.module';
import { DataTransmitService } from './data-transmit.service';
import { RetransmitComponent } from './retransmit/retransmit.component';
@NgModule({
  imports: [
    CommonModule,
    WidgetsModule,
    HttpClientModule,
    DataTransmitRoutingModule
  ],
  declarations: [
    RetransmitComponent
  ],
  providers: [AuthHttpService, AuthTokenService, SysParamService,DataTransmitService,DatePipe]
})
export class DataTransmitModule { }
