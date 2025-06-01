import { Component, Input } from '@angular/core';
import { CurrentState } from '../../models/stats.model';

@Component({
  selector: 'app-current-state',
  imports: [
  ],
  templateUrl: './current-state.component.html',
  styleUrl: './current-state.component.scss'
})
export class CurrentStateComponent {
  @Input() state!: CurrentState;
}
