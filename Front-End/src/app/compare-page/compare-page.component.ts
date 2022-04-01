import { CompileMetadataResolver } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {compares} from '../compares';
import { Compare } from '../models/compare.model';
import { ExpenseService } from '../services/expense.service';
import { Travel } from '../travels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent implements OnInit {

  @Input() public travels: Travel[];
  public expenses: Compare[];
  public compares: string[] = ['accomodation','food','transport','cultural place','event', 'other'];
  public travel1: string="";
  public travel2: string="";
  public chartType: string;

  constructor(private readonly expenseService: ExpenseService) { }

  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.expenseService.getAllExpenses({token: token}).subscribe(result => {
      this.expenses = result;
    })
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 0}},
    plugins: {
      legend: { display: true,},
      datalabels: { anchor: 'end', align: 'end'}
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  public barChartData1: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  chartInitialization(): void{
    this.barChartData.labels = this.compares;
    var travels = [{data: [], label:this.travel1},{data: [], label:this.travel2}]
    this.barChartData.datasets = travels;

    for(let i=0;i<this.compares.length;i++){
      var test1: boolean = false;
      var test2: boolean = false;
      for(let j=0;j<this.expenses.length;j++){
        if(this.expenses[j].category==this.compares[i]){
          if(this.expenses[j].name == this.travel1){
            test1 = true;
            this.barChartData.datasets[0].data.push(this.expenses[j].avg);
          }
          if(this.expenses[j].name == this.travel2){
            test2 = true;
            this.barChartData.datasets[1].data.push(this.expenses[j].avg);
          }
        }
      }
      if(test1 == false){
        this.barChartData.datasets[0].data.push(0);
      }
      if(test2 == false){
        this.barChartData.datasets[1].data.push(0);
      }
      this.chart?.update();
    }
  }

  selectTravel(travel:string,id:number): void {
    if(id == 1){
      this.travel1 = travel;
    }else {
      this.travel2 = travel;
    }
    if(this.chartType=="average"){
      this.chartInitialization();
    }else {
      this.chartInitialization1();
    }
  }

  selectChart(chart:string): void{
    this.chartType=chart;
    if(this.chartType=="average"){
      this.chartInitialization();
    }else{
      this.chartInitialization1();
    }
  }

  chartInitialization1(): void{
    this.barChartData1.labels = this.compares;
    var travels = [{data: [], label:this.travel1},{data: [], label:this.travel2}]
    this.barChartData1.datasets = travels;

    for(let i=0;i<this.compares.length;i++){
      var test1: boolean = false;
      var test2: boolean = false;
      for(let j=0;j<this.expenses.length;j++){
        if(this.expenses[j].category==this.compares[i]){
          if(this.expenses[j].name == this.travel1){
            test1 = true;
            this.barChartData1.datasets[0].data.push(this.expenses[j].sum);
          }
          if(this.expenses[j].name == this.travel2){
            test2 = true;
            this.barChartData1.datasets[1].data.push(this.expenses[j].sum);
          }
        }
      }
      if(test1 == false){
        this.barChartData1.datasets[0].data.push(0);
      }
      if(test2 == false){
        this.barChartData1.datasets[1].data.push(0);
      }
      this.chart?.update();
    }
  }

}
