import { Component, inject, OnInit } from '@angular/core';

import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-audit-log-list',
  imports: [],
  templateUrl: './audit-log-list.component.html',
  styleUrl: './audit-log-list.component.scss'
})
export class AuditLogListComponent implements OnInit {
  private headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setSubtitle("Journal d'audit")
  }
}
