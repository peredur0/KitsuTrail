import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit{
  
  menu!: Menu[];
  constructor(private menuService: MenuService){}


  ngOnInit(): void {
    this.menu = this.menuService.getMenu();
  }
}
