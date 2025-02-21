import { ChildScoreComponent } from './score-standard-query/model/child-score/child-score.component';
import { KyeePipeModule } from './../../basic/common/pipe/kyee-pipe.module';
import { AuthHttpService } from './../../basic/auth/authHttp.service';
import { AuthTokenService } from './../../basic/auth/authToken.service';
import { LoadingService } from 'portalface/services';
import { ScoreService } from './score-service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ScoreQueryComponent } from './score-standard-query/score-query.component';
import { ScoreRoutingModule } from './score-routing.module';
import { FileUploadModule } from 'ng2-file-upload';
import {SysParamService} from "../sys-param/sys-param.service";
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { ScoreComponent } from './score.component';
import { ButtonModule,
   DropdownModule,
    RadioButtonModule,
    DataTableModule,
    DialogModule,
    MenuModule,
    OverlayPanelModule, 
    ListboxModule, 
    InputTextModule, 
    GrowlModule, 
    CalendarModule,
    TreeModule, 
    PaginatorModule, 
    ChipsModule, 
    CheckboxModule, 
    SliderModule, 
    SpinnerModule,MultiSelectModule} from 'primeng/primeng';
import { ScoreConfigComponent } from './score-standard-query/score-config/score-config.component';
import { ScoreConfigNewComponent } from './score-standard-query/score-config-new/score-config-new.component';


@NgModule({
  imports: [
    CommonModule,
    ScoreRoutingModule,
    KyeePipeModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    RadioButtonModule,
    DataTableModule,
    DialogModule,
    MenuModule,
    OverlayPanelModule,
    ListboxModule,
    InputTextModule,
    GrowlModule,
    TreeModule,
    FileUploadModule,
    HttpClientModule,
    CalendarModule,
    PaginatorModule,
    ChipsModule,
    CheckboxModule,
    SliderModule,
    SpinnerModule,
    MultiSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ScoreQueryComponent, ScoreComponent,ChildScoreComponent, ScoreConfigComponent, ScoreConfigNewComponent],
  providers: [LoadingService,AuthHttpService,AuthTokenService,ScoreService,DatePipe,SysParamService]
})
export class ScoreModule { }
