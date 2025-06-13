import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, switchMap } from "rxjs";

import { User } from "../models/user.model";
import { ConfigService } from "../../../core/services/config.service";
import { I } from "@angular/cdk/keycodes";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    private usersChanged = new Subject<void>();
    private configService = inject(ConfigService);

    usersChanged$ = this.usersChanged.asObservable();

    getUsers(): Observable<User[]> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<User[]>(`${config.apiUrl}/api/v1/users/`)
            )
        );
    }

    getUserFromIdentifier(idType: 'login'|'id', userId: string): Observable<User> {
        return this.configService.getConfig().pipe(
            switchMap(config => {
                const baseUrl = config.apiUrl;
                if (idType === 'id') {
                    return this.http.get<User>(`${config.apiUrl}/api/v1/users/${userId}`)
                } else {
                    return this.http.get<User>(`${config.apiUrl}/api/v1/users/login/${userId}`)
                }
            })
        );
    }

    addNewUser(userData: { 
        login: string, 
        firstname: string | null, 
        lastname: string | null,
        email: string | null
    }): Observable<User> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.post<User>(`${config.apiUrl}/api/v1/users/`, userData)
            )
        );
    }

    notifyUsersChanged(){
        this.usersChanged.next();
    }
}
