

import {NgModule} from "@angular/core";
import {RoleManageService} from "./role-manage/role-manage-service";
import {SysParamService} from "../sys-param/sys-param.service";
import {RoleManageComponent} from "./role-manage/role-manage.component";
import {RoleManagementComponent} from "./role-management.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {TreeWidgetModule, MenuWidgetsModule, FormWidgetsModule, DatatableWidgetModule,CommonWidgetsModule} from "portalface/widgets";
import {RoleManagementRoutingModule} from "./role-management-routing.module";

@NgModule({
  imports: [

    CommonModule,
    MenuWidgetsModule,
    TreeWidgetModule,
    DatatableWidgetModule,
    FormWidgetsModule,
    CommonWidgetsModule,
    HttpClientModule,
    RoleManagementRoutingModule
  ],
  declarations: [
    RoleManageComponent,
    RoleManagementComponent
  ],
  providers: [
    RoleManageService,
    SysParamService]
})
export class RoleManagementModule  { }
