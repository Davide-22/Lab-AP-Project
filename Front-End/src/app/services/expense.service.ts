import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {map} from "rxjs/operators"
import { Expense } from "../models/expense.model";
import { DailyExpense } from "../models/dailyexpense.model";


@Injectable({providedIn: 'root' })
export class ExpenseService {

    constructor(private readonly http: HttpClient) {}

    public getDayExpenses(dailyExpense: DailyExpense): Observable<Expense[]>{
        return this.http.post<Expense[]>('http://localhost:3002/dayTravel', DailyExpense.toJSON(dailyExpense))
        .pipe(
            map(res => {
                return res
            })
        )
    }
}