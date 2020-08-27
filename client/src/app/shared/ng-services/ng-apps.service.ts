import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class NgAppsService {

  constructor(
    private http: HttpClient
  ) {}

  getApps() {
    return this
      .http
      .get('/api/v1/apps')
      .pipe(
        catchError(error => {
          console.error('Error getting applications: ', error);
          return of([]);
        })
      );
  }
}
