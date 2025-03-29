import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { HeaderService } from '../../services/header.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit, OnDestroy {

  private routerSubscription!: Subscription;

  constructor(
    private menuService: MenuService,
    private headerService: HeaderService,
    private location: Location,
    private router: Router
  ){}

  title = computed(() => this.headerService.title());
  subtitle = computed(() => this.headerService.subtitle())

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const segments = event.urlAfterRedirects.split('/');
      this.headerService.setTitle(
        this.menuService.getLabel('title', segments[1])
      );
    });
  }

  ngOnDestroy(): void {
    if( this.routerSubscription ){
      this.routerSubscription.unsubscribe()
    }
  }

  goBack(): void {
    if ( window.history.length > 1 ) {
      this.location.back();
    }
  }
}
