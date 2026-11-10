import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateRideRequest,
  DashboardSummary,
  Driver,
  FareEstimateResponse,
  Rickshaw,
  Ride,
  SqlAnalysisResponse
} from '../models/rickshaw.models';

@Injectable({ providedIn: 'root' })
export class RickshawApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard`);
  }

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}/drivers`);
  }

  getRickshaws(): Observable<Rickshaw[]> {
    return this.http.get<Rickshaw[]>(`${this.baseUrl}/rickshaws`);
  }

  getRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.baseUrl}/rides`);
  }

  createRide(request: CreateRideRequest): Observable<Ride> {
    return this.http.post<Ride>(`${this.baseUrl}/rides`, request);
  }

  estimateFare(distanceKm: number, peakHour: boolean): Observable<FareEstimateResponse> {
    return this.http.post<FareEstimateResponse>(`${this.baseUrl}/fares/estimate`, { distanceKm, peakHour });
  }

  analyzeSql(sql: string, schema: string): Observable<SqlAnalysisResponse> {
    return this.http.post<SqlAnalysisResponse>(`${this.baseUrl}/sql/analyze`, { sql, schema });
  }
}

