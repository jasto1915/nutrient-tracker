import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

const API_URL = "/api/external-api";


@Injectable({
  providedIn: 'root'
})
export class ExternalAPIService {

  constructor(private http: HttpClient) { }

  parseLanguage(data:any){
    let url = API_URL + "/freeform-input/parse"
    console.log("sent")
    return this.http.post(url,data,httpOptions);
  }

}
