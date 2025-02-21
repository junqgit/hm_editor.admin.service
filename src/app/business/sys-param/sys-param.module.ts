import { EmrCheckService } from './emr-check/emr-check.service';
import { NgModule } from '@angular/core';
import {WidgetsModule} from "portalface/widgets";
import { CommonModule } from '@angular/common';
import { SysParamComponent } from './sys-param.component';
import {SysParamRoutingModule} from "./sys-param-routing.module";
import {BusinessParamComponent} from "./business-param/business-param.component";
import {SysParamService} from "./sys-param.service";
import {HttpClientModule} from "@angular/common/http";
import { RegionalConfigurationComponent } from './regional-configuration/regional-configuration.component';
import { InterfaceStampConfigurationComponent } from './interface-stamp-configuration/interface-stamp-configuration.component';
import { EmrCheckComponent } from './emr-check/emr-check.component';
import { ButtonModule, ToggleButtonModule,ColorPickerModule } from 'primeng/primeng';
import { BorrowParamsComponent } from './business-param/params/borrow/borrow.component';
import { PDAParamsComponent } from './business-param/params/pda/pda.coomponent';
import { NursingParamsComponent } from './business-param/params/nursing/nursing.component';
import { RecordManageParamsComponent } from './business-param/params/record-manage/record-manage.component';
import { RecordParamsComponent } from './business-param/params/record/record.component';
import { RecordSearchParamsComponent } from './business-param/params/record-search/record-search.component';
import { QualityParamsComponent } from './business-param/params/quality/quality.component';
import { SystemParamsComponent } from './business-param/params/system/system.component';
import { TemperatureParamsComponent } from './business-param/params/temperature/temperature.component';
import { TemplateParamsComponent } from './business-param/params/template/template-params.component';
import { AllDatatsourceDpModule } from '../all-datatsource-dp/all-datatsource-dp.component';
import { fulltextRetrievalParamsComponent } from './business-param/params/fulltextRetrieval/fulltextRetrieval.component';
import { ClcRecordParamsComponent } from './business-param/params/clc-record/clc.component';
import { TemplateService } from '../console/template.service';
@NgModule({
  imports: [
    CommonModule,
    SysParamRoutingModule,
    WidgetsModule,
    HttpClientModule,
    ToggleButtonModule,
    AllDatatsourceDpModule,
    ColorPickerModule
  ],
  declarations: [
    BusinessParamComponent, 
    SysParamComponent,
    RegionalConfigurationComponent, 
    InterfaceStampConfigurationComponent, 
    EmrCheckComponent, 
    BorrowParamsComponent,
    PDAParamsComponent,
    NursingParamsComponent,
    RecordManageParamsComponent,
    RecordParamsComponent,
    RecordSearchParamsComponent,
    QualityParamsComponent,
    SystemParamsComponent,
    TemperatureParamsComponent,
    TemplateParamsComponent,
    fulltextRetrievalParamsComponent,
    ClcRecordParamsComponent
  ],
  providers:[SysParamService,EmrCheckService,TemplateService]
})
export class SysParamModule { }
