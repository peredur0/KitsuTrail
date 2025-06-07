import { Component, Input } from '@angular/core';

import { ProvidersActivities, UsersActivities, ChartData, UsersSummary } from '../../models/stats.model';
import { LineTimestampAuthAccessComponent } from '../charts/line-timestamp-auth-access/line-timestamp-auth-access.component';
import { BarProvidersSuccessFailComponent } from '../charts/bar-providers-success-fail/bar-providers-success-fail.component';
import { RadarProtocolsComponent } from '../charts/radar-protocols/radar-protocols.component';
import { PieFailureReasonsComponent } from '../charts/pie-failure-reasons/pie-failure-reasons.component';
import { TableUsersSummaryComponent } from '../charts/table-users-summary/table-users-summary.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    LineTimestampAuthAccessComponent,
    BarProvidersSuccessFailComponent,
    RadarProtocolsComponent,
    PieFailureReasonsComponent,
    TableUsersSummaryComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  @Input() usersActivity!: UsersActivities;
  @Input() providersActivity!: ProvidersActivities;
  @Input() protocolsActivity!: ChartData;
  @Input() failureActivity!: ChartData;
  @Input() usersSummary!: UsersSummary;
}
