import { Component, OnInit } from '@angular/core';
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

  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  public days: Day[] = [];
  public email: string;

  
  //travel: Travel | undefined;
  travel: String;
  
  //toDelete
  //public travels: Travel[] = [];

  constructor(private readonly travelService: TravelService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.buildForm();
    
    // get the travel name from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const travelNameFromRoute = String(routeParams.get('travelName'));
    
    //toDelete
    // Find the travel that correspond with the name provided in route.
    //this.travel = this.travels.find(travel => travel.name === travelNameFromRoute);
    this.travel = travelNameFromRoute;
    this.travelService.getTravelDays({name: travelNameFromRoute}).subscribe(result => this.days = result);
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

}
