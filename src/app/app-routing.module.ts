import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main-layout/dashboard/dashboard.component';
import { MaindashboardComponent } from './maindashboard/maindashboard.component';

const routes: Routes = [
  {
    path: '*',
    redirectTo: '/dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
  ,{ path: 'maindashboard', component: MaindashboardComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
