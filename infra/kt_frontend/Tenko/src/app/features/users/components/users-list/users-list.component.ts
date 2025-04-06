import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { HeaderService } from '../../../../core/services/header.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    UserCardComponent,
    MatButtonModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit{
  users!: User[];

  constructor(
    private headerService: HeaderService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.headerService.setSubtitle('');
    this.users = this.userService.getUsers();
  }

  openDialog(): void {
    console.log('foo')
  }

}
