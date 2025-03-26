import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from "@angular/common";

import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UpperCasePipe
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit{
  
  menus!: Menu[];
  constructor(private menuService: MenuService){}


  ngOnInit(): void {
    this.menus = this.menuService.getMenu();
  }
}
