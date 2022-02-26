import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  logout(): void {
    window.location.href = "";
  }

  changePassword(): void {
    window.location.href = "/change-password";
  }

  deleteAccount(): void {
    window.location.href = "/sign-up";
  }

}
