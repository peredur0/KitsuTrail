import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private users: User[] = [
        new User('Triss', 'Merigold', 'triss'),
        new User('Keira', 'Metz', 'kmetz').withEmail('km@mail.km'),
        new User('Yennefer', 'de VendenBerg', 'Raven').withEmail('ydv@mail.km'),
        new User('Geralt', 'de riv', 'gégé'),
        new User('Julian', 'pankratz', 'Jaskier').withEmail('barde@oxenfurt.me'),
        new User('Cirillia', 'Fiona', 'Ciri'),
        new User('Shani', 'F', 'shasha'),
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