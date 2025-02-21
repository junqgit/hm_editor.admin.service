import { SysParamService } from './../sys-param/sys-param.service';

import { HttpClientModule } from '@angular/common/http';


import { FolderService } from './folder.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderComponent } from './folder/folder.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { TemplateComponent } from './template/template.component';
import { ConsoleRoutingModule } from './console-routing.module';
import { TreeModule } from 'portalface/widgets/tree-widget/tree/tree';
import { DropdownModule } from 'portalface/widgets/form-widgets/dropdown/dropdown';
import { PaginatorModule } from 'portalface/widgets/commons/paginator/paginator';
import { RadioButton, RadioButtonModule } from 'portalface/widgets/form-widgets/radiobutton/radiobutton';
import { ButtonModule } from 'portalface/widgets/common-widgets/button/button';
import { TableModule } from 'portalface/widgets/datatable-widget/table/table';
import { DialogModule } from 'portalface/widgets/common-widgets/dialog/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'portalface/widgets/form-widgets/inputtext/inputtext';
import { DataTableModule } from 'portalface/widgets/datatable-widget/datatable/datatable';
import { DataSourceService } from './data-source.service';
import { FileUploadModule } from 'portalface/widgets/form-widgets/fileupload/fileupload';
import { TemplateService } from './template.service';
import { FormWidgetsModule } from 'portalface/widgets';
import { BreadcrumbModule, GrowlModule, OverlayPanelModule } from 'primeng/primeng';
import { EditorWrapperModules } from '../../common/editor-wrapper/editor-wrapper.module';
import { LoadingService } from './../../common/service/loading.service';
import { TemplateUpdateComponent } from './templateUpdate/templateUpdate.component';
import { TemplateUpdateService } from './templateUpdate.service';
import { CollectedTemplateReplaceComponent } from './collectedTemplateReplace/collectedTemplateReplace.component';
import { CollectedTemplateReplaceService } from './collectedTemplateReplace.service';
import { ReplaceTemplateDataSourceService } from './replaceTemplateDataSource.service';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { KyeePipeModule } from '../../basic/common/pipe/kyee-pipe.module';



@NgModule({
  imports: [
    CommonModule,ConsoleRoutingModule,TreeModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
	  GrowlModule,
    DialogModule,
    InputTextModule,
    DataTableModule,
    DropdownModule,
    PaginatorModule,
    RadioButtonModule,
    FileUploadModule,
    HttpClientModule,
    FormWidgetsModule,
    BreadcrumbModule,
    EditorWrapperModules,
    OverlayPanelModule,
    KyeePipeModule
  ],
  declarations: [FolderComponent, DatasourceComponent, TemplateComponent,TemplateUpdateComponent,CollectedTemplateReplaceComponent, TemplateEditorComponent],
  providers:[FolderService,DataSourceService,TemplateService,LoadingService,TemplateUpdateService,CollectedTemplateReplaceService,ReplaceTemplateDataSourceService,SysParamService]
})
export class ConsoleModule { }
