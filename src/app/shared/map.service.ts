import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IFormData, IResponseItem } from './interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly apiUrl = environment.MAP_API_URL;
  private readonly apiKey = environment.MAP_API_KEY;

  constructor(private http: HttpClient) {}

  runSuggest(lang: string, query: string): Observable<IResponseItem[]> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('lang', lang)
      .set('query', query)
      .set('type', 'regional.address');

    return this.http.get<any>(`${this.apiUrl}suggest`, { params }).pipe(
      map(res => res?.items ?? []),
      catchError(() => of([]))
    );
  }

  runGeocode(lang: string, formData: IFormData): Observable<IResponseItem[]> {
    const query = `${formData.street} ${formData.houseNumber}, ${formData.city}, ${formData.zip}, ${formData.country}`;

    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('lang', lang)
      .set('query', query)
      .set('type', 'regional.address');

    return this.http.get<any>(`${this.apiUrl}geocode`, { params }).pipe(
      map(res => res?.items ?? []),
      catchError(() => of([]))
    );
  }
}
