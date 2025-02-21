// import { RoleManageService } from './role-manage/role-manage-service';
import { AuthorizationRoutingModule } from './authorization-routing.module';
// import { RoleManageComponent } from './role-manage/role-manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManageComponent } from './user-manage/user-manage.component';
import { PasswordModule, ButtonModule, DropdownModule, DataTableModule, DialogModule, InputTextModule, GrowlModule, PaginatorModule,TreeModule,MultiSelectModule } from 'primeng/primeng';
import { AuthorizationComponent } from './authorization.component';
import {SysParamService} from "../sys-param/sys-param.service";
import {HttpClientModule} from "@angular/common/http";
import { FileUploadModule } from 'ng2-file-upload';
import {RoleManageService} from "../role-management/role-manage/role-manage-service";
import { AppManageComponent } from './app-manage/app-manage.component';
import { AppManageService } from './app-manage/app-manage-service';
import { InputSwitchModule } from 'portalface/widgets/form-widgets/inputswitch/inputswitch';
@NgModule({
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    ButtonModule,
    DropdownModule,
    DataTableModule,
    DialogModule,
    InputTextModule,
    GrowlModule,
    PaginatorModule,
    TreeModule,
    MultiSelectModule,
    // FormWidgetsModule,
    FileUploadModule,
    HttpClientModule,
    InputSwitchModule,
    PasswordModule
  ],
  declarations: [
    // RoleManageComponent,
    UserManageComponent,
    AuthorizationComponent,
    AppManageComponent
  ],
  providers: [
    AppManageService,
    RoleManageService,
    SysParamService]
})
export class AuthorizationModule { }
