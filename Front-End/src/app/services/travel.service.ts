import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {map} from "rxjs/operators"
import { Ack } from "../models/acks";
import { Token } from "../models/token.model";
import { Name } from "../models/name.model";
import { Travel } from "../models/travel.model";
import { Day } from "../models/day.model";
import { Complete } from "../models/complete.model";
import { Delete } from "../models/delete.model";
import { GetDays } from "../models/getdays.model";

@Injectable({providedIn: 'root' })
export class TravelService {

    constructor(private readonly http: HttpClient) {}

    public getTravelsByUser(token: Token): Observable<Travel[]>{
        return this.http.post<Travel[]>('http://localhost:3002/travels', Token.toJSON(token))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public addTravelToUser(travel: Travel): Observable<Ack>{
        return this.http.post<Ack>('http://localhost:3002/addTravel', Travel.toJSON(travel))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public deleteTravel(del: Delete): Observable<Ack>{
        return this.http.post<Ack>('http://localhost:3002/deleteTravel', Delete.toJSON(del))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public getTravelDays(getDays: GetDays): Observable<Day[]>{
        return this.http.post<Day[]>('http://localhost:3002/days', GetDays.toJSON(getDays))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public completeTravel(complete: Complete): Observable<Ack>{
        return this.http.post<Ack>('http://localhost:3002/completeTravel', Complete.toJSON(complete))
        .pipe(
            map(res => {
                return res
            })
        )
    }
    
}