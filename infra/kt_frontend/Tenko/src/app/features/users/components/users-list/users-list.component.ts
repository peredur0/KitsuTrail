import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderService } from '../../../../core/services/header.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  imports: [],
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
    this.users = this.userService.getUsers()
  }
}
