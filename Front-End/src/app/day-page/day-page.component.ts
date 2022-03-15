import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { Travel } from '../models/travel.model';

@Component({
  selector: 'app-day-page',
  templateUrl: './day-page.component.html',
  styleUrls: ['./day-page.component.css']
})
export class DayPageComponent implements OnInit {

  @Input() public Travel: Travel;
  @Input() public day: string;
  @Input() public userToken: string;
  @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();

  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  public error: boolean = false;
  public errorString: string='You must fill all the field';
  public selected: boolean = false;
  public travel_ended: boolean = false;

  public expenses: Expense[] = [];
  public Expense: Expense;
  public budget_left: number;
  public db_date: string;

  public p: number = 1; 

  constructor(private readonly expenseService: ExpenseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildForm();
    this.convertDay(this.day);
    this.expenseService.getExpenses({travel: this.Travel.name, token: this.userToken, date:this.db_date}).subscribe((result) => {
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
      travel: new FormControl(this.Travel.name)
    });
  }

  cancel(): void {
    this.add = !this.add;
  }

  addExpense(): void {
    if(this.Form.valid && this.db_date >= this.Travel.start_date) {
      this.error = false;
      let Expense: Expense = this.Form.value as Expense;
      Expense.date = this.db_date;
      Expense.token = this.userToken;
      this.expenseService.addExpense(this.Form.value as Expense).subscribe(result => {
        if(result.status){
          this.expenses.push(Expense);
          this.budgetLeft();
          this.add=!this.add;
        } else {
          this.errorString= "Error in adding an expense";
          this.error = true;
        }
      });
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount >= 1';
      this.error = true;
    } else if (this.db_date < this.Travel.start_date){
      this.errorString = 'You cannot add an expense to a travel not started yet';
      this.error = true;
    }else {
      this.errorString = 'You must fill all the field';
      this.error = true;
    }
  }

  deleteExpense(expense: Expense): void {
    this.expenseService.deleteExpense({token: this.userToken, travel: this.Travel.name, name: expense.name, _id:expense._id}).subscribe(result => {
      if(result.status){
        this.expenses.splice(this.expenses.indexOf(expense),1);
        this.budgetLeft();
        this.displayStyle="none";
      }
    });
  }

  openPopUp(expense: Expense): void {
    this.displayStyle="block";
    this.Expense = expense;
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
    var BudgetLeft: number = this.Travel.daily_budget - sum_amounts;
    if(BudgetLeft < 0){
      this.budget_left = 0;
    } else{
      this.budget_left = BudgetLeft;
    }
    
  }

  travelEnded(): void{
    if(this.Travel.end_date != null){
      this.travel_ended = true;
    }
  }

  convertDay(day: String): void{
    var splitted = day.split("/");
    var recombined: string = splitted[2] + "-" + splitted[1] + "-" + splitted[0];
    this.db_date = recombined;
  }
}
