import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public Form: FormGroup;
  public t: number=1;
  public destinations: string[] = [''];

  public add: boolean = false;

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
    console.log(this.destinations);
  }

}
