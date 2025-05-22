import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from '../../data.service';
import { AdminDialogComponent } from '../admin-dialog/admin-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import * as Papa from 'papaparse';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { GenaiComponent } from '../genai/genai.component';
import { ImagetotextComponent } from '../imagetotext/imagetotext.component';
import { AisupportComponent } from '../aisupport/aisupport.component';

@Component({
  selector: 'app-user',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    RouterModule,
    AdminDashboardComponent,
    GenaiComponent,
    ImagetotextComponent,
    AisupportComponent,
  ],
})
export class AdminComponent implements OnInit {
  selectedTabIndex = 0;
  adminForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  originalData: any[] = [];
  myGroup: FormGroup;
  filterForm: FormGroup;
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'status',
    'department',
    'actions',
  ];
  existingId: string[] = [];
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      id: [''],
      productName: [''],
      description: [''],
      category: [''],
      createdDate: [''],
      status: [''],
    });

    this.myGroup = this.fb.group({
      searchTerm: [''],
    });

    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loaddata();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onTabChanged(event: any): void {
    if (event.index === 1) {
      this.navigateTo('admin-dashboard');
    } else if (this.selectedTabIndex === 2) {
      this.navigateTo('genai');
    } else if (this.selectedTabIndex === 3) {
      this.navigateTo('imagetotext');
    } else if (this.selectedTabIndex === 4) {
      this.navigateTo('aisupport');
    }
  }

  loaddata(): void {
    this.dataService.getData().subscribe((data: any) => {
      this.dataSource.data = data;
      this.updateExistingId();
      this.sortDataSource();
    });
  }

  updateExistingId(): void {
    this.existingId = this.dataSource.data.map((item) => item.id);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '1000px',
      data: {
        existingId: this.existingId,
        name: '',
        email: '',
        status: '',
        department: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.addData(result).subscribe({
          next: (newPost) => {
            console.log('Add successful');
            this.dataSource.data.push(newPost);
            this.sortDataSource();
            this.updateExistingId();
          },
          error: (err) => {
            console.error('Add failed', err);
          },
        });
      }
    });
  }

  edit(element: any): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '1000px',
      data: { ...element, existingId: this.existingId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.updateData(result).subscribe({
          next: () => {
            console.log('Update successful');
            const index = this.dataSource.data.findIndex(
              (item) => item.id === result.id
            );
            if (index !== -1) {
              this.dataSource.data[index] = result;
              this.sortDataSource();
              this.updateExistingId();
            }
          },
          error: (err) => {
            console.error('Update failed', err);
          },
        });
      }
    });
  }

  delete(element: any): void {
    this.dataService.deleteData(element.id).subscribe({
      next: () => {
        this.loaddata();
      },
      error: (err) => console.error(err),
    });
  }

  deleteSelected(): void {
    const selectedIds = this.selection.selected.map((item) => item.id);
    selectedIds.forEach((id) => {
      this.dataService.deleteData(id).subscribe({
        next: () => {
          this.loaddata();
        },
        error: (err) => console.error(err),
      });
    });
    this.selection.clear();
  }

  private sortDataSource(): void {
    this.dataSource.data.sort((a, b) => a.id - b.id);
    this.dataSource._updateChangeSubscription();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  applyFilter(): void {
    const filter = this.filterForm.value;
    const searchTerm = this.myGroup
      .get('searchTerm')
      ?.value.trim()
      .toLowerCase();
    const status = filter.status;
    this.dataSource.data = this.originalData.filter((item: any) => {
      const matchesSearchTerm =
        item.department.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm);
      const matchesStatus = status ? item.status === status : true;

      return matchesSearchTerm && matchesStatus;
    });
    this.dataSource._updateChangeSubscription();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected(): boolean {
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < this.dataSource.data.length;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  toggleSelection(row: any): void {
    this.selection.toggle(row);
  }
}
