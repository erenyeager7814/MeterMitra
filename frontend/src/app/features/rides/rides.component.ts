import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateRideRequest, Ride } from '../../core/models/rickshaw.models';
import { RickshawApiService } from '../../core/services/rickshaw-api.service';

@Component({
  selector: 'app-rides',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, NgFor, NgIf],
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.css'
})
export class RidesComponent implements OnInit {
  rides: Ride[] = [];
  errorMessage = '';
  isSaving = false;

  newRide: CreateRideRequest = {
    passengerName: '',
    pickupLocation: '',
    dropLocation: '',
    distanceKm: 3
  };

  constructor(private readonly api: RickshawApiService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.api.getRides().subscribe({
      next: (rides) => (this.rides = rides),
      error: () => (this.errorMessage = 'Could not load rides. Check whether the backend is running.')
    });
  }

  createRide(): void {
    this.errorMessage = '';
    this.isSaving = true;

    this.api.createRide(this.newRide).subscribe({
      next: () => {
        this.newRide = {
          passengerName: '',
          pickupLocation: '',
          dropLocation: '',
          distanceKm: 3
        };
        this.isSaving = false;
        this.loadRides();
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Ride could not be created.';
        this.isSaving = false;
      }
    });
  }
}

