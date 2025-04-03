import { Component, inject, Input, OnInit } from '@angular/core';

import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  private userService = inject(UsersService);
  private headerService = inject(HeaderService);

  user!: User;

  @Input()
  set id(userId: string) {
    this.user = this.userService.getUserFromIdentifier('id', userId);
  }

  ngOnInit(): void {
    this.headerService.setSubtitle(this.user.getDisplayName())
  }
}
