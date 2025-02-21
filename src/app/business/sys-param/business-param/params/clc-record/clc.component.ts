import { Component, OnInit, Input } from '@angular/core';
import { SysParamService } from "../../../sys-param.service";

@Component({
    selector: 'clc-record-params',
    templateUrl: './clc-record.component.html',
    styleUrls: ['../../business-param.component.scss'],
    providers: [SysParamService]
})
export class ClcRecordParamsComponent implements OnInit {
    @Input() _showOtherProperty;
    @Input() saveHospitalParams;
    @Input() selectParamType;
    @Input() paramBean;

    ngOnInit(): void {

    }

    showOtherProperty(type, model) {
        return this._showOtherProperty(type, model);
    }
} 