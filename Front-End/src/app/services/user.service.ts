import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {User} from "../models/user.model";


@Injectable({providedIn: 'root' })
export class UserService {
    public readonly URL: string = 'http://localhost:3003';

    constructor(private readonly http: HttpClient) {}

    public signUp(user: User): Observable<string> {
        console.log('post front-end');
        return this.http.post<string>('http://localhost:3003/signup', User.toJSON(user));
    }
    
}