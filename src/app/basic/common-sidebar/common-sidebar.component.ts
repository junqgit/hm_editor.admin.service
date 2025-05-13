import { Component, OnInit } from '@angular/core';
import {MenuItem} from "portalface/widgets/commons/menuitem";
import {RouterService, StorageCacheService} from "portalface/services";
import {CommonFooterService} from "../common-footer/common-footer.service";
import { NavToggledService } from '../../common/service/nav-toggled.service';
@Component({
  selector: 'kyee-common-sidebar',
  templateUrl: './common-sidebar.component.html',
  styleUrls: ['./common-sidebar.component.scss']
})

export class CommonSidebarComponent implements OnInit {

  items:MenuItem[];
  navDisplay:boolean = true;
  activeLink:string = '';
  menuPopup:any = {
    top:0,
    label: '',
    popupDisplay: false
};
  constructor(
    private navToggledService: NavToggledService,
    private storageCacheService:StorageCacheService,
    private routerService:RouterService,
    private commonFooterService:CommonFooterService
  ) { }

  ngOnInit() {
    this.items = [
      {
        "label":"数据元管理",
        "icon": "icon iconfont icon-edit1",
        "url": "",
        "routerLink": "",
        "expanded": false,
        "visible": true,
        "items": [
          {
            "label":"数据集",
            "icon":"",
            "routerLink":"/main/business/datasource/datasource-set",
            "expanded": false,
            "visible": true
          },{
            "label":"数据元",
            "icon":"",
            "routerLink":"/main/business/datasource/datasource",
            "expanded": false,
            "visible": true
          },{
            "label":"字典值域",
            "icon":"",
            "routerLink":"/main/business/datasource/datasource-dict",
            "expanded": false,
            "visible": true
          },{
            "label":"动态值域",
            "icon":"",
            "routerLink":"/main/business/datasource/dynamic-dict",
            "expanded": false,
            "visible": true
          }
        ]
      },
      {
        "label":"模板管理",
        "icon": "fa-folder",
        "url": "",
        "routerLink": "",
        "expanded": true,
        "visible": true,
        "items": [
          {
            "label":"模板目录",
            "icon":"",
            "routerLink":"/main/business/console/folder",
            "expanded": false,
            "visible": true
          },
          {
            "label":"模板制作",
            "icon":"",
            "routerLink":"/main/business/console/template",
            "expanded": false,
            "visible": true
          }
        ]
      }
    ];
    this.navToggledService.getNavDisplaySub().subscribe(navDisplay => {
      this.navDisplay = navDisplay;
      this.menuPopup.popupDisplay = false;
    });
    //let currentUserInfo = JSON.parse(this.authTokenService.getCurrentUserInfo());
    let urlParams = this.storageCacheService.sessionStorageCache.get('urlParams');
    let expandedIndex = null;
    // if(urlParams.adminRole){
    //   urlParams.adminRole = decodeURIComponent(urlParams.adminRole);
    //   let count=0;
    //  for (let i=0;i< this.items.length; i++){
    //    if(urlParams.adminRole.indexOf(this.items[i].label) != -1 ){
    //      count++;
    //      if(count==1){
    //        //this.basUserService.setUserInfoThenNavigate(currentUserInfo,this.items[i].items[0].routerLink);
    //        this.activeLink = this.items[i].items[0].routerLink;
    //        this.items[i].expanded = true;
    //        expandedIndex = i;
    //      }

    //    }else{
    //      this.items[i].visible =false;
    //    }
    //  }
    // }
    //f(currentUserInfo && currentUserInfo.currentRole != '区域'){
      //this.items[0].visible = false;// 医院管理员，隐藏掉模板导入功能，add by zhanyulan（YLYEMR-894）
      //this.items[1].visible =false;
      //this.items[2].items[0].visible =false;
     // this.items[2].items[1].visible =false;
    //}
    if(expandedIndex !== null){
      this.setItemActive(expandedIndex,0,undefined);
    }else{
      // 不默认选中任何菜单项
      // this.setItemActive(3,0,undefined);
    }
    this.storageCacheService.localStorageCache.set('menu',this.items);
  }

  menuItemClickHandler(event, menuitem) {
    if(!this.navDisplay) {
        const top=event.target.getBoundingClientRect().top;
        this.menuPopup.top=top-90;
        if(this.menuPopup.label != menuitem.label) {
            this.menuPopup.popupDisplay = true;
        } else {
            this.menuPopup.popupDisplay = !this.menuPopup.popupDisplay;
        }

        this.menuPopup.label = menuitem.label;
    }
}

  handleClick(event, item, index, childIndex, grandchildIndex) {

    // 如果该选项被禁止、则return
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    // 修改折叠、展开状态
    if (item && item.items && item.items.length > 0) {
      item.expanded = !item.expanded;
    }
    // 确保一级标签只有一个是展开状态
    for (let i = 0; i < this.items.length; i++) {
      if (i !== index) {
        this.items[i].expanded = false;
      }
    }
    if(!this.navDisplay){
      this.menuItemClickHandler(event,item);
    }
    // 处理点击跳转事件
    if (!item.url) {
      event.preventDefault();
    } else {
      this.setItemActive(index, childIndex, grandchildIndex);
    }
    if (!item.routerLink) {
      event.preventDefault();
    } else {
      this.storageCacheService.localStorageCache.set('item',item);
      this.storageCacheService.localStorageCache.set('index',index);
      this.storageCacheService.localStorageCache.set('childIndex',childIndex);
      this.storageCacheService.localStorageCache.set('grandchildIndex',grandchildIndex);
      this.setItemActive(index, childIndex, grandchildIndex);
      let menuData = {};
      menuData['text'] = item.label;
      menuData['URL'] = item.routerLink;

      let menus = this.commonFooterService.footer.menus;
      let isExist = false;
      for(let i=0;i<menus.length;i++){
        let menu = menus[i];
        if(menu['URL']==menuData['URL']){
          isExist = true;
          this.commonFooterService.footer.selectedIndex = i;
        }
      }
      if(!isExist){
        menus.push(menuData);
        this.commonFooterService.footer.selectedIndex = menus.length-1;
        this.commonFooterService.footer.firstOpenMove();
      }else{
        this.commonFooterService.footer.clickMove();
      }
      this.activeLink = item.routerLink;
      this.routerService.gotoPage(item.routerLink);//页面跳转
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item
      });
    }
  }

  /**
   *
   * @param index 一级菜单下标
   * @param childIndex 二级菜单下标
   * @param grandchildIndex 三级菜单下标
   */
  public setItemActive(index, childIndex, grandchildIndex) {
    // 确保一级标签只有一个是展开状态
    for (let i = 0; i < this.items.length; i++) {
      if (i !== index) {
        this.items[i].expanded = false;
      }
    }
  }

}
