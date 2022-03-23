import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TravelService } from '../services/travel.service';
import { Travel } from '../models/travel.model';
import { ExpenseService } from '../services/expense.service';
import { Expense } from "../models/expense.model";
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';


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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
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
    labels: this.days,
    datasets: [
      { data: [], label: 'Accomodation' },
      { data: [], label: 'Food' },
      { data: [], label: 'Event' },
      { data: [], label: 'Cultural Place' },
      { data: [], label: 'Transport' }
    ]
  };
  
  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }
  
  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  constructor(private readonly travelService: TravelService, private readonly expenseService: ExpenseService,
    private route: ActivatedRoute) {
    }

  
  ngOnInit(): void {
    this.start_date_to_display = this.convertDate(this.Travel.start_date);
    this.buildForm();
    this.travelEnded();
    this.travelNotStarted();
    this.visualizeTravelDays();
    this.chartDataElaboration();
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
    if(this.Form.valid && this.current_date >= this.Travel.start_date) {
      this.error = false;
      let Expense: Expense = this.Form.value as Expense;
      Expense.date = this.current_date;
      Expense.token = this.userToken;
      this.expenseService.addExpense(this.Form.value as Expense).subscribe(result => {
        if(result.status){
          this.add=!this.add;
          this.buildForm();
          this.addExpenseToChart(Expense);
        }
      });
    } else if (this.Form.get('amount').value < 1) {
      this.errorString = 'Enter an amount greater or equal than 1';
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
  
  chartDataElaboration(): void{
    var expenses: Expense[] = [];
    
    for(let i=0; i<this.days.length; i++){
      for(let j=0; j<this.barChartData.datasets.length; j++){
        this.barChartData.datasets[j].data.push(0);
      }
    }
    
    for(let i=0; i<this.days.length; i++){
      var splitted = this.days[i].split("/");
      var day: string = splitted[2] + "-" +splitted[1] + "-" + splitted[0];
      
      this.expenseService.getExpenses({travel: this.Travel.name, token: this.userToken, date: day}).subscribe((result) => {
        expenses = result;

        for(let j=0; j<expenses.length; j++){
          if(expenses[j].category == 'accomodation'){
            this.barChartData.datasets[0].data[i] += expenses[j].amount;
          } else if(expenses[j].category == 'food'){
            this.barChartData.datasets[1].data[i] += expenses[j].amount;
          } else if(expenses[j].category == 'event'){
            this.barChartData.datasets[2].data[i] += expenses[j].amount;
          } else if(expenses[j].category == 'cultural place'){
            this.barChartData.datasets[3].data[i] += expenses[j].amount;
          } else if(expenses[j].category == 'transport'){
            this.barChartData.datasets[4].data[i] += expenses[j].amount;
          }
        }
        this.chart?.update();
      });
    }
    
  }

  addExpenseToChart(expense: Expense):void {
    let i = this.barChartData.datasets[0].data.length-1;
    console.log(this.barChartData.datasets[0].data);
    console.log(i);
    if(expense.category == 'accomodation'){
      this.barChartData.datasets[0].data[i] += expense.amount;
    } else if(expense.category == 'food'){
      this.barChartData.datasets[1].data[i] += expense.amount;
    } else if(expense.category == 'event'){
      this.barChartData.datasets[2].data[i] += expense.amount;
    } else if(expense.category == 'cultural place'){
      this.barChartData.datasets[3].data[i] += expense.amount;
    } else if(expense.category == 'transport'){
      this.barChartData.datasets[4].data[i] += expense.amount;
    }
    this.chart?.update();
  }

}
