import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    users: User[] = [];
    private http = inject(HttpClient)

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:8000/users');
    }

    getUserFromIdentifier(idType: 'login'|'id', userId: string): Observable<User> {
        let foundUser: Observable<User> | undefined;

        if (idType === 'id') {
            foundUser = this.http.get<User>(`http://localhost:8000/users/${userId}`)
        } else {
            throw new Error('Search for user by login not implemented yet');
        }

        if ( !foundUser ) {
            throw new Error(`Failed to find user with id ${userId}`);
        }
        return foundUser;
    }

    addNewUser(userData: { login: string, firstname: string, lastname: string, email: string }): void {
        if ( this.users.find(user => user.login === userData.login) ) {
            throw new Error(`Login ${userData.login} déjà utilisé`);
        }

        const newUser = new User(userData.firstname, userData.lastname, userData.login).withEmail(userData.email);
        if ( this.users.find(user => user.id === newUser.id) ) {
            throw new Error(`ID ${newUser.id} déjà utilisé`);
        }
        this.users.push(newUser);
        console.log(`Nouvel utilisateur ${newUser.login} ajouté`);
    }
}