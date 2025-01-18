import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main-layout/dashboard/dashboard.component';
// import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { loginComponent } from './register-login/login/login.component';

// const routes: Routes = [
//   {
//     path: '*',
//     redirectTo: '/dashboard'
//   },
//   {
//     path: 'dashboard',
//     component: DashboardComponent
//   }
//   ,{ path: '', component: MainDashboardComponent } // Main route for this module
//   ,{ path: '', component: DashboardComponent },
  
// ];
const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },

   { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  // { path: '', redirectTo: 'main-dashboard', pathMatch: 'full' },
  // { path: '*', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'main-dashboard', loadChildren: () => import('./main-dashboard/main-dashboard.module').then(m => m.MainDashboardModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
