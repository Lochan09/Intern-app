import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import * as Papa from 'papaparse';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
})
export class UserComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  userForm: FormGroup;
  myGroup: FormGroup;
  originalData: any[] = [];
  filterForm: FormGroup;
  displayedColumns: string[] = [
    'select',
    'id',
    'productName',
    'description',
    'category',
    'status',
    'createdDate',
    'actions',
  ];
  existingId: string[] = [];
  showFilters: boolean = false;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dataService: DataService
  ) {
    this.userForm = this.fb.group({
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
    this.loadPosts();
    window.addEventListener('scroll', this.onScroll);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = (): void => {
    const operationsContainer = document.getElementById('operationsContainer');
    if (window.scrollY > 100) {
      operationsContainer!.style.top = '-60px';
    } else {
      operationsContainer!.style.top = '0';
    }
  };

  loadPosts(): void {
    this.dataService.getPosts().subscribe((data: any) => {
      this.dataSource.data = data;
      this.originalData = data;
      this.updateExistingId();
    });
  }

  updateExistingId(): void {
    this.existingId = this.dataSource.data.map((item) => item.id);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '1000px',
      data: {
        existingId: this.existingId,
        productName: '',
        description: '',
        category: '',
        status: '',
        createdDate: new Date(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.addPost(result).subscribe({
          next: (newPost) => {
            console.log('Add successful');
            this.dataSource.data.push(newPost);
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
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '1000px',
      data: { ...element, existingId: this.existingId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.updatePost(result).subscribe({
          next: () => {
            console.log('Update successful');
            const index = this.dataSource.data.findIndex(
              (item) => item.id === result.id
            );
            if (index !== -1) {
              this.dataSource.data[index] = result;
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
    this.dataService.deletePost(element.id).subscribe({
      next: () => {
        this.loadPosts();
      },
      error: (err) => console.error(err),
    });
  }

  deleteSelected(): void {
    const selectedIds = this.selection.selected.map((item) => item.id);
    selectedIds.forEach((id) => {
      this.dataService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (err) => console.error(err),
      });
    });
    this.selection.clear();
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
    const startDate = filter.startDate ? new Date(filter.startDate) : null;
    const endDate = filter.endDate ? new Date(filter.endDate) : null;

    this.dataSource.data = this.originalData.filter((item: any) => {
      const matchesSearchTerm =
        item.category.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm) ||
        item.createdDate.toLowerCase().includes(searchTerm);

      const matchesStatus = status ? item.status === status : true;

      const itemDate = new Date(item.createdDate);
      const matchesDateRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesSearchTerm && matchesStatus && matchesDateRange;
    });
    this.dataSource._updateChangeSubscription();
  }

  toggleFilters(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '300px',
      position: {
        top: '100px',
        right: '20px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applyFilterWithDialog(result);
      }
    });
  }

  applyFilterWithDialog(filter: any): void {
    const searchTerm = this.myGroup
      .get('searchTerm')
      ?.value.trim()
      .toLowerCase();
    const status = filter.status;
    const startDate = filter.startDate ? new Date(filter.startDate) : null;
    const endDate = filter.endDate ? new Date(filter.endDate) : null;

    this.dataSource.data = this.originalData.filter((item: any) => {
      const matchesSearchTerm =
        item.category.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm) ||
        item.createdDate.toLowerCase().includes(searchTerm);

      const matchesStatus = status ? item.status === status : true;

      const itemDate = new Date(item.createdDate);
      const matchesDateRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesSearchTerm && matchesStatus && matchesDateRange;
    });
    this.dataSource._updateChangeSubscription();
  }

  sortDataByHeader(column: string): void {
    let sortedData = [...this.originalData];

    if (column === 'status') {
      sortedData.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') {
          return -1;
        } else if (a.status !== 'completed' && b.status === 'completed') {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (column === 'createdDate') {
      sortedData.sort((a, b) => {
        return (
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        );
      });
    }

    this.dataSource.data = sortedData.map((item, index) => ({
      ...item,
      id: this.originalData[index].id,
    }));
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
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const csvData = e.target.result as string;
          Papa.parse(csvData, {
            header: true,
            complete: (result) => {
              this.importData(result.data);
            },
          });
        }
      };
      reader.readAsText(file);
    }
  }

  importData(data: any[]): void {
    console.log('Imported Data:', data);
    this.dataSource.data = [...this.dataSource.data, ...data];
    this.originalData = [...this.originalData, ...data];
    this.updateExistingId();
    this.dataSource._updateChangeSubscription();

    this.dataService.addPost(data).subscribe({
      next: () => {
        console.log('Data saved successfully');
      },
      error: (err) => {
        console.error('Error saving data', err);
      },
    });
  }

  exportData() {
    const csvData = this.convertToCSV(this.dataSource.data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'exported_data.csv');
  }

  convertToCSV(data: any[]): string {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map((row) => {
        return Object.values(row)
          .map((value) => {
            return typeof value === 'string'
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(',');
      })
      .join('\r\n');
  }
}
