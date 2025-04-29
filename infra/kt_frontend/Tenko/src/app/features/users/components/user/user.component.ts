import { Component, inject, Input, OnDestroy, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject, takeUntil } from 'rxjs';

import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { HeaderService } from '../../../../core/services/header.service';
import { getDisplayName } from '../../utils/user-utils';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy{
  private userService = inject(UsersService);
  private headerService = inject(HeaderService);
  private destroy$ = new Subject<void>();

  user$!: Observable<User>;
  
  @Input()
  set id(userId: string) {
    this.user$ = this.userService.getUserFromIdentifier('id', userId);
  }
  
  ngOnInit(): void {

    this.user$.pipe(
      map(user => getDisplayName(user.firstname, user.lastname)),
      takeUntil(this.destroy$)
    ).subscribe(
      displayName => this.headerService.setSubtitle(displayName)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
