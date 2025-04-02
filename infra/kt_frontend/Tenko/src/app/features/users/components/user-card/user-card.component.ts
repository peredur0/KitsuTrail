import { Component, Input } from '@angular/core';
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

  @Input() user!: User;

  constructor(private router: Router){}

  onUserCardClick(): void {
    console.log(this.user.id);
    //this.router.navigateByUrl(`users/${this.user.id}`)
  }

}
