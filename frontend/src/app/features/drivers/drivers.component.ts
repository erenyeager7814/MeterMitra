import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Driver } from '../../core/models/rickshaw.models';
import { RickshawApiService } from '../../core/services/rickshaw-api.service';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [DecimalPipe, NgFor, NgIf],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.css'
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  errorMessage = '';

  constructor(private readonly api: RickshawApiService) {}

  ngOnInit(): void {
    this.api.getDrivers().subscribe({
      next: (drivers) => (this.drivers = drivers),
      error: () => (this.errorMessage = 'Could not load drivers. Check whether the backend is running.')
    });
  }
}

