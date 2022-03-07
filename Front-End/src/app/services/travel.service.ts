import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {map} from "rxjs/operators"
import { Ack } from "../models/acks";
import { Email } from "../models/email.model";
import { Name } from "../models/name.model";
import { Travel } from "../models/travel.model";
import { Day } from "../models/day.model";

@Injectable({providedIn: 'root' })
export class TravelService {

    constructor(private readonly http: HttpClient) {}

    public getTravelsByUser(email: Email): Observable<Travel[]>{
        return this.http.post<Travel[]>('http://localhost:3002/travels', Email.toJSON(email))
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

    public deleteTravel(name: Name): Observable<Ack>{
        return this.http.post<Ack>('http://localhost:3002/deleteTravel', Name.toJSON(name))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public getTravelDays(name: Name): Observable<Day[]>{
        return this.http.post<Day[]>('http://localhost:3002/days', Name.toJSON(name))
        .pipe(
            map(res => {
                return res
            })
        )
    }
    
}