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
  public compares: string[] = ['accomodation','food','transport','cultural place','event'];
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
      if(this.chartType=="pieChart"){
        this.chartDataElaboration(1);
      }
    }else {
      this.travel2 = travel;
      if(this.chartType=="pieChart"){
        this.chartDataElaboration(2);
      }
    }
    if(this.chartType=="barChart"){
      this.chartInitialization();
    }
  }

  selectChart(chart:string): void{
    this.chartType=chart;
    if(this.chartType=="barChart"){
      this.chartInitialization();
    }else{
      this.chartDataElaboration(1);
      this.chartDataElaboration(2);
    }
  }

  @ViewChild(BaseChartDirective) chart2: BaseChartDirective | undefined;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
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
  public pieChartData1: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {
      data: []
    } ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DataLabelsPlugin ];

  public pieChartData2: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {
      data: []
    } ]
  };

  chartDataElaboration(type: number): void{
    if(type==1){
      var chart_categories1=[];
      var chart_amounts1=[];
      for(let i=0; i<this.expenses.length;i++){
        if(this.expenses[i].name==this.travel1){
          chart_categories1.push(this.expenses[i].category);
          chart_amounts1.push(this.expenses[i].sum);
        }
      }
      this.pieChartData1.labels = chart_categories1;
      this.pieChartData1.datasets[0].data = chart_amounts1;
      this.chart2?.update();
    }else{
      var chart_categories2=[];
      var chart_amounts2=[];
      for(let i=0; i<this.expenses.length;i++){
        if(this.expenses[i].name==this.travel2){
          chart_categories2.push(this.expenses[i].category);
          chart_amounts2.push(this.expenses[i].sum);
        }
      }
      this.pieChartData2.labels = chart_categories2;
      this.pieChartData2.datasets[0].data = chart_amounts2;
      this.chart2?.update();
    }
  }

}
