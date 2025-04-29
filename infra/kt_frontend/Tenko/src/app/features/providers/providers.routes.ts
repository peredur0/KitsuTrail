import { Routes } from "@angular/router";
import { IdentitiesListComponent } from "./components/identities-list/identities-list.component";
import { ServicesListComponent } from "./components/services-list/services-list.component";

export const providersRoutes: Routes = [
    { path: 'idp', component: IdentitiesListComponent },
    { path: 'sp', component: ServicesListComponent }
]