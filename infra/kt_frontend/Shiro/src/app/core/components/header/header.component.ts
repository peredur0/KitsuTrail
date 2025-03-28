import { Component, computed } from '@angular/core';
import { Location } from '@angular/common';

import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor(
    private headerService: HeaderService,
    private location: Location
  ){}

  title = computed(() => this.headerService.title());
  subtitle = computed(() => this.headerService.subtitle())

  goBack(): void {
    console.log(window.history.length);

    if (window.history.length > 1) {
      this.location.back();
    }
  }
}
