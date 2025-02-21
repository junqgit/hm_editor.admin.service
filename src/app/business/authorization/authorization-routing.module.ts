// import { RoleManageComponent } from './role-manage/role-manage.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import {RoleManageComponent} from "../role-management/role-manage/role-manage.component";
import { AppManageComponent } from './app-manage/app-manage.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: UserManageComponent
            },
            {
                path: 'userManage',
                component: UserManageComponent
            },
            {
                path:'appManage',
                component: AppManageComponent
            }
            // {
            //     path: 'roleManage',
            //     component: RoleManageComponent
            // }
        ])
    ]
})
export class AuthorizationRoutingModule {}
