import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    OverlayModule,
  ],
})
export class FilterDialogComponent implements AfterViewInit {
  filterForm: FormGroup;

  @ViewChild('startDatePicker') startDatePicker!: MatDatepicker<Date>;
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    private overlay: Overlay,
    private overlayContainer: OverlayContainer
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      startDate: [null],
      endDate: [null],
    });
  }

  ngAfterViewInit() {}

  applyFilter(): void {
    console.log('Filtering with:', this.filterForm.value);
    this.dialogRef.close(this.filterForm.value);
  }
}
