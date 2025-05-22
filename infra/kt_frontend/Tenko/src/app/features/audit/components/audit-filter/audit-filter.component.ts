import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
import { MatChipInputEvent, MatChipsModule}  from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';


import { FilterFormData } from '../../models/filter.model';

@Component({
  selector: 'app-audit-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './audit-filter.component.html',
  styleUrl: './audit-filter.component.scss'
})
export class AuditFilterComponent implements OnInit{
  filterForm!: FormGroup;
  availableActions = ['access', 'authentication', 'create_user'];
  availableCategories = ['autorisation', 'management'];
  availableResults = ['success', 'fail'];
  availableProviderTypes = ['sp', 'idp'];
  availableProviderProtocols = ['Internal', 'LDAP', 'OAuth2', 'OIDC', 'SAML'];
  
  readonly dialogRef = inject(MatDialogRef<AuditFilterComponent>);
  private formBuilder = inject(FormBuilder);
  private filterData: FilterFormData | null = inject(MAT_DIALOG_DATA);

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly filterLogins = signal<string[]>([]);
  readonly providerNames = signal<string[]>([])

  ngOnInit(): void {
    this.filterLogins.set(this.filterData?.user_login ?? []);
    this.providerNames.set(this.filterData?.provider_name ?? []);

    this.filterForm = this.formBuilder.group({
      categories: [this.filterData?.categories ?? []],
      actions: [this.filterData?.actions ?? []],
      results: [this.filterData?.results ?? []],
      trace_id: [this.filterData?.trace_id ?? []],
      user_login: [this.filterLogins()],
      user_id: [this.filterData?.user_id ?? []],
      provider_name: [this.providerNames()],
      provider_types: [this.filterData?.provider_type ?? []],
      provider_protocols: [this.filterData?.provider_protocol ?? []],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFilter(): void {
    this.dialogRef.close({
      categories: this.filterForm.get('categories')?.value,
      actions: this.filterForm.get('actions')?.value,
      results: this.filterForm.get('results')?.value,
      trace_id: this.filterForm.get('trace_id')?.value,
      user_login: this.filterForm.get('user_login')?.value,
      user_id: this.filterForm.get('user_id')?.value,
      provider_name: this.filterForm.get('provider_name')?.value,
      provider_type: this.filterForm.get('provider_types')?.value,
      provider_protocol: this.filterForm.get('provider_protocols')?.value,
    });
  }

  onReset(): void {
    this.filterData = null;
    this.filterForm.reset();
  }

  addElement(event: MatChipInputEvent, field: string): void {
    const value = (event.value || '').trim();

    if (value) {
      if (field === 'login') {
        this.filterLogins.update(logins => [...logins, value]);
        this.filterForm.get('user_login')?.setValue(this.filterLogins());
      } else if (field === 'provider') {
        this.providerNames.update(names => [...names, value]);
        this.filterForm.get('provider_name')?.setValue(this.providerNames());
      } else {
        throw new Error(`Unknown field ${field} - trying to insert ${value}`)
      }
    }
    event.chipInput!.clear();
  }

  removeElement(value: string, field: string): void {
    if (field === 'login'){
      this.filterLogins.update(logins => logins.filter(l => l !== value));
      this.filterForm.get('user_login')?.setValue(this.filterLogins());
    } else if (field === 'provider') {
      this.filterLogins.update(names => names.filter(n => n !== value));
      this.filterForm.get('provider_name')?.setValue(this.providerNames());
    } else {
        throw new Error(`Unknown field ${field} - trying to insert ${value}`)
    }
  }
}
