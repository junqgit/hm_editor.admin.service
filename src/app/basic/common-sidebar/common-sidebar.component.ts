import { AuthTokenService } from './../auth/authToken.service';
import { Component, OnInit } from '@angular/core';
import {MenuItem} from "portalface/widgets/commons/menuitem";
import {RouterService, StorageCacheService} from "portalface/services";
import {CommonFooterService} from "../common-footer/common-footer.service";
import {BasUserService} from "../auth/bas-user.service";
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
    private authTokenService:AuthTokenService,
    private commonFooterService:CommonFooterService,
    private basUserService: BasUserService
  ) { }

  ngOnInit() {
    this.items = [
       {
        "label":"定时管理",
        "icon":"icon iconfont icon-synchronize",
        "url":"",
        "routerLink":"",
        "expanded":false,
        "visible": true,
        "items":[
          {
            "label":"定时器设置",
            "icon":"",
            "routerLink":"/main/business/synchronization/interfaceSynSetting",
            "expanded": false,
            "visible": true
          },
          {
            "label":"定时器监控",
            "icon":"",
            "routerLink":"/main/business/synchronization/interfaceSynMonitor",
            "expanded": false,
            "visible": true
          }
        ]
      },{
        "label":"系统参数",
        "icon":"icon iconfont icon-borrow",
        "url":"",
        "routerLink":"",
        "expanded":false,
        "visible": true,
        "items":[
          // {
          //   "label":"定时器标识设置",
          //   "icon":"",
          //   "routerLink":"/main/business/sys-param/interface-stamp-configuration",
          //   "expanded": false,
          //   "visible": true
          // },
          // {
          //   "label":"区域配置",
          //   "icon":"",
          //   "routerLink":"/main/business/sys-param/regional-configuration",
          //   "expanded": false,
          //   "visible": true
          // },
          {
            "label":"业务参数",
            "icon":"",
            "routerLink":"/main/business/sys-param/business-param",
            "expanded": false,
            "visible": true
          }
        ]
      },
      {
        "label":"权限管理",
        "icon":"icon iconfont icon-purview-setting",
        "url":"",
        "routerLink":"",
        "expanded":true,
        "visible": true,
        "items":[
          {
            "label":"用户管理",
            "icon":"",
            "routerLink":"/main/business/authorization/userManage",
            "expanded": true,
            "visible": true
          },
          {
            "label":"角色管理",
            "icon":"",
            "routerLink":"/main/business/role-management/roleManage",
            "expanded": false,
            "visible": true
          },
          {
            "label":"应用授权",
            "icon":"",
            "routerLink":"/main/business/authorization/appManage",
            "expanded": false,
            "visible": true
          }
        ]
      },
      // {
      //   "label":"质控规则配置",
      //   "icon": "icon iconfont icon-edit1",
      //   "url": "",
      //   "routerLink": "",
      //   "expanded": false,
      //   "visible": true,
      //   "items":[
      //     {
      //       "label":"评分标准",
      //       "icon":"",
      //       "routerLink":"/main/business/score/scoreQueryComponent",
      //       "expanded": false,
      //       "visible": true
      //     }
      //   ]
      // },
      {
        "label":"配置管理",
        "icon": "fa-list",
        "url": "",
        "routerLink": "",
        "expanded": false,
        "visible": true,
        "items":[
          /* {
            "label":"固定项配置",
            "icon":"",
            "routerLink":"/main/business/form/formConfig",
            "expanded": false,
            "visible": true
          }, {
            "label":"自定义项配置",
            "icon":"",
            "routerLink":"/main/business/form/form-custom-config",
            "expanded": false,
            "visible": true
          }, */ {
            "label":"体征规则设置",
            "icon":"",
            "routerLink":"/main/business/form/signs-rule-config",
            "expanded": false,
            "visible": true
          },{
            "label":"PDA表单配置",
            "icon":"",
            "routerLink":"/main/business/form/eva-config",
            "expanded": false,
            "visible": true
          },{
            "label":"同步数据设置",
            "icon":"",
            "routerLink":"/main/business/form/emr-sync-config",
            "expanded": false,
            "visible": true
          },{
            "label":"质控规则配置",
            "icon":"",
            "routerLink":"/main/business/score/scoreQueryComponent",
            "expanded": false,
            "visible": true
          },{
            "label":"动态映射配置",
            "icon":"",
            "routerLink":"/main/business/form/report-config",
            "expanded": false,
            "visible": true
          }
        ]
      },
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
          }, {
            "label":"数据组",
            "icon":"",
            "routerLink":"/main/business/datasource/datasource-group",
            "expanded": false,
            "visible": true
          },{
            "label":"数据元",
            "icon":"",
            "routerLink":"/main/business/datasource/datasource",
            "expanded": false,
            "visible": true
          },{
            "label":"值域",
            "icon":"",
            "routerLink":"/main/business/datasource/datasource-dict",
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
        "expanded": false,
        "visible": true,
"items": [
          {
            "label":"模板目录",
            "icon":"",
            "routerLink":"/main/business/console/folder",
            "expanded": false,
            "visible": true
          }, 
          // {
          //   "label":"数据元管理",
          //   "icon":"",
          //   "routerLink":"/main/business/console/datasource",
          //   "expanded": false,
          //   "visible": true
          // },
          {
            "label":"模板制作",
            "icon":"",
            "routerLink":"/main/business/console/template",
            "expanded": false,
            "visible": true
          },{
            "label":"目录移动",
            "icon":"",
            "routerLink":"/main/business/console/template-editor",
            "expanded": false,
            "visible": true
          }
        ]
      },
      {
        "label":"模板更新",
        "icon": "fa-refresh",
 "url": "",
        "routerLink": "",
        "expanded": false,
        "visible": true,
"items": [
          {
            "label":"公共模板更新",
            "icon":"",
            "routerLink":"/main/business/console/templateUpdate",
            "expanded": false,
            "visible": true
          },{
            "label":"收藏模板更新",
            "icon":"",
            "routerLink":"/main/business/console/collectedTemplateReplace",
            "expanded": false,
            "visible": true
          }
        ]
      },
      {
        "label":"缓存管理",
        "icon": "fa-database",
        "url": "",
        "routerLink": "/main/business/redis-cache/redis-cache-manage",
        "expanded": false,
        "visible": true,
      },
      {
        "label":"数据传输",
        "icon": "icon iconfont icon-committed",
        "url": "",
        "routerLink": "",
        "expanded": false,
        "visible": true,
        "items": [
          {
            "label":"数据补传",
            "icon":"",
            "routerLink":"/main/business/data-transmit/retransmit",
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
    let currentUserInfo = JSON.parse(this.authTokenService.getCurrentUserInfo());
    let urlParams = this.storageCacheService.sessionStorageCache.get('urlParams');
    let expandedIndex = null;
    if(urlParams.adminRole){
      urlParams.adminRole = decodeURIComponent(urlParams.adminRole);
      let count=0;
     for (let i=0;i< this.items.length; i++){
       if(urlParams.adminRole.indexOf(this.items[i].label) != -1 ){
         count++;
         if(count==1){
           this.basUserService.setUserInfoThenNavigate(currentUserInfo,this.items[i].items[0].routerLink);
           this.activeLink = this.items[i].items[0].routerLink;
           this.items[i].expanded = true;
           expandedIndex = i;
         }

       }else{
         this.items[i].visible =false;
       }
     }
    }
    if(currentUserInfo && currentUserInfo.currentRole != '区域'){
      //this.items[0].visible = false;// 医院管理员，隐藏掉模板导入功能，add by zhanyulan（YLYEMR-894）
      //this.items[1].visible =false;
      //this.items[2].items[0].visible =false;
     // this.items[2].items[1].visible =false;
    }
    if(expandedIndex !== null){
      this.setItemActive(expandedIndex,0,undefined);
    }else{
      this.setItemActive(3,0,undefined);
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
