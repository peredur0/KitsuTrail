import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { User } from '../../models/user.model';
import { getDisplayName } from '../../utils/user-utils';

@Component({
  selector: 'app-user-card',
  imports: [
    CommonModule
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {
  private router = inject(Router)
  displayName!: string;

  @Input() user!: User;
  
  ngOnInit(): void {
    this.displayName = getDisplayName(this.user.firstname, this.user.lastname);
  }

  onUserCardClick(): void {
    this.router.navigate([this.router.url, this.user.id])
  }
}
