import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScoreQueryComponent } from './score-standard-query/score-query.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'scoreQueryComponent',
                component: ScoreQueryComponent
            }
        ])
    ]
})
export class ScoreRoutingModule {}