import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-card',
  imports: [
    CommonModule
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  private router = inject(Router)

  @Input() user!: User;

  onUserCardClick(): void {
    this.router.navigate([this.router.url, this.user.id])
  }
}
