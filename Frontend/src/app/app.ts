import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService, WeatherForecast } from './weather.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class App {
  private readonly weather = inject(WeatherService);

  protected readonly forecast = signal<WeatherForecast[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    this.weather.getForecast().subscribe({
      next: (data) => {
        this.forecast.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load forecast');
        this.loading.set(false);
      }
    });
  }
}
