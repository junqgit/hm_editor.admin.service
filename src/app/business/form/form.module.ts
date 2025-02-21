import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormConfigComponent } from './form-config/form-config.component';
import { AuthHttpService } from '../../basic/auth/authHttp.service';
import { AuthTokenService } from '../../basic/auth/authToken.service';
import { SysParamService } from '../sys-param/sys-param.service';
import { WidgetsModule } from 'portalface/widgets';
// import { FormComponent } from './form.component';
import { FormRoutingModule } from './form-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormCustomConfigComponent } from './form-custom-config/form-custom-config.component';
import { ValidateModule } from './validate/validate.module';
import { SignsRuleConfigComponent } from './signs-rule-config/signs-rule-config.component';
import { EvaConfigComponent } from './eva-config/eva-config.component';
import { EvaFormConfigComponent } from './eva-config/eva-form-config/eva-form-config.component';
import { EvaDetailConfigComponent } from './eva-config/eva-detail-config/eva-detail-config.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TreeTableModule } from 'portalface/widgets/treetable-widget/treetable/treetable';
import { EmrSyncConfigComponent } from './emr-sync-config/emr-sync-config.component';
import { ReportConfigComponent } from './report-config/report-config.component';
import { SyncConfigServices } from './emr-sync-config/sync-config.services';
import { ColMapperComponent } from './emr-sync-config/col-mapper/col-mapper.component';
import { DiagMapperComponent } from './emr-sync-config/diag-mapper/diag-mapper.component';
import { ValueMapperComponent } from './emr-sync-config/value-mapper/value-mapper.component';
import { OrderMapperComponent } from './emr-sync-config/order-mapper/order-mapper.component';
import { DictionaryComponent } from './report-config/dictionary/dictionary.component';
import { EmrReportService } from './report-config/report-config.services';
import { AllDatatsourceDpModule } from '../all-datatsource-dp/all-datatsource-dp.component';

@NgModule({
  imports: [
    CommonModule,
    WidgetsModule,
    FormRoutingModule,
    HttpClientModule,
    ValidateModule,
    FileUploadModule,
    TreeTableModule,
    AllDatatsourceDpModule
  ],
  declarations: [
    FormConfigComponent,
    FormCustomConfigComponent,
    SignsRuleConfigComponent,
    EvaConfigComponent,
    EvaFormConfigComponent,
    EvaDetailConfigComponent,
    EmrSyncConfigComponent,
    ColMapperComponent,
    DiagMapperComponent,
    ValueMapperComponent,
    OrderMapperComponent,
    ReportConfigComponent,
    DictionaryComponent
    // FormComponent
  ],
  providers: [AuthHttpService, AuthTokenService, SysParamService,SyncConfigServices,EmrReportService]
})
export class FormModule { }
