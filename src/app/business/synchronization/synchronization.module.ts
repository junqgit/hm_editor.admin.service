import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterfaceSynSettingComponent } from './interface-syn-setting/interface-syn-setting.component';
import {SynchronizationRoutingModule} from "./synchronization-routing.module";
import { InterfaceSynMonitorComponent } from './interface-syn-monitor/interface-syn-monitor.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonWidgetsModule, DatatableWidgetModule, FormWidgetsModule, MenuWidgetsModule, TreeWidgetModule} from 'portalface/widgets';
import { SynchronizationService } from './synchronization.service';
import {SynchronizationComponent} from "./synchronization.component";
import {SysParamService} from "../sys-param/sys-param.service";

@NgModule({
  imports: [
    CommonModule,
    SynchronizationRoutingModule,
    HttpClientModule,
    DatatableWidgetModule,
    CommonWidgetsModule,
    FormWidgetsModule,
    MenuWidgetsModule,
    TreeWidgetModule
  ],
  declarations: [InterfaceSynSettingComponent, InterfaceSynMonitorComponent, SynchronizationComponent],
  providers: [SynchronizationService,SysParamService]
})
export class SynchronizationModule { }
