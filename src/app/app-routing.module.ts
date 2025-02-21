import { AuthLoginComponent } from './basic/auth/authLogin.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PageNotFoundComponent } from './basic/page-not-found/page-not-found.component';
import {MainComponent} from "./basic/main/main.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: AuthLoginComponent },
            { path: 'main', component: MainComponent,
              children:[
                {path:'business',loadChildren: './business/business.module#BusinessModule'},
                { path: '', loadChildren: './business/business.module#BusinessModule' },
                { path: '**', component: PageNotFoundComponent }
              ]},

        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
