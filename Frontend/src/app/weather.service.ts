import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string | null;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  getForecast() {
    return this.http.get<WeatherForecast[]>('/api/weatherforecast');
  }
}
