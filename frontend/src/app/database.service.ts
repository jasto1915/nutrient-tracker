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

  getNutrientGoalAndProgress(){
    let url = API_URL + "/user/getNutrientGoalAndProgress";
    return this.http.get(url)
  }

  getDailyMealProgress(){
    let url = API_URL + "/user/getMealProgress";
    return this.http.get(url)
  }

  nextDay(){
    let url = API_URL + "/user/nextDay";
    return this.http.post(url,{},httpOptions)
  }

  getMealHistory(){
    let url = API_URL + "/user/getMealHistory";
    return this.http.get(url)
  }


}
