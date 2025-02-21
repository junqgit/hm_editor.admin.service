import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AuthTokenService } from './../auth/authToken.service';
import { NavToggledService } from '../../common/service/nav-toggled.service';
@Component({
  selector: 'kyee-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navDisplay:boolean = true;
  hospitalName: string = '';
  constructor(
    private navToggledService: NavToggledService,
    private authTokenService:AuthTokenService,
    private changeDetectorRef:ChangeDetectorRef,
  ) { }

  ngOnInit(){
    let currentUserInfo = JSON.parse(this.authTokenService.getCurrentUserInfo());
    if (currentUserInfo['currentRole'] !== '区域') {
      this.hospitalName=currentUserInfo['hosName'];
    }
    console.log("+++++")
  }

  toggleNavOnclick() {
    this.navDisplay = !this.navDisplay;
    this.navToggledService.changeNavDisplay(this.navDisplay);
    this.changeDetectorRef.detectChanges();
  }

}
