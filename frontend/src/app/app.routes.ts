import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DriversComponent } from './features/drivers/drivers.component';
import { RidesComponent } from './features/rides/rides.component';
import { SqlRationalizerComponent } from './features/sql-rationalizer/sql-rationalizer.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'rides', component: RidesComponent },
  { path: 'sql-rationalizer', component: SqlRationalizerComponent },
  { path: '**', redirectTo: '' }
];

