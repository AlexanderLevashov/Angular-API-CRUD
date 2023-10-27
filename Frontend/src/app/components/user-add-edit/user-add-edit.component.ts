import { Component } from '@angular/core';
import { countries } from "../../interfaces/countries";
import { departments } from "../../interfaces/departments";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { DialogRef } from "@angular/cdk/dialog";
import { DataFormatterService } from "../../services/data-formatter.service";
import { DataFormatterForIspringService } from "../../services/data-formatter-for-ispring.service";

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent {

  userForm: FormGroup;
  createdDate: Date = new Date();
  updatedDate: Date = new  Date();

  selectedCountry: string | undefined;
  selectedDepartmentId: string | undefined;
  countries = countries;
  departments = departments;

  constructor(private _fb: FormBuilder,
              private _userService: UserService,
              private _dialogRef: DialogRef<UserAddEditComponent>,
              private _dataFormatterService: DataFormatterService,
              private _ispringDataFormatterService: DataFormatterForIspringService) {
    this.userForm = this._fb.group( {
      //id: '',
      contractNo: '',
      firstName: '',
      secondName: '',
      email:'',
      login:'',
      passwordText:'',
      country:'',
      department:'',
      course:'',
      passed:'',
      homework:'',
      company:'',
      startDate:'',
      endDate:'',
      //actions:''
    });
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      // Преобразуйте данные из формы в требуемый формат JSON перед отправкой
      // Вызов через сервис
      const formattedData = this._dataFormatterService.formatData(this.userForm.value);
      this._userService.addUser(formattedData).subscribe({
        next: (val: any) => {
          // Обработка успешного ответа
          const formattedDataForIspring = this._ispringDataFormatterService.formatDataForIspring(this.userForm.value);
          this._userService.addUserForIspring(formattedDataForIspring).subscribe({
            next: (val: any) => {
            }
          });
          this._dialogRef.close();
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }
}
