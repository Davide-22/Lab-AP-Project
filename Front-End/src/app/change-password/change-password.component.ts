import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Passwords } from '../models/passwords.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form : FormGroup;
  formError : string; 
  error: boolean = false;
  constructor(public fb: FormBuilder, private readonly userService: UserService) { 
    this.form = fb.group({
      'oldpassword' : ['',Validators.required],
      'password' : ['',Validators.required],
      'repeatpassword' : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.userService.verifyCookie({token: token}).subscribe(result => {
      if(result.status == false) {
        window.location.href="";
      }
    })
  }

  checkPassword() : boolean{
    if(this.form.controls['password'].value.length < 8){
      this.formError = "Password's length must be at least 8 characters";
      this.error = true;
      return true;
    }
    if(this.form.controls['password'].value.length != this.form.controls['repeatpassword'].value.length){
      this.formError = "Passwords don't match";
      this.error = true;
      return true;
    }
    return false;
  }

  change(): void {
    if(!this.form.valid){
      this.formError = "You must fill all the fields";
      this.error = true;
      return;
    }
    if(this.checkPassword()){
      return;
    }
    var cookies = document.cookie;
    var oldpassword = this.form.controls['oldpassword'].value;
    var password = this.form.controls['password'].value;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.userService.changePassword(new Passwords(oldpassword,password,token))
    .subscribe(result => {
      if(result.status){
        window.location.href="/account";
      }else if(result.msg == "error"){
        this.formError = "Error";
        this.error = true;
      }else{
        this.formError = "Wrong password";
        this.error = true;
      }
      });
  }

}
