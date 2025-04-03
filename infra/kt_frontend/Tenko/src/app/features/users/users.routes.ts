import { Routes } from "@angular/router";
import { UsersListComponent } from "./components/users-list/users-list.component";
import { UserComponent } from "./components/user/user.component";

export const usersRoutes: Routes = [
    { path: ':id', component: UserComponent},
    { path: '', component: UsersListComponent }
]