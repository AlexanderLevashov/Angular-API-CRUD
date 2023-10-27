import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//#region Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserAddEditComponent } from './components/user-add-edit/user-add-edit.component';
//#endregion

//#region Modules
import { HttpClientModule } from "@angular/common/http";
//#endregion

//#region Angular Material
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatCardModule } from "@angular/material/card";

//#endregion

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    UserAddEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatOptionModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
