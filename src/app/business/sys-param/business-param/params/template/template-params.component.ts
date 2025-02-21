import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'template-params',
  templateUrl: './template-params.component.html',
  styleUrls: ['../../business-param.component.scss'],
})
export class TemplateParamsComponent implements OnInit {
  @Input() _showOtherProperty;
  @Input() _showOptionsLabel;
  @Input() saveHospitalParams;
  @Input() paramBean;
  @Input() selectParamType;
  csList:any[] =[] ;
  ksList:any[] = [];//记录ksList
  ngOnInit(): void {

  }

  showOtherProperty(type, model) {
    return this._showOtherProperty(type, model);
  }

  showOptionsLabel(list, value) {
    return this._showOptionsLabel(list, value);
  }

  addLsList(type, data) {
    if (type == 'kscs') {
      data.push({
        'key': '',
        'value': ''
      });
    }
  }

  removeKsList(data, index, type) {
    data.splice(index, 1);
  }

  change(item) {
    if (item.value) {
      this.ksList.forEach(e => {
        console.log(item.value)
        for (var i = 0; i < item.value.length; i++) {
          if (item.value[i] == e.value) {
            e.disabled = false;
          }
        }
      })
    }
  }
} 