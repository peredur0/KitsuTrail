import { Component } from '@angular/core';

import { LineTimestampAuthAccessComponent } from '../charts/line-timestamp-auth-access/line-timestamp-auth-access.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    LineTimestampAuthAccessComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

}
