import { Component, Input, OnInit } from '@angular/core';
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
  
  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  public error: boolean = false;
  public errorString: string='You must fill all the field';
  public selected: boolean = false;

  public expenses: Expense[] = [];
  public expense: string;

  constructor(private readonly expenseService: ExpenseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  
    this.buildForm();
    this.expenseService.getExpenses({travel: this.travel, token: this.userToken, date:this.day}).subscribe(result => this.expenses = result);
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
    if(this.Form.valid) {
      this.error = false;
      let Expense: Expense = this.Form.value as Expense;
      Expense.date = this.day;
      Expense.token = this.userToken;
      this.expenseService.addExpense(this.Form.value as Expense).subscribe(result => console.log(result));
      this.add = !this.add;
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount >= 1';
      this.error = true;
    } else {
      this.errorString = 'You must fill all the field';
      this.error = true;
    }
  }

  deleteExpense(name: string): void {
    this.expenseService.deleteExpense({name: name, travel: this.travel}).subscribe(result => console.log(result));
    this.displayStyle="none";
    //window.location.href="/main-page";
  }

  openPopUp(name: string): void {
    this.displayStyle="block";
    this.expense = name;
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

}
