import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public travels_done: number = 0;
  public days: number = 0;
  public username: string = '';
  public email: string = '';
  public formError : string; 
  public error: boolean = false;
  public displayStyle: any = "none";

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.userService.verifyCookie({token: token}).subscribe(result => {
      if(result.status == false) {
        window.location.href="";
      } else {
          this.userService.account({token: token}).subscribe(result=> {
          this.travels_done = result.travels_done;
          this.days = result.days;
          this.username = result.username;
          this.email = result.email;
        });
      }
    })
  }

  logout(): void {
    var now = new Date();
    now.setTime(now.getTime());
    document.cookie = "auth=; expires="+ now.toUTCString() +";";
    window.location.href = "";
  }

  changePassword(): void {
    window.location.href = "/change-password";
  }

  openPopUp(): void {
    this.displayStyle="block";
  }

  closePopUp(): void {
    this.displayStyle="none";
  }
  
  deleteAccount(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.userService.deleteAccount({token : token})
    .subscribe(result => {
      if(result.status){
        var now = new Date();
        now.setTime(now.getTime());
        document.cookie = "auth=; expires="+ now.toUTCString() +";"; 
        window.location.href="";
      }else if(result.msg == "error"){
        this.formError = "Error";
        this.error = true;
      }
      });
  }

}
