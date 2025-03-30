import { Routes } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'users', loadChildren: () => import('./features/users/users.routes').then(m => m.usersRoutes)},
    { path: '', component: LandingPageComponent }
    //{ path: '**', component: PageNotFoundComponent }
];
