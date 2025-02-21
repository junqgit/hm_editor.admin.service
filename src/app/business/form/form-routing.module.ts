import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormConfigComponent } from './form-config/form-config.component';
import { FormCustomConfigComponent } from './form-custom-config/form-custom-config.component';
import { SignsRuleConfigComponent } from './signs-rule-config/signs-rule-config.component';
import { EvaConfigComponent } from './eva-config/eva-config.component';
import { EmrSyncConfigComponent } from './emr-sync-config/emr-sync-config.component';
import {ReportConfigComponent} from './report-config/report-config.component'
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'formConfig',
                component: FormConfigComponent
            }, {
                path: 'form-custom-config',
                component: FormCustomConfigComponent
            }, {
                path: 'signs-rule-config',
                component: SignsRuleConfigComponent
            }, {
                path: 'eva-config',
                component: EvaConfigComponent
            }, {
                path: 'emr-sync-config',
                component: EmrSyncConfigComponent
            },{
                path: 'report-config',
                component: ReportConfigComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FormRoutingModule {}
