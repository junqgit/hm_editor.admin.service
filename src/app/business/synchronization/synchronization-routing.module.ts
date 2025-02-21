import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {InterfaceSynSettingComponent} from "./interface-syn-setting/interface-syn-setting.component";
import {InterfaceSynMonitorComponent} from "./interface-syn-monitor/interface-syn-monitor.component";

@NgModule({
  imports:[
    RouterModule.forChild([
      {path:'',component:InterfaceSynSettingComponent},
      {
        path:'interfaceSynSetting',
        component:InterfaceSynSettingComponent,
      },
      {
        path:'interfaceSynMonitor',
        component:InterfaceSynMonitorComponent
      }
    ])
  ]
})

export class SynchronizationRoutingModule{}
