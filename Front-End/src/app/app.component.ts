import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private readonly userService: UserService) {}
  public cookie: boolean = false;
  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.userService.verifyCookie({token: token}).subscribe(result => {
      if(result.status) {
        this.cookie=true;
        var str = '#len'; //increment by 1 up to 1-nelemnts
        $(document).ready(function(){
          var i: number, stop: number;
          i = 1;
          stop = 3; //num elements
          setInterval(function(){
            if (i > stop){
              return;
            }
            $('#len'+(i++)).toggleClass('bounce');
          }, 500)
        });
      }
    })
  }
  logout(): void{
    var now = new Date();
    now.setTime(now.getTime());
    document.cookie = "auth=; expires="+ now.toUTCString() +";";
    window.location.href = "";
  }
}
