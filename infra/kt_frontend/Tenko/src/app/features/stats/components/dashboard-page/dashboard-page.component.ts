import { Component, Input } from '@angular/core';

import { LineTimestampAuthAccessComponent } from '../charts/line-timestamp-auth-access/line-timestamp-auth-access.component';
import { UsersActivities } from '../../models/stats.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    LineTimestampAuthAccessComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  @Input() usersActivity!: UsersActivities;

}
