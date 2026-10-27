import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse, unwrap} from './api-response';
import {Meal} from './models/meal';
import {Suggestion} from './models/suggestion';

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

const API_URL = "/api/external-api";

interface ParseResponse extends ApiResponse {
  meals: Meal[];
}

interface SuggestionResponse extends ApiResponse {
  suggestionList: Suggestion[];
}

@Injectable({
  providedIn: 'root'
})
export class ExternalAPIService {

  constructor(private http: HttpClient) { }

  /** Sends free text to Nutritionix and returns the food items it recognised. */
  parseLanguage(text: string, time: string): Observable<Meal[]> {
    let url = API_URL + "/freeform-input/parse"
    return this.http.post<ParseResponse>(url, {text: text, time: time}, httpOptions)
      .pipe(unwrap<ParseResponse, Meal[]>(response => response.meals));
  }

  suggestMeal(): Observable<Suggestion[]> {
    let url = API_URL + "/suggestion/suggestMeal"
    return this.http.get<SuggestionResponse>(url)
      .pipe(unwrap<SuggestionResponse, Suggestion[]>(response => response.suggestionList));
  }

}
