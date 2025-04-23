import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { HeaderService } from '../../../../core/services/header.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { UserCardComponent } from '../user-card/user-card.component';
import { NewUserComponent } from '../new-user/new-user.component';

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
  private headerService = inject(HeaderService);
  private userService = inject(UsersService);
  readonly dialog = inject(MatDialog);

  users$!: Observable<User[]>;

  ngOnInit(): void {
    this.headerService.setSubtitle('');
    this.users$ = this.userService.getUsers();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log("Fermeture avec un résultat ");
      }
    });
  }

}
