import { Component, Input } from '@angular/core';
import { Provider } from '../../models/providers.model';

@Component({
  selector: 'app-provider-card',
  imports: [],
  templateUrl: './provider-card.component.html',
  styleUrl: './provider-card.component.scss'
})
export class ProviderCardComponent {
  @Input() provider!: Provider
}
