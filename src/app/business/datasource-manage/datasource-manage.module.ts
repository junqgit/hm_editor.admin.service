
import { HttpClientModule } from '@angular/common/http';



import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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

import { FileUploadModule } from 'portalface/widgets/form-widgets/fileupload/fileupload';

import { FormWidgetsModule } from 'portalface/widgets';
import { BreadcrumbModule, GrowlModule } from 'primeng/primeng';
import { EditorWrapperModules } from '../../common/editor-wrapper/editor-wrapper.module';
import { LoadingService } from './../../common/service/loading.service';
import { DatasourceSetComponent } from './datasource-set/datasource-set.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { DatasourceManageRoutingModule } from './datasource-manage-routing.module';
import { DatasourceDictComponent } from './datasource-dict/datasource-dict.component';
import { DatasourceManageService } from './datasource-manage.service';
import { AllDatatsourceDpModule } from '../all-datatsource-dp/all-datatsource-dp.component';




@NgModule({
  imports: [
    CommonModule,DatasourceManageRoutingModule,TreeModule,
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
    AllDatatsourceDpModule
  ],
  declarations: [DatasourceDictComponent, DatasourceSetComponent, DatasourceComponent],
  providers:[LoadingService,DatasourceManageService,DatePipe]
})
export class DatasourceManageModule { }
