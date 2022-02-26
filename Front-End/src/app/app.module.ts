import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainPageComponent } from './main-page/main-page.component';
import { AccountComponent } from './account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { TravelPageComponent } from './travel-page/travel-page.component';
=======
import { ChangePasswordComponent } from './change-password/change-password.component';
>>>>>>> 71177d1b036900713413fd1cdef704b166da031f

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AccountComponent,
<<<<<<< HEAD
    TravelPageComponent,
=======
    ChangePasswordComponent,
>>>>>>> 71177d1b036900713413fd1cdef704b166da031f
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
