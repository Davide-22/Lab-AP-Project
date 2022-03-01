import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  formError : string; 

  constructor(public fb: FormBuilder) { 
    this.form = fb.group({
      'user' : ['',Validators.required],
      'email' : ['',Validators.required],
      'password' : ['',Validators.required],
      'repeatpassword' : ['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  checkPassword() : boolean{
    if(this.form.controls['password'].value.length < 8){
      this.formError = "Password's length must be at least 8 characters";
      return true;
    }
    if(this.form.controls['password'].value.length != this.form.controls['repeatpassword'].value.length){
      this.formError = "Passwords don't match";
      return true;
    }
    return false;
  }
  send() : void{
    if(!this.form.valid){
      this.formError = "You must fill all the fields";
      return;
    }
    if(this.checkPassword()){
      return;
    }
    window.location.href="";
    console.log(this.form.controls['user'].value);
  }
}

