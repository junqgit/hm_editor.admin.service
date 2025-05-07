
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { FolderComponent } from './folder/folder.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { TemplateComponent } from './template/template.component';
@NgModule({
    imports: [
      RouterModule.forChild([
        {
          path: '',
          component: FolderComponent
        }, {
          path: 'folder',
          component: FolderComponent
        }, {
          path: 'template',
          component: TemplateComponent
        }
      ])
    ]
  })
  export class ConsoleRoutingModule {}
