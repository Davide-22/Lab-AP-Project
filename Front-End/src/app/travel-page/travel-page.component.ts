import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TravelService } from '../services/travel.service';
import { Day } from "../models/day.model";
import { Travel } from '../models/travel.model';
import { ExpenseService } from '../services/expense.service';
import { Expense } from "../models/expense.model";
import { formatDate } from '@angular/common';

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
  public travel_ended: boolean = false;
  public travel_not_started: boolean = false;

  public days: Day[] = [];
  public email: string;
  public day: string;
  public selected: boolean = false;

  current_date = new Date();

  constructor(private readonly travelService: TravelService, private readonly expenseService: ExpenseService,
    private route: ActivatedRoute) {
    }

  
  ngOnInit(): void {
    
    this.travelService.getTravelDays({travel: this.Travel.name, token: this.userToken}).subscribe(result => this.days = result);
    this.buildForm();
    this.travelEnded();
    this.travelNotStarted();
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
    let currentDate = formatDate(this.current_date, 'yyyy-MM-dd', 'en-US');
    if(this.Form.valid && currentDate >= this.Travel.start_date) {
      this.error = false;
      let Expense: Expense = this.Form.value as Expense;
      Expense.date = currentDate;
      Expense.token = this.userToken;
      this.expenseService.addExpense(this.Form.value as Expense).subscribe(result => console.log(result));
      this.add = !this.add;
      window.location.reload();
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount >= 1';
      this.error = true;
    } else if (currentDate < this.Travel.start_date){
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
    let currentDate = formatDate(this.current_date, 'yyyy-MM-dd', 'en-US');
    this.travelService.completeTravel({userToken: this.userToken, travel: this.Travel.name, date:currentDate}).subscribe(result => console.log(result));
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
    let currentDate = formatDate(this.current_date, 'yyyy-MM-dd', 'en-US');
    if( currentDate < this.Travel.start_date){
      this.travel_not_started = true;
    }
  }

}
