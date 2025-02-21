
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DatasourceSetComponent } from './datasource-set/datasource-set.component';
import { DatasourceGroupComponent } from './datasource-group/datasource-group.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { DatasourceDictComponent } from './datasource-dict/datasource-dict.component';


@NgModule({
    imports: [
      RouterModule.forChild([
        {
          path: '',
          component: DatasourceSetComponent
        }, {
          path: 'datasource-set',
          component: DatasourceSetComponent
        }, {
          path: 'datasource-group',
          component: DatasourceGroupComponent
        }, {
          path: 'datasource',
          component: DatasourceComponent
        }, {
          path: 'datasource-dict',
          component: DatasourceDictComponent
        }
      ])
    ]
  })
  export class DatasourceManageRoutingModule {}
