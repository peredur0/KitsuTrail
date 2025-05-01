import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { HeaderService } from '../../../../core/services/header.service';
import { ProvidersService } from '../../services/providers.service';
import { Provider } from '../../models/providers.model';
import { ProviderCardComponent } from '../provider-card/provider-card.component';

@Component({
  selector: 'app-identities-list',
  imports: [
    CommonModule,
    ProviderCardComponent
  ],
  templateUrl: './identities-list.component.html',
  styleUrl: './identities-list.component.scss'
})
export class IdentitiesListComponent implements OnInit {
  private headerService = inject(HeaderService);
  private providersService = inject(ProvidersService);

  idpList$!: Observable<Provider[]>;

  ngOnInit(): void {
    this.headerService.setSubtitle("Identités");
    this.idpList$ = this.providersService.getProviders('idp');
  }
}
