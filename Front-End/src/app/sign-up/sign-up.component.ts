import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  formError : string; 
  error: boolean = false;

  constructor(public fb: FormBuilder, private readonly userService: UserService) { 
    this.form = fb.group({
      'user' : ['',Validators.required],
      'email' : ['',Validators.required],
      'password' : ['',Validators.required],
      'repeatpassword' : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.userService.verifyCookie({token: token}).subscribe(result => {
      if(result.status == true) {
        window.location.href = "/main-page";
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
  send() : void{
    if(!this.form.valid){
      this.formError = "You must fill all the fields";
      this.error = true;
      return;
    }
    if(this.checkPassword()){
      return;
    }
    this.userService.signUp(this.form.value as User)
    .subscribe(result => {
      if(result.status){
        window.location.href="";
      }else if(result.msg == "keyerror"){
        this.formError = "Email already in use";
        this.error = true;
      }else{
        this.formError = "Error";
        this.error = true;
      }
    });
    //window.location.href="";
    //console.log(this.form.controls['user'].value);
  }
}

