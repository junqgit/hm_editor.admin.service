
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {RoleManageComponent} from "../role-management/role-manage/role-manage.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RoleManageComponent
      },
      {
        path: 'roleManage',
        component: RoleManageComponent
      }
    ])
  ]
})
export class RoleManagementRoutingModule {}
