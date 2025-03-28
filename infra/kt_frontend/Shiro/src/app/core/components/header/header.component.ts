import { Component, signal, computed } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor(private headerService: HeaderService){}
  title = computed(() => this.headerService.title());
  subtitle = computed(() => this.headerService.subtitle())

}
