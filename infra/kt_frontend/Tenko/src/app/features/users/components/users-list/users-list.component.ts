import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit{

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {

    this.headerService.setSubtitle('');

  }
}
