import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { Travel } from '../models/travel.model';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


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
  public title: string | null = null;
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

  public chart_categories:string[] = []
  public chart_amounts: number[] = [];
  public p: number = 1; 
  public cat: string;

  
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
    // Pie
    public pieChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        datalabels: {
          formatter: (value, ctx) => {
            if (ctx.chart.data.labels) {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          },
        },
      }
    };
    public pieChartData: ChartData<'pie', number[], string | string[]> = {
      labels: this.chart_categories,
      datasets: [ {
        data: this.chart_amounts
      } ]
    };
    public pieChartType: ChartType = 'pie';
    public pieChartPlugins = [ DatalabelsPlugin ];
  
    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }
  
    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }


  constructor(private readonly expenseService: ExpenseService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.buildForm();
    this.convertDay(this.day);
    this.expenseService.getExpenses({travel: this.Travel.name, token: this.userToken, date:this.db_date}).subscribe((result) => {
      this.expenses = result;
      this.budgetLeft();
      this.chartDataElaboration(this.expenses);
    });
    this.travelEnded();
    this.destinations = this.Travel.destination;
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
            this.addExpenseToChart(Expense);
          });
          this.add=!this.add;
          this.buildForm();
          this.selectCategory(this.cat);
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
    console.log(expense);
    this.expenseService.deleteExpense({token: this.userToken, travel: this.Travel.name, name: expense.name, _id:expense._id}).subscribe(result => {
      if(result.status){
        this.expenses.splice(this.expenses.indexOf(expense),1);
        this.budgetLeft();
        this.deleteExpenseFromChart(expense);
        this.displayStyle="none";
        this.selectCategory(this.cat);
      }
    });
  }
  //popup
  open(content, expense: Expense) {
    this.title = expense.name;
    this.Expense = expense;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  /*
  openPopUp(expense: Expense): void {
    this.displayStyle="block";
    this.Expense = expense;
  }

  closePopUp(): void {
    this.displayStyle="none";
  }*/

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

  chartDataElaboration(expenses: Expense[]): void{
    for(let i=0; i<expenses.length; i++){
      if(!this.chart_categories.includes(expenses[i].category)){
        this.chart_categories.push(expenses[i].category);
        this.chart_amounts.push(expenses[i].amount);
      } else {
        let j = this.chart_categories.indexOf(expenses[i].category);
        this.chart_amounts[j] += expenses[i].amount;
      }
    }
  }

  selectCategory(category): void {
    var names: string[] = [];
    var amounts: number[] = [];
    this.cat = category;
    switch(category){
      case 'all':
        if (this.pieChartData.labels) {
          this.pieChartData.labels = this.chart_categories;
        }
        this.pieChartData.datasets[0].data = this.chart_amounts;
      break;
      
      case 'accomodation':
        if (this.pieChartData.labels) {
          for(let i=0; i<this.expenses.length; i++){
            if(this.expenses[i].category == "accomodation"){
              names.push(this.expenses[i].name);
              amounts.push(this.expenses[i].amount);
            }
          }
          this.pieChartData.labels = names;
        }
        this.pieChartData.datasets[0].data = amounts;
      break;
      
      case 'food':
        if (this.pieChartData.labels) {
          var names: string[] = [];
          var amounts: number[] = [];
          for(let i=0; i<this.expenses.length; i++){
            if(this.expenses[i].category == "food"){
              names.push(this.expenses[i].name);
              amounts.push(this.expenses[i].amount);
            }
          }
          this.pieChartData.labels = names;
        }
        this.pieChartData.datasets[0].data = amounts;
      break;

      case 'event':
        if (this.pieChartData.labels) {
          var names: string[] = [];
          var amounts: number[] = [];
          for(let i=0; i<this.expenses.length; i++){
            if(this.expenses[i].category == "event"){
              names.push(this.expenses[i].name);
              amounts.push(this.expenses[i].amount);
            }
          }
          this.pieChartData.labels = names;
        }
        this.pieChartData.datasets[0].data = amounts;
      break;

      case 'cultural place':
        if (this.pieChartData.labels) {
          var names: string[] = [];
          var amounts: number[] = [];
          for(let i=0; i<this.expenses.length; i++){
            if(this.expenses[i].category == "cultural place"){
              names.push(this.expenses[i].name);
              amounts.push(this.expenses[i].amount);
            }
          }
          this.pieChartData.labels = names;
        }
        this.pieChartData.datasets[0].data = amounts;
      break;
          
      case 'transport':
        if (this.pieChartData.labels) {
          var names: string[] = [];
          var amounts: number[] = [];
          for(let i=0; i<this.expenses.length; i++){
            if(this.expenses[i].category == "transport"){
              names.push(this.expenses[i].name);
              amounts.push(this.expenses[i].amount);
            }
          }
          this.pieChartData.labels = names;
        }
        this.pieChartData.datasets[0].data = amounts;
      break;
    }

    this.chart?.update();
  }

  addExpenseToChart(expense: Expense):void {
    if(this.chart_categories.includes(expense.category)){
      let j = this.chart_categories.indexOf(expense.category);
      this.chart_amounts[j] += expense.amount;
    } else{
      this.chart_categories.push(expense.category);
      this.chart_amounts.push(expense.amount);
    }
    this.chart?.update();
  }

  deleteExpenseFromChart(expense: Expense): void {
    let j = this.chart_categories.indexOf(expense.category);
    this.chart_amounts[j] -= expense.amount;

    if(this.chart_amounts[j] == 0){
      this.chart_categories.splice(j,1);
      this.chart_amounts.splice(j,1);
    }
    this.chart?.update();
  }
}
