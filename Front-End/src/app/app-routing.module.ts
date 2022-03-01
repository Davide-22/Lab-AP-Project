import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TravelPageComponent } from './travel-page/travel-page.component';
import { DayPageComponent } from './day-page/day-page.component';


const routes: Routes = [
  {path: 'account', component: AccountComponent},
  {path: 'main-page', component: MainPageComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'travels/:travelName', component: TravelPageComponent},
  {path: 'day-page', component: DayPageComponent},
  {path: 'travel-page', component: TravelPageComponent},
  {path: 'days/:dayName', component: DayPageComponent},
  {path: '', component: LoginPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
