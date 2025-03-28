import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { MenuService } from '../../../../core/services/menu.service';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit{

  path!: string;

  constructor(
    private menuService: MenuService,
    private headerService: HeaderService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
      this.path = this.location.path()
      this.headerService.setTitle(this.menuService.getLabel('title', 'users'))
      this.headerService.setSubtitle('')
  }

}
