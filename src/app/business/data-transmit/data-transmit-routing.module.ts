import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RetransmitComponent } from './retransmit/retransmit.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'retransmit',
                component: RetransmitComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DataTransmitRoutingModule {}
