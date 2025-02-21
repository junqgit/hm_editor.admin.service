import { EmrCheckComponent } from './emr-check/emr-check.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {BusinessParamComponent} from "./business-param/business-param.component";
import { RegionalConfigurationComponent } from './regional-configuration/regional-configuration.component';
import {InterfaceStampConfigurationComponent} from "./interface-stamp-configuration/interface-stamp-configuration.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BusinessParamComponent
      },
      {
        path: 'business-param',
        component: BusinessParamComponent
      },
      {
        path: 'regional-configuration',
        component: RegionalConfigurationComponent,
      },
      {
        path:'interface-stamp-configuration',
        component:InterfaceStampConfigurationComponent
      },
      {
        path:'emr-check',
        component:EmrCheckComponent
      }
    ])
  ]
})
export class SysParamRoutingModule {}
