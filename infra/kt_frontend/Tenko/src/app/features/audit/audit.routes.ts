import { Routes } from "@angular/router";

import { AuditLogListComponent } from "./components/audit-logbook/audit-logbook.component";

export const auditRoutes: Routes = [
    { path: 'logs', component: AuditLogListComponent}
]