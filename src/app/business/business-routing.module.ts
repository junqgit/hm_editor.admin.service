import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BusinessComponent } from './business.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component : BusinessComponent,
                children: [
                    {path: '', redirectTo: 'template', pathMatch: 'full' },
                    // {path:'score',loadChildren:'./score/score.module#ScoreModule'},
                    // {path:'synchronization',loadChildren:'./synchronization/synchronization.module#SynchronizationModule'},
                    // {path:'sys-param',loadChildren:'./sys-param/sys-param.module#SysParamModule'},
                    // {path:'authorization',loadChildren:'./authorization/authorization.module#AuthorizationModule'},
                    // {path:'role-management',loadChildren:'./role-management/role-management.module#RoleManagementModule'},
                    {path:'console',loadChildren:'./console/console.module#ConsoleModule'},
                    // {path:'form', loadChildren: './form/form.module#FormModule'},
                    // {path:'redis-cache', loadChildren: './redis-cache/redis-cache.module#RedisCacheModule'},
                    {path:'datasource',loadChildren:'./datasource-manage/datasource-manage.module#DatasourceManageModule'},
                    // {path:'data-transmit',loadChildren:'./data-transmit/data-transmit.module#DataTransmitModule'},
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BusinessRoutingModule {}
