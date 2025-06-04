import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { UsersActivities } from '../../../models/stats.model';

@Component({
  selector: 'app-line-timestamp-auth-access',
  imports: [],
  templateUrl: './line-timestamp-auth-access.component.html',
  styleUrl: './line-timestamp-auth-access.component.scss'
})
export class LineTimestampAuthAccessComponent implements OnChanges {
  @Input() data!: UsersActivities

  ngOnChanges(): void {
    if (!this.data) return;
    console.log(this.data.authentications.data);
    console.log(this.data.access.data);
    console.log(this.data.labels.data);
  }
}
