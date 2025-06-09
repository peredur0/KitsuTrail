import { Routes } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'stats', loadChildren: () => import('./features/stats/stats.route').then(m => m.statsRoutes) },
    { path: 'audit', loadChildren: () => import('./features/audit/audit.routes').then(m => m.auditRoutes) },
    { path: 'providers', loadChildren: () => import('./features/providers/providers.routes').then(m => m.providersRoutes) },
    { path: 'users', loadChildren: () => import('./features/users/users.routes').then(m => m.usersRoutes) },
    { path: '', component: LandingPageComponent }
    //{ path: '**', component: PageNotFoundComponent }
];
