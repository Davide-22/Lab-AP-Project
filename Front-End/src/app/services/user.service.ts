import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {User} from "../models/user.model";
import {map} from "rxjs/operators"
import { Ack } from "../models/acks";
import { Login } from "../models/login.model";
import { Passwords } from "../models/passwords.model";
import { Token } from "../models/token.model";
import { Account } from "../models/account.model";

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

    public changePassword(passwords : Passwords): Observable<Ack> {
        return this.http.post<Ack>('http://localhost:3003/changepassword', Passwords.toJSON(passwords))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public account(token: Token): Observable<Account> {
        return this.http.post<Account>('http://localhost:3003/account', Token.toJSON(token))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public verifyCookie(token: Token): Observable<Ack> {
        return this.http.post<Ack>('http://localhost:3003/verify', Token.toJSON(token))
        .pipe(
            map(res => {
                return res
            })
        )
    }

    public deleteAccount(token: Token): Observable<Ack> {
        return this.http.post<Ack>('http://localhost:3003/deleteaccount', Token.toJSON(token))
        .pipe(
            map(res => {
                return res
            })
        )
    }
    
}