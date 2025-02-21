import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedisCacheManageComponent } from './redis-cache-manage/redis-cache-manage.component';
import { RedisCacheRoutingModule } from './redis-cache-routing.module';
import { CommonWidgetsModule, DatatableWidgetModule, FormWidgetsModule } from 'portalface/widgets';
import { RedisCacheService } from './redis-cache.service';

@NgModule({
  imports: [
    CommonModule,
    DatatableWidgetModule,
    FormWidgetsModule,
    CommonWidgetsModule,
    RedisCacheRoutingModule
  ],
  declarations: [RedisCacheManageComponent],
  providers:[RedisCacheService]
})
export class RedisCacheModule { }
