import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Travel } from '../models/travel.model';
import { TravelService } from '../services/travel.service';
import { Day } from "../models/day.model";

@Component({
  selector: 'app-travel-page',
  templateUrl: './travel-page.component.html',
  styleUrls: ['./travel-page.component.css']
})
export class TravelPageComponent implements OnInit {
  //toDelete
  //public days: string[] = ['Day One', 'Day Two', 'Day Three'];
  //days = days;

  @Input() public travel;
  @Input() public user;

  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  public days: Day[] = [];
  public email: string;
  public day: string;
  public selected: boolean = false;

  
  //travel: Travel | undefined;
  
  //toDelete
  //public travels: Travel[] = [];

  constructor(private readonly travelService: TravelService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildForm();
    
    //toDelete
    // Find the travel that correspond with the name provided in route.
    //this.travel = this.travels.find(travel => travel.name === travelNameFromRoute);
    this.travelService.getTravelDays({name: this.travel}).subscribe(result => this.days = result);
  }

  buildForm(): void {
    this.Form = new FormGroup({
      ExpenseName: new FormControl(null),
      ExpenseAmount: new FormControl(null),
      ExpenseCategory: new FormControl(null),
      ExpensePlace: new FormControl(null)
    });
  }

  form(): void {
    this.add = !this.add;
  }

  addExpense(): void {
    //chiamata back-end
    this.add = !this.add;
  }

  openPopUp(): void {
    this.displayStyle="block";
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  completeTravel(): void {
    window.location.href = "/main-page";
  }

  select(name: string): void {
    this.selected = !this.selected;
    this.day = name;
  }

}
