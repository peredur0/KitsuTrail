import { Routes } from "@angular/router";

import { AuditLogBookComponent } from "./components/audit-logbook/audit-logbook.component";

export const auditRoutes: Routes = [
    { path: 'logs', component: AuditLogBookComponent}
]