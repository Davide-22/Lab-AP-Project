import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { travels } from '../travels';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public Form: FormGroup;
  public destinations: string[] = [''];
  public displayStyle: any = "none";
  public add: boolean = false;
  //public travels: string[] = ['Travel One', 'Travel Two', 'Travel Three'];

  travels = travels;
  public travel: string;
  constructor() { }

  buildForm(): void {
    this.Form = new FormGroup({
      TravelName: new FormControl(null),
      DailyBudget: new FormControl(null),
      StartingDay: new FormControl(null),
      Description: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  form(): void {
    this.add = !this.add;
    this.destinations = [''];
  }

  addTravel(): void {
    //aggiungere chiamata al db
    this.add = !this.add;
    this.destinations = [''];
  }

  destination(): void {
    this.destinations.push('');
  }

  deleteTravel(): void {
    this.displayStyle="none";
  }

  openPopUp(name: string): void {
    this.displayStyle="block";
    this.travel = name;

  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  compare(): void {
    window.location.href="/compare";
  }

}
