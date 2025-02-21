import { Message } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import {StorageCacheService} from "portalface/services/index";
import { GrowlMessageService } from '../common/service/growl-message.service';
import { NavToggledService } from '../common/service/nav-toggled.service';

@Component({
  selector: 'kyee-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  showSideBar:boolean=true;
  msgs: Message[];
  navDisplay:boolean = true;
  constructor(private navToggledService: NavToggledService,private  storageCacheService:StorageCacheService, private growlMessageService: GrowlMessageService) { }

  ngOnInit() {
    // let user = this.storageCacheService.localStorageCache.get("user");
    // if(user['userMark']=='1'){
    //   this.showSideBar = false;
    // }else{
    //   this.showSideBar = true;
    // }
    this.navToggledService.getNavDisplaySub().subscribe(navDisplay => {
      this.navDisplay = navDisplay;
    });
    
    this.growlMessageService.getGrowlSubject().subscribe(
      massage => {
        this.msgs = [];
        this.msgs.push(massage);
      }
    );
  }

}
