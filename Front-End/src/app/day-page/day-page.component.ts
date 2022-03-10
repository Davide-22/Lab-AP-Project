import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';

@Component({
  selector: 'app-day-page',
  templateUrl: './day-page.component.html',
  styleUrls: ['./day-page.component.css']
})
export class DayPageComponent implements OnInit {

  @Input() public travel: string;
  @Input() public day: string;
  @Input() public userToken: string;
  @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() public daily_budget: number;
  @Input() public start_date: string;
  @Input() public end_date: string;

  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  public error: boolean = false;
  public errorString: string='You must fill all the field';
  public selected: boolean = false;
  public travel_ended: boolean = false;

  public expenses: Expense[] = [];
  public expense: string;
  public budget_left: number;

  constructor(private readonly expenseService: ExpenseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildForm();
    this.expenseService.getExpenses({travel: this.travel, token: this.userToken, date:this.day}).subscribe((result) => {
      this.expenses = result;
      this.budgetLeft();
    });
    this.travelEnded();
  }

  buildForm(): void {
    this.Form = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.min(1)),
      category: new FormControl(null, Validators.required),
      place: new FormControl(null, Validators.required),
      travel: new FormControl(this.travel)
    });
  }

  cancel(): void {
    this.add = !this.add;
  }

  addExpense(): void {
    if(this.Form.valid && this.day >= this.start_date) {
      this.error = false;
      let Expense: Expense = this.Form.value as Expense;
      Expense.date = this.day;
      Expense.token = this.userToken;
      this.expenseService.addExpense(this.Form.value as Expense).subscribe(result => console.log(result));
      this.add = !this.add;
      window.location.reload();
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount >= 1';
      this.error = true;
    } else if (this.day < this.start_date){
      this.errorString = 'You cannot add an expense to a travel not started yet';
      this.error = true;
    }else {
      this.errorString = 'You must fill all the field';
      this.error = true;
    }
  }

  deleteExpense(name: string): void {
    this.expenseService.deleteExpense({token: this.userToken, travel: this.travel, name: name}).subscribe(result => console.log(result));
    this.displayStyle="none";
    window.location.reload();
  }

  openPopUp(name: string): void {
    this.displayStyle="block";
    this.expense = name;
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

  backTravel(): void {
    this.back.emit(false);
  }
  
  budgetLeft():void{
    var sum_amounts: number = 0;
    for (let i = 0; i < this.expenses.length; i++) {
      sum_amounts += this.expenses[i].amount; 
    }
    var BudgetLeft: number = this.daily_budget - sum_amounts;
    this.budget_left = BudgetLeft;
  }

  travelEnded(): void{
    if(this.end_date != null){
      this.travel_ended = true;
    }
  }

}
