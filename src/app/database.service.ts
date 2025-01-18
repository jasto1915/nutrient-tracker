import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

const API_URL = "/api/database"

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient) { }


  addMeal(meal: any){
    let url = API_URL + "/meal/add";
    return this.http.post(url,meal,httpOptions)
  }

  addUserInfo(info:any){
    let url = API_URL + "/user/add";
    return this.http.post(url,info,httpOptions)
  }

  getDailyNutrientGoal(){
    let url = API_URL + "/user/getNutrientGoal";
    return this.http.get(url)
  }


}
