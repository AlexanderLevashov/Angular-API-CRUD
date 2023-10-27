import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { UserAddEditComponent } from "../user-add-edit/user-add-edit.component";
import { UserService } from "../../services/user.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { MatFormField } from "@angular/material/form-field";
import { User } from "../../interfaces/user";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {

  displayedColumns: string[] = [
    'contractNo',
    'firstName',
    'secondName',
    'email',
    'login',
    'passwordText',
    'country',
    'course',
    'passed',
    'homework',
    'company',
    'startDate',
    'endDate',
    //'actions'
  ];
  dataSource: MatTableDataSource<User>
  //dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog,
              private _userService: UserService,
              private  http: HttpClient,
              private paginatorIntl: MatPaginatorIntl) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    //this._userService.getUserList();
    this._userService.getUserList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
      },
      error: console.log,
    });
    this.paginatorIntl.itemsPerPageLabel = "Элементов на странице:";
    this.paginatorIntl.nextPageLabel = "Следующая страница";
    this.paginatorIntl.previousPageLabel = "Предыдущая страница";
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `Отображено 0 из ${length}`;
      }
      const startIndex = page * pageSize + 1;
      const endIndex = Math.min(startIndex + pageSize - 1, length);
      return `Отображение ${startIndex} - ${endIndex} из ${length}`;
    };
  }

  openUserAddEditForm() {
    this._dialog.open(UserAddEditComponent);
  }

  // getUserList() {
  //   this._userService.getUserList().subscribe({
  //     next: (res) => {
  //       this.dataSource = new MatTableDataSource(res);
  //       this.dataSource.paginator = this.paginator;
  //
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: console.log,
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
