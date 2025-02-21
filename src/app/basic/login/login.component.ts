import { Component, OnInit } from '@angular/core';
import {Message} from "portalface/widgets/commons/message";
@Component({
  selector: 'kyee-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  msgs: Message[] = [];
  constructor() { }

  ngOnInit() {
    this.msgs = [];
    this.msgs.push({severity:'info', summary:'Info Message', detail:'PrimeNG rocks'});
  }


  onClick() {
    this.msgs = [];
    this.msgs.push({severity:'info', summary:'Info Message', detail:'EMR院内后台管理系统'});

  }
}
