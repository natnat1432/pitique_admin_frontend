import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminManagementComponent } from './pages/admin-management/admin-management.component';
import { RealtorManagementComponent } from './pages/realtor-management/realtor-management.component';
import { PitiqueManagementComponent } from './pages/pitique-management/pitique-management.component';
import { BookingManagementComponent } from './pages/booking-management/booking-management.component';
import { PaymentManagementComponent } from './pages/payment-management/payment-management.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'admin-management', component:AdminManagementComponent},
  {path:'realtor-management', component:RealtorManagementComponent},
  {path:'pitique-management', component:PitiqueManagementComponent},
  {path:'booking-management', component:BookingManagementComponent},
  {path:'payment-management', component:PaymentManagementComponent},
  {path:'profile', component:ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
