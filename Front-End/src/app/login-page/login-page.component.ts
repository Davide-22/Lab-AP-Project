import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../models/login.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  
  form: FormGroup;
  formError : string; 
  error: boolean = false;

  constructor(public fb: FormBuilder, private readonly userService: UserService) { 
    this.form = fb.group({
      'email' : ['',Validators.required],
      'password' : ['',Validators.required],
    })
  }

  ngOnInit(): void {
    if(document.cookie){
      var cookies = document.cookie;
      var cookiearray = cookies.split(';');
      var token = cookiearray[0].split('=')[1];
      this.userService.verifyCookie({token: token}).subscribe(result => {
        if(result.status == true) {
          window.location.href="/main-page";
        }
      })
    }
  }

  submit(): void {
    if(!this.form.valid){
      this.formError = "You must fill all the fields";
      this.error = true;
      return;
    }
    this.userService.logIn(this.form.value as Login)
    .subscribe(result => {
      if(result.status){
        document.cookie = "auth="+result.msg;
        window.location.href="/main-page";
      }else if(result.msg == "error"){
        this.formError = "Error";
        this.error = true;
      }else{
        this.formError = "Wrong email or password";
        this.error = true;
      }
    });
  }

}
