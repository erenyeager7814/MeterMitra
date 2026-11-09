import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardSummary, FareEstimateResponse, Rickshaw } from '../../core/models/rickshaw.models';
import { RickshawApiService } from '../../core/services/rickshaw-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary?: DashboardSummary;
  rickshaws: Rickshaw[] = [];
  distanceKm = 5;
  peakHour = false;
  fare?: FareEstimateResponse;
  errorMessage = '';

  constructor(private readonly api: RickshawApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.estimateFare();
  }

  loadDashboard(): void {
    this.api.getDashboard().subscribe({
      next: (summary) => (this.summary = summary),
      error: () => (this.errorMessage = 'Backend is not reachable yet. Start Spring Boot on port 8080.')
    });

    this.api.getRickshaws().subscribe({
      next: (rickshaws) => (this.rickshaws = rickshaws),
      error: () => (this.errorMessage = 'Backend is not reachable yet. Start Spring Boot on port 8080.')
    });
  }

  estimateFare(): void {
    this.api.estimateFare(this.distanceKm, this.peakHour).subscribe({
      next: (fare) => (this.fare = fare),
      error: () => (this.errorMessage = 'Fare API is not reachable yet.')
    });
  }
}

