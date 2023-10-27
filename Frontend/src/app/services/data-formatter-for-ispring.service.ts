import { Injectable } from '@angular/core';
import { FormBuilder } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class DataFormatterForIspringService {

  constructor(private _fb: FormBuilder) { }

  formatDataForIspring(formData: any) : any {
    const formattedDataForIspring = {
      userProfile: [
        {
          id: formData.id,
          userId: formData.id,
          role: ["learner"],
          roleId: [""],
          departmentId: formData.department,
          status: ["1"],
          fields: [
            {
              field: [
                {
                  name: ["login"],
                  value: formData.login
                },
                {
                  name: ["email"],
                  value: formData.email
                },
                {
                  name: ["first_name"],
                  value: formData.firstName
                },
                {
                  name: ["last_name"],
                  value: formData.secondName
                },
                {
                  name: ["country_id"],
                  value: formData.country,
                },
                {
                  name: ["phone"],
                  value: ""
                },
                {
                  name: ["job_title"],
                  value: ""
                },
                {
                  name: ["about_me"],
                  value: ""
                },
                {
                  name: ["password"],
                  value: formData.passwordText
                },
              ],
            },
          ],
          addedDate: [formData.addedDate],
          userRoles: [
            {
              userRole: [
                {
                  roleId: [""],
                  roleType: [""],
                },
              ],
            },
          ],
          lastLoginDate: [formData.lastLoginDate],
          subordination: [
            {
              subordinationType: ["no_supervisor"],
            }
          ],
          coSubordination: [
            {
              subordinationType: ["no_supervisor"],
            }
          ]
        }
      ]
    }
    return formattedDataForIspring;
  };
}
