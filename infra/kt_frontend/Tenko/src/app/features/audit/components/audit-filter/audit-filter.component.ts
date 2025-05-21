import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
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
  ],
  templateUrl: './audit-filter.component.html',
  styleUrl: './audit-filter.component.scss'
})
export class AuditFilterComponent implements OnInit{
  filterForm!: FormGroup;
  availableActions = ['access', 'authentication', 'create_user'];
  availableCategories = ['autorisation', 'management'];
  
  readonly dialogRef = inject(MatDialogRef<AuditFilterComponent>);
  private formBuilder = inject(FormBuilder);
  private filterData: FilterFormData | null = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this. filterForm = this.formBuilder.group({
      actions: [this.filterData?.actions ?? []],
      categories: [this.filterData?.categories ?? []]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFilter(): void {
    const actions = this.filterForm.get('actions')?.value;
    const categories = this.filterForm.get('categories')?.value;
    this.dialogRef.close({
      actions: actions,
      categories: categories
    });
  }

  onReset(): void {
    this.filterData = null;
    this.filterForm.reset();
    this.dialogRef.close({
      actions: [],
      categories: []
    });
  }
}
