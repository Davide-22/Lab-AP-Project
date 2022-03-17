import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TravelService } from '../services/travel.service';
import { Travel } from '../models/travel.model';
import { ExpenseService } from '../services/expense.service';
import { Expense } from "../models/expense.model";


@Component({
  selector: 'app-travel-page',
  templateUrl: './travel-page.component.html',
  styleUrls: ['./travel-page.component.css']
})
export class TravelPageComponent implements OnInit {
  
  @Input() public Travel: Travel;
  @Input() public userToken: string;
  
  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  public error: boolean = false;
  public errorString: string='You must fill all the field';
  public selected: boolean = false;
  public travel_ended: boolean = false;
  public travel_not_started: boolean = false;

  public days: string[] = [];
  public email: string;
  public day: string;
  public start_date_to_display: string;
  public destinations: string[] = [];

  current_date = (new Date()).toISOString().slice(0, 10);
  public p: number = 1;

  constructor(private readonly travelService: TravelService, private readonly expenseService: ExpenseService,
    private route: ActivatedRoute) {
    }

  
  ngOnInit(): void {
    this.start_date_to_display = this.convertDate(this.Travel.start_date);
    this.buildForm();
    this.travelEnded();
    this.travelNotStarted();
    this.visualizeTravelDays();
    this.suggestedDestinations(this.Travel.destination);
  }

  buildForm(): void {
    this.Form = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.min(1)),
      category: new FormControl(null, Validators.required),
      place: new FormControl(null, Validators.required),
      travel: new FormControl(this.Travel.name)
    });
  }

  cancel(): void {
    this.add = !this.add;
  }

  addExpense(): void {
    if(this.Form.valid && this.current_date >= this.Travel.start_date) {
      this.error = false;
      let Expense: Expense = this.Form.value as Expense;
      Expense.date = this.current_date;
      Expense.token = this.userToken;
      this.expenseService.addExpense(this.Form.value as Expense).subscribe(result => console.log(result));
      this.add = !this.add;
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount >= 1';
      this.error = true;
    } else if (this.current_date < this.Travel.start_date){
      this.errorString = 'You cannot add an expense to a travel not started yet';
      this.error = true;
    } else {
      this.errorString = 'You must fill all the field';
      this.error = true;
    }
  }

  openPopUp(): void {
    this.displayStyle="block";
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  completeTravel(): void {
    this.travelService.completeTravel({userToken: this.userToken, travel: this.Travel.name, date: this.current_date}).subscribe(result => console.log(result));
    window.location.href = "/main-page";
  }

  select(name: string): void {
    this.selected = !this.selected;
    this.day = name;
  }

  onBack(element: boolean): void {
    this.selected = element;
  }

  travelEnded(): void {
    if(this.Travel.end_date != null){
      this.travel_ended = true;
    }
  }

  travelNotStarted(): void {
    if( this.current_date < this.Travel.start_date){
      this.travel_not_started = true;
    }
  }

  convertDate(date: string): string {
    var splitted = date.split("-");
    var recombined: string = splitted[2] + "/" +splitted[1] + "/" + splitted[0];
    return recombined;
  }

  convertDates(dates: string[]): void {
    for(let i=0; i<dates.length; i++){
      let dateToAdd = this.convertDate(dates[i]);
      this.days.push(dateToAdd);
    }
  }
  
  getDatesBetweenDates(startDate: string, endDate:string){
    let dates = []
    const theDate = new Date(startDate)
    while (theDate < new Date(endDate)) {
      let toAdd = (new Date(theDate)).toISOString().slice(0, 10);
      dates = [...dates, toAdd];
      theDate.setDate(theDate.getDate() + 1);
    }
    let end = (new Date(endDate)).toISOString().slice(0, 10);
    dates = [...dates, end];
    return dates;
  } 

  visualizeTravelDays(): void {
    if(this.travel_not_started){
      return;
    }
    else if(this.travel_ended){
      let dates = this.getDatesBetweenDates(this.Travel.start_date,this.Travel.end_date);
      this.convertDates(dates);

    }
    else{
      let dates = this.getDatesBetweenDates(this.Travel.start_date,this.current_date);
      this.convertDates(dates);
    }
  }
  
  suggestedDestinations(destinations: string[]): void {
    if(destinations[0] == '{'){
      let a: string[] = destinations.slice(1,destinations.length-1).toString().split(",");
      this.destinations = a;
    } else{
      let b: string = destinations.toString();
      this.destinations.push(b);
    }
  }

}
