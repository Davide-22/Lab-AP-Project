import { CompileMetadataResolver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import {compares} from '../compares';
import { Compare } from '../models/compare.model';
import { ExpenseService } from '../services/expense.service';
import { Travel } from '../travels';

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent implements OnInit {

  @Input() public travels: Travel[];
  public expenses: Compare[];

  constructor(private readonly expenseService: ExpenseService) { }

  ngOnInit(): void {
    var cookies = document.cookie;
    var cookiearray = cookies.split(';');
    var token = cookiearray[0].split('=')[1];
    this.expenseService.getAllExpenses({token: token}).subscribe(result => {
      this.expenses = result;
    })
  }

}
