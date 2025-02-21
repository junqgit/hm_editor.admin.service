import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RedisCacheManageComponent } from './redis-cache-manage/redis-cache-manage.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RedisCacheManageComponent
      },
      {
        path: 'redis-cache-manage',
        component: RedisCacheManageComponent
      }
    ])
  ]
})
export class RedisCacheRoutingModule {}