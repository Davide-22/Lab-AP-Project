import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TravelService } from '../services/travel.service';
import { Travel } from '../models/travel.model';
import { ExpenseService } from '../services/expense.service';
import { Expense } from "../models/expense.model";
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
  public title: string | null = null;

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
    layout:{
      padding: 60
    },
    scales: {
      x: {},
      y: {
        min: 0,
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right'
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
    labels: [],
    datasets: [
      { data: [], label: 'Accomodation' },
      { data: [], label: 'Food' },
      { data: [], label: 'Event' },
      { data: [], label: 'Cultural Place', backgroundColor: '#b39ddb' },
      { data: [], label: 'Transport', backgroundColor: '#a5d6a7' },
      { data: [], label: 'Other' }
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
    private route: ActivatedRoute, private modalService: NgbModal) {
    }

  
  ngOnInit(): void {
    this.start_date_to_display = this.convertDate(this.Travel.start_date);
    this.buildForm();
    this.travelEnded();
    this.travelNotStarted();
    this.visualizeTravelDays();
    this.chartInitialization();
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
          this.chartInitialization();
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


  open(content, travel: Travel) {
    this.title = travel.name;
    this.Travel = travel;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
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
    this.chartInitialization();
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
      if(!dates.includes(toAdd)){
        dates = [...dates, toAdd];
      }
      theDate.setDate(theDate.getDate() + 1);
    }
    let end = (new Date(endDate)).toISOString().slice(0, 10);
    if(!dates.includes(end)){
      dates = [...dates, end];
    }
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
  
  chartInitialization(): void{
    var expenses: Expense[] = [];
    this.barChartData.labels = this.days;

    var accomodation_amounts: number[] = [];
    var food_amounts: number[] = [];
    var event_amounts: number[] = [];
    var culturalplace_amounts: number[] = [];
    var transport_amounts: number[] = [];
    var other_amounts: number[] = [];
    
    for(let i=0; i<this.days.length; i++){
      accomodation_amounts.push(0);
      food_amounts.push(0);
      event_amounts.push(0);
      culturalplace_amounts.push(0);
      transport_amounts.push(0);
      other_amounts.push(0);
      
      var splitted = this.days[i].split("/");
      var day: string = splitted[2] + "-" +splitted[1] + "-" + splitted[0];
      
      this.expenseService.getExpenses({travel: this.Travel.name, token: this.userToken, date: day}).subscribe((result) => {
        expenses = result;

        for(let j=0; j<expenses.length; j++){
          if(expenses[j].category == 'accomodation'){
            accomodation_amounts[i] += expenses[j].amount;
          } else if(expenses[j].category == 'food'){
            food_amounts[i] += expenses[j].amount;
          } else if(expenses[j].category == 'event'){
            event_amounts[i] += expenses[j].amount;
          } else if(expenses[j].category == 'cultural place'){
            culturalplace_amounts[i] += expenses[j].amount;
          } else if(expenses[j].category == 'transport'){
            transport_amounts[i] += expenses[j].amount;
          } else if(expenses[j].category == 'other'){
            other_amounts[i] += expenses[j].amount;
          }
        }
        this.barChartData.datasets[0].data = accomodation_amounts;
        this.barChartData.datasets[1].data = food_amounts;
        this.barChartData.datasets[2].data = event_amounts;
        this.barChartData.datasets[3].data = culturalplace_amounts;
        this.barChartData.datasets[4].data = transport_amounts;
        this.barChartData.datasets[5].data = other_amounts;

        /*let max_amount = Math.max(...accomodation_amounts, ...food_amounts, ...event_amounts, ...culturalplace_amounts, ...transport_amounts);
        this.barChartOptions.scales.y.max = max_amount;
        console.log(this.barChartOptions.scales.y.max )*/

        this.chart?.update();
      });
    }
    
  }

}
