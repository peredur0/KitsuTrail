import { Component } from '@angular/core';

import { MenuService } from '../../../../core/services/menu.service';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  constructor(
    private menuService: MenuService,
    private headerService: HeaderService) {
      this.headerService.setTitle(this.menuService.getLabel('title', 'users'))
  }
}
