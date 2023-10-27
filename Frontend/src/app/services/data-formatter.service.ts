import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {

  constructor(private _fb: FormBuilder) { }

  formatData(formData: any): any {
    const formattedData = {
          id: formData.id,
          project: {
            id: 1,
            name: "Учебные курсы"
          },
          tracker: {
            id: 8,
            name: "Анкеты студентов"
          },
          status: {
            id: 1,
            name: "Новая",
            is_closed: false
          },
          priority: {
            id: 2,
            name: "Нормальный"
          },
          author: {
            id: 1,
            name: "Alexander Levashov"
          },
          subject: formData.secondName + ' ' +  formData.firstName,
          description: null,
          start_date: format(new Date(formData.startDate), 'yyyy-MM-dd'),
          due_date: null,
          done_ratio: 0,
          is_private: false,
          estimated_hours: null,
          total_estimated_hours: null,
          spent_hours: 0,
          total_spent_hours: 0,
          custom_fields: [
            {
              id: 1,
              name: "Дата завершения",
              value: format(new Date(formData.endDate), 'yyyy-MM-dd')
            },
            {
              id: 2,
              name: "Компания",
              value: formData.company
            },
            {
              id: 3,
              name: "Логин",
              value: formData.login
            },
            {
              id: 5,
              name: "Email клиента",
              value: formData.email
            },
            {
              id: 8,
              name: "Оплата",
              value: "1"
            },
            {
              id: 10,
              name: "Пройден",
              value: formData.passed === 'yes' ? '1' : '0'
            },
            {
              id: 11,
              name: "Курс",
              value: "Базовый"
            },
            {
              id: 12,
              name: "Дата семинара",
              value: format(new Date(formData.endDate), 'yyyy-MM-dd')
            },
            {
              id: 13,
              name: "Договор",
              value: formData.contractNo
            },
            {
              id: 14,
              name: "Без ДЗ",
              value: formData.homework === 'yes' ? '1' : '0'
            },
            {
              id: 15,
              name: "Номер свидетельства",
              value: ""
            }
          ],
          created_on: formData.data,
          updated_on: formData.data,
          closed_on: null
    };
    return formattedData; // Возвращаем только первый элемент массива issues
  }
}
