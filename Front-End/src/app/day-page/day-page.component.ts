import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { Travel } from '../models/travel.model';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';


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
  public destinations: string[] = [];

  public p: number = 1; 

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }


  constructor(private readonly expenseService: ExpenseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildForm();
    this.convertDay(this.day);
    this.expenseService.getExpenses({travel: this.Travel.name, token: this.userToken, date:this.db_date}).subscribe((result) => {
      this.expenses = result;
      this.budgetLeft();
    });
    this.travelEnded();
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
    this.error = false;
    this.buildForm();
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
          this.expenseService.getExpenses({travel: this.Travel.name, token: this.userToken, date:this.db_date}).subscribe((result1) => {
            this.expenses = result1;
            this.budgetLeft();
          });
          this.add=!this.add;
          this.buildForm();
        } else {
          this.errorString= "Error in adding an expense";
          this.error = true;
        }
      });
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount greater or equal than 1';
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
