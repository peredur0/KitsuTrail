import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private users: User[] = [
        new User('Triss', 'Merigold', 'triss'),
        new User('Keira', 'Metz', 'kmetz').withEmail('km@mail.km')
    ]

    getUsers(): User[] {
        return [...this.users]
    }

    getUserFromIdentifier(idType: 'login'|'id', userId: string): User {
        let foundUser: User | undefined;

        if (idType === 'id') {
            foundUser = this.users.find(user => user.id === userId);
        } else {
            foundUser = this.users.find(user => user.login === userId);
        }

        if ( !foundUser ) {
            throw new Error(`Failed to find user with id ${userId}`);
        }
        return foundUser;
    }
}