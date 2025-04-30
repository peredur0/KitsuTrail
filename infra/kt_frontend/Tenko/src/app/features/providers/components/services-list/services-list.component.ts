import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { HeaderService } from '../../../../core/services/header.service';
import { ProvidersService } from '../../services/providers.service';
import { Provider } from '../../models/providers.model';
import { ProviderCardComponent } from '../provider-card/provider-card.component';

@Component({
  selector: 'app-services-list',
  imports: [
    CommonModule,
    ProviderCardComponent
  ],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  private headerService = inject(HeaderService);
  private providersService = inject(ProvidersService);

  spList$!: Observable<Provider[]>;

  ngOnInit(): void {
    this.headerService.setSubtitle("Services");
    this.spList$ = this.providersService.getProviders('sp');
  }
}
