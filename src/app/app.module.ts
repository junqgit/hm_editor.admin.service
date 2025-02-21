
import { AuthModule } from './basic/auth/auth.module';
import { BasUserService } from './basic/auth/bas-user.service';
import { AuthTokenService } from './basic/auth/authToken.service';
import { AuthHttpService } from './basic/auth/authHttp.service';
import { AuthLoginService } from './basic/auth/authLogin.service';
import { AuthLoginComponent } from './basic/auth/authLogin.component';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { KyeeModule } from 'portalface';
import { WidgetsModule } from 'portalface/widgets';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './basic/login/login.component';
import { HeaderComponent } from './basic/header/header.component';
import { PageNotFoundComponent } from './basic/page-not-found/page-not-found.component';
import { LoadingComponent } from './basic/loading/loading.component';

import { MainComponent } from './basic/main/main.component';
import { LoadingService } from 'portalface/services';
import { NavToggledService} from './common/service/nav-toggled.service'


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        LoginComponent,
        HeaderComponent,
        LoadingComponent,
        MainComponent
    ],
    imports: [
        KyeeModule,
        WidgetsModule,
        AppRoutingModule,
        AuthModule
    ],
    providers: [
        LoadingService, AuthHttpService,NavToggledService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
