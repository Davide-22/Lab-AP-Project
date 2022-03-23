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
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Accomodation' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Food' },
      { data: [ 49, 3, 4, 9, 8, 7, 9 ], label: 'Event' },
      { data: [ 8, 8, 0, 1, 6, 2, 0 ], label: 'Cultural Place' },
      { data: [ 2, 4, 34, 15, 54, 87, 38 ], label: 'Transport' }
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
    //toDo
  }

}
