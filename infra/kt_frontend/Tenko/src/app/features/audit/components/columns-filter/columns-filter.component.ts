import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ColumnSelect } from '../../models/columns.model';


@Component({
  selector: 'app-columns-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatCheckboxModule
  ],
  templateUrl: './columns-filter.component.html',
  styleUrl: './columns-filter.component.scss'
})
export class ColumnsFilterComponent implements OnInit{
  availableColumns: ColumnSelect[] = [
    {id: 'timestamp', name: 'Date/heure'},
    {id: 'audit_id', name: 'Audit ID'},
    {id: 'user_id', name: 'ID Utilisateur'},
    {id: 'user_login', name: 'Login'},
    {id: 'provider_type', name: 'Type fournisseur'},
    {id: 'provider_id', name: 'ID Fournisseur'},
    {id: 'provider_name', name: 'Fournisseur'},
    {id: 'provider_protocol', name: 'Protocol'},
    {id: 'trace_id', name: 'Trace'},
    {id: 'source_ip', name: 'IP'},
    {id: 'source_admin', name: 'Initiateur'},
    {id: 'category', name: "Type d'évènement"},
    {id: 'action', name: 'Action'},
    {id: 'result', name: 'Résultat'},
    {id: 'reason', name: 'Raison'},
    {id: 'info', name: "Plus d'info"}
  ];

  columnForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<ColumnsFilterComponent>);
  private formBuilder = inject(FormBuilder);
  private columnsData: string[] = inject(MAT_DIALOG_DATA) ?? [];

  ngOnInit(): void {
    const controls: Record<string, FormControl<boolean|null>> = this.availableColumns.reduce(
      (acc, column) => {
        acc[column.id] = new FormControl(!!this.columnsData.includes(column.id));
        return acc;
      },
      {} as Record<string, FormControl<boolean|null>>
    );
    this.columnForm = this.formBuilder.group(controls);    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const selectedColumns = Object.entries(this.columnForm.value)
      .filter(([_, isChecked]) => isChecked)
      .map(([columnId]) => columnId)    
    
      this.dialogRef.close(selectedColumns);
  }

  onReset(): void {
    const defaultColumns = [
      'timestamp', 'action', 'user_login', 'result'
    ];
    this.columnForm.reset();
    this.dialogRef.close(defaultColumns);
  }
}
