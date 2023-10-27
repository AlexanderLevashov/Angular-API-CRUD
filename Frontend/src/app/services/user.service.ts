import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  addUser(data: any) {
    return this._http.post('http://localhost:4000/issues', data);
  }

  addUserForIspring(data: any) {
    return this._http.post('http://localhost:4000/issuesForIspring', data)
  }

  getUserList(): Observable<any> {
    return this._http.get('http://localhost:4000/issues')
  }
}

