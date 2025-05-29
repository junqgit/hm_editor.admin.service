import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonSidebarComponent } from '../common-sidebar/common-sidebar.component';
import { CommonFooterComponent } from '../common-footer/common-footer.component';
import { CommonFooterService } from '../common-footer/common-footer.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    CommonSidebarComponent,
    CommonFooterComponent
  ],
  exports: [
    CommonSidebarComponent,
    CommonFooterComponent,
    RouterModule
  ],
  providers: [
    CommonFooterService
  ]
})
export class SharedModule { }