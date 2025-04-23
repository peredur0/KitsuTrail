import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  private userService = inject(UsersService);
  private headerService = inject(HeaderService);

  user$!: Observable<User>;

  @Input()
  set id(userId: string) {
    this.user$ = this.userService.getUserFromIdentifier('id', userId);
  }

  ngOnInit(): void {
    this.headerService.setSubtitle(`Update with displayName`)
  }
}
