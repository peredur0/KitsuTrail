import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient)
    private usersChanged = new Subject<void>();

    usersChanged$ = this.usersChanged.asObservable();

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:8000/users/');
    }

    getUserFromIdentifier(idType: 'login'|'id', userId: string): Observable<User> {
        let foundUser: Observable<User> | null;

        if (idType === 'id') {
            foundUser = this.http.get<User>(`http://localhost:8000/users/${userId}`)
        } else {
            foundUser = this.http.get<User>(`http://localhost:8000/users/login/${userId}`)
        }

        return foundUser;
    }

    addNewUser(userData: { 
        login: string, 
        firstname: string | null, 
        lastname: string | null,
        email: string | null
    }): Observable<User> {
        return this.http.post<User>('http://localhost:8000/users/', userData);
    }

    notifyUsersChanged(){
        this.usersChanged.next();
    }
}
