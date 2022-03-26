import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {map} from "rxjs/operators"
import { Expense } from "../models/expense.model";
import { DailyExpense } from "../models/dailyexpense.model";
import { Ack } from "../models/acks";
import { DeleteExpense } from "../models/delete_expense.model";
import { Compare } from "../models/compare.model";
import { Token } from "../models/token.model";

@Injectable({providedIn: 'root' })
export class ExpenseService {

    constructor(private readonly http: HttpClient) {}

    public getExpenses(dailyExpense: DailyExpense): Observable<Expense[]>{
        return this.http.post<Expense[]>('http://localhost:3002/getExpenses', DailyExpense.toJSON(dailyExpense))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public addExpense(expense: Expense): Observable<Ack>{
        return this.http.post<Ack>('http://localhost:3002/addExpense', Expense.toJSON(expense))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public deleteExpense(deleteExpense: DeleteExpense): Observable<Ack>{
        return this.http.post<Ack>('http://localhost:3002/deleteExpense', DeleteExpense.toJSON(deleteExpense))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public getAllExpenses(token: Token): Observable<Compare[]>{
        return this.http.post<Compare[]>('http://localhost:3002/Expenses', Token.toJSON(token))
        .pipe(
            map(res => {
                return res
            })
        )
    }
}