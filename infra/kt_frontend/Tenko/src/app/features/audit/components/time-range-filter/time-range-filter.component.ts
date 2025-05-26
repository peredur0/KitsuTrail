import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatTimepickerModule } from '@angular/material/timepicker'

import { TimeRangeFilter } from '../../models/filter.model';


@Component({
  selector: 'app-time-range-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule
  ],
  templateUrl: './time-range-filter.component.html',
  styleUrl: './time-range-filter.component.scss'
})
export class TimeRangeFilterComponent implements OnInit{
  timeRangeForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<TimeRangeFilterComponent>);
  private formBuilder = inject(FormBuilder);
  private timeRangeData: TimeRangeFilter = inject(MAT_DIALOG_DATA);


  ngOnInit(): void {
    const [startDateData, startTimeData] = this.timeRangeData.start.split(' '); 
    const [endDateData, endTimeData] = this.timeRangeData.end.split(' '); 

    const [startHours, startMinutes, startSeconds] = startTimeData.split(':');
    let curStartTime = new Date();
    curStartTime.setHours(Number(startHours), Number(startMinutes), Number(startSeconds));
    
    const [endHours, endMinutes, endSeconds] = endTimeData.split(':');
    let curEndTime = new Date();
    curEndTime.setHours(Number(endHours), Number(endMinutes), Number(endSeconds));
    
    this.timeRangeForm = this.formBuilder.group({
      startDate: [startDateData, Validators.required],
      endDate: [endDateData, Validators.required],
      startTime: [curStartTime, Validators.required],
      endTime: [curEndTime, Validators.required]
    }, { validators: this.timeRangeValidator });
  }

  timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startDate && endDate && startTime && endTime) {
      const start = new Date(startDate);
      const startTimeTmp = new Date(startTime);
      start.setHours(startTimeTmp.getHours(), startTimeTmp.getMinutes(), 0, 0)

      const end = new Date(endDate);
      const endTimeTmp = new Date(endTime)
      end.setHours(endTimeTmp.getHours(), endTimeTmp.getMinutes(), 0, 0);

      if (start > end) {
        return { invalidRange: true };
      }
    }
    return null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const newStartDate = new Date(this.timeRangeForm.get('startDate')?.value);
    const newStartTime = new Date(this.timeRangeForm.get('startTime')?.value);
    
    const newEndDate = new Date(this.timeRangeForm.get('endDate')?.value);
    const newEndTime = new Date(this.timeRangeForm.get('endTime')?.value);

    this.dialogRef.close({
      start: formatDateTime(newStartDate, newStartTime),
      end: formatDateTime(newEndDate, newEndTime),
    });
  }
}

function formatDateTime(date: Date, time: Date): string {
  const padding = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = padding(date.getMonth() + 1);
  const day = padding(date.getDate());
  const hours = padding(time.getHours());
  const minutes = padding(time.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}
