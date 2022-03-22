import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ITaskModel } from '../app.component';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  data!: ITaskModel;
  readonly APIUrl = "http://localhost:3000/api/datalist";
  API_URL = '';
  constructor(private http: HttpClient) { }
  getAccountData() {
    return this.http.get(this.APIUrl);
  }
  saveAccountData(newData: any) {
    ///JSON.stringify(newData)
    return this.http.post('http://localhost:3000/api/postData', newData);
  }
  UpdateAccountData(newData: any) {
    debugger
    var id = newData.TaskID;
    var REST_API = 'http://localhost:3000/api'
    this.API_URL = `${REST_API}/update/${id}`;
    return this.http.put(this.API_URL, newData);
  }
  DeleteAccountData(newData: any) {
    debugger
    console.log(newData);
    var ExistData = newData[0]
    var id = ExistData.TaskID;
    var REST_API = 'http://localhost:3000/api'
    this.API_URL = `${REST_API}/delete/${id}`;
    return this.http.delete(this.API_URL, ExistData);
  }
  AddNewCol(newData: any) {
    console.log(newData);
    return this.http.post('http://localhost:3000/api/AddCol', newData);
  }
  EditNewCol(newData: any) {
    console.log(newData);
    return this.http.post('http://localhost:3000/api/EditCol', newData);
  }
  DelCol(newData: any) {
    console.log(newData);
    var Name = newData.inputValue;
    var REST_API = 'http://localhost:3000/api'
    this.API_URL = `${REST_API}/ColDelete/${Name}`;
    return this.http.delete(this.API_URL, newData);
  }
}

