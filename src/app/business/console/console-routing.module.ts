
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { FolderComponent } from './folder/folder.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { TemplateComponent } from './template/template.component';
import { TemplateUpdateComponent } from './templateUpdate/templateUpdate.component';
import { CollectedTemplateReplaceComponent } from './collectedTemplateReplace/collectedTemplateReplace.component';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
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
          path: 'template-editor',
          component: TemplateEditorComponent
        }, {
          path: 'template',
          component: TemplateComponent
        }, {
          path: 'templateUpdate',
          component: TemplateUpdateComponent
        },{
          path: 'collectedTemplateReplace',
          component: CollectedTemplateReplaceComponent
        }
      ])
    ]
  })
  export class ConsoleRoutingModule {}
