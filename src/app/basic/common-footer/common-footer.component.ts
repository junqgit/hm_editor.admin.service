import { Component, OnInit } from '@angular/core';
import {CommonFooterService} from "./common-footer.service";
import {StorageCacheService,RouterService, HttpService} from "portalface/services";
import { NavToggledService } from '../../common/service/nav-toggled.service';

@Component({
  selector: 'kyee-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  moveLength:String;
  imgIdex:boolean = false;
  mouseOverIndex:number;
  navDisplay:boolean = true;
  constructor(
    private navToggledService: NavToggledService,
    private commonFooterService: CommonFooterService,
    private storageCacheService: StorageCacheService,
    private routerService: RouterService,
    private httpService: HttpService) { }

  menus=[];
  selectedIndex=0;

  items=[];

  ngOnInit() {
    this.commonFooterService.footer = this;
    const that = this;
    this.navToggledService.getNavDisplaySub().subscribe(navDisplay => {
      this.navDisplay = navDisplay;
    });
    setTimeout(function () {
      that.loadMenu();
    }, 500);
  }

  loadMenu() {
    let leftMenu = this.storageCacheService.localStorageCache.get('menu');
    let menuData = {};

    // 检查URL是否包含console/folder
    if(location.hash.indexOf('console/folder') > -1) {
      // 如果是模板制作页面，直接设置正确的页签
      menuData['text'] = '模板制作';
      menuData['URL'] = '/main/business/console/folder';
    } else if(location.hash.substr(1).split('/').length-1 < 4 ){
      menuData['text'] = leftMenu[0].items[0].label;
      menuData['URL'] = leftMenu[0].items[0].routerLink;
    } else {
      for(let i=0;i <leftMenu.length;i++){
        if(leftMenu[i].items && leftMenu[i].items.length > 0){
          for(let j=0;j<leftMenu[i].items.length;j++){
            if(leftMenu[i].items[j].routerLink == location.hash.substr(1)){
              menuData['text'] = leftMenu[i].items[j].label;
              menuData['URL'] = leftMenu[i].items[j].routerLink;
            }
          }
        }else if(leftMenu[i].routerLink == location.hash.substr(1)) {
          menuData['text'] = leftMenu[i].label;
          menuData['URL'] = leftMenu[i].routerLink;
        }
      }
    }
    this.menus.push(menuData);
  }

  menuClick(index){
    this.selectedIndex = index;
    this.storageCacheService.localStorageCache.set('selectedStatus', "");
  }

  closeMenu(index){
    this.menus.splice(index, 1);
    if(index==this.selectedIndex){
      if(this.menus.length>0){
        if(!this.menus[this.selectedIndex]){
          this.selectedIndex--;
        }
        this.routerService.gotoPage(this.menus[this.selectedIndex]['URL']);
      }
    }else if(index<this.selectedIndex){
      this.selectedIndex--;
    }
  }
// 通过头部一级菜单，点开二级菜单时首次打开时，可能会由于已经打开的二级菜单过多，页面展示不全，需要移动。
  firstOpenMove(){
    let footerMune = document.querySelector('#footerMenu');
    let commonFooter = document.querySelector('.common-footer');
    let outerWidth = footerMune['offsetWidth'] + 140;
    let visibleWidth = commonFooter['offsetWidth'] - 20 * 2;
    if(outerWidth > visibleWidth){
      let needToMoveWidth = visibleWidth - outerWidth;
      this.moveLength = 'translateX(' + needToMoveWidth  + 'px)';
    }
  }

  //头部已有该菜单，点击时滚动至该菜单处
  clickMove(){
    let currentMenuRight=(this.menus.length-this.selectedIndex)*142;
    let currentMenuLeft=this.selectedIndex*142;
    let footerMune = document.querySelector('#footerMenu');
    let outerWidth = footerMune['offsetWidth'];
    let commonFooter = document.querySelector('.common-footer');
    let visibleWidth = commonFooter['offsetWidth'] - 20 * 2;
    if(currentMenuLeft<visibleWidth){
      this.moveLength = 'translateX(0px)';
    }else if(currentMenuRight>visibleWidth){
      this.moveLength = 'translateX(' + this.selectedIndex*-142  + 'px)';
    }else{
      let needToMoveWidth = visibleWidth - outerWidth;
      this.moveLength = 'translateX(' + needToMoveWidth  + 'px)';
    }
}

  leftMoveMenu(){
    let footerMune = document.querySelector('#footerMenu');
    let commonFooter = document.querySelector('.common-footer');
    let outerWidth = footerMune['offsetWidth'];
    let visibleWidth = commonFooter['offsetWidth'] - 20 * 2;
    if(outerWidth > visibleWidth){
      let needToMoveWidth = visibleWidth - outerWidth;
      this.moveLength = 'translateX(' + needToMoveWidth  + 'px)';
    }
  }

  rightMoveMenu(){
      this.moveLength = 'translateX(0px)';
  }

  mouseOver(index){
    this.mouseOverIndex = index;
  }

  mouseLeave(){
    this.mouseOverIndex = -1;
  }

}
