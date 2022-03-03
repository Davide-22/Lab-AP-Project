import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {User} from "../models/user.model";
import {map} from "rxjs/operators"
import { Ack } from "../models/acks";
import { Login } from "../models/login.model";

@Injectable({providedIn: 'root' })
export class UserService {
    public readonly URL: string = 'http://localhost:3003';

    constructor(private readonly http: HttpClient) {}

    public signUp(user: User): Observable<Ack> {
        return this.http.post<Ack>('http://localhost:3003/signup', User.toJSON(user))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public logIn(login: Login): Observable<Ack> {
        return this.http.post<Ack>('http://localhost:3003/login', Login.toJSON(login))
        .pipe(
            map(res => {
                return res
            })
        )
    }
    
}