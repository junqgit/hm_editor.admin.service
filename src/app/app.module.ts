import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { hmModule } from 'portalface';
import { WidgetsModule } from 'portalface/widgets';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HeaderComponent } from './basic/header/header.component';
import { PageNotFoundComponent } from './basic/page-not-found/page-not-found.component';
import { LoadingComponent } from './basic/loading/loading.component';
import { SharedModule } from './basic/shared/shared.module';

import { MainComponent } from './basic/main/main.component';
import { LoadingService } from 'portalface/services';
import { NavToggledService} from './common/service/nav-toggled.service'


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        HeaderComponent,
        LoadingComponent,
        MainComponent
    ],
    imports: [
        hmModule,
        WidgetsModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [
        LoadingService, NavToggledService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
