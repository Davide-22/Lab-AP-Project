import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Day, days } from '../days';
import { expenses } from '../expenses';

@Component({
  selector: 'app-day-page',
  templateUrl: './day-page.component.html',
  styleUrls: ['./day-page.component.css']
})
export class DayPageComponent implements OnInit {

  @Input() public travel: string;
  @Input() public day: string;
  expenses = expenses;
  public Form: FormGroup;
  public displayStyle: any = "none";
  public add: boolean = false;
  

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  
    this.buildForm();
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

  deleteExpense(): void {
    //chiamata back-end
  }

  openPopUp(): void {
    this.displayStyle="block";
  }

  closePopUp(): void {
    this.displayStyle="none";
  }

}
