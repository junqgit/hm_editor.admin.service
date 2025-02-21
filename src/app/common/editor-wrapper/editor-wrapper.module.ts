import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule }    from '@angular/http';
import {TreeModule} from 'primeng/primeng';
import {PaginatorModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {EditorWrapperComponent} from "./editor-wrapper.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    TreeModule,
    PaginatorModule,
    DialogModule
  ],
  exports: [
    EditorWrapperComponent
  ],
  declarations: [EditorWrapperComponent]
})
export class EditorWrapperModules { }
