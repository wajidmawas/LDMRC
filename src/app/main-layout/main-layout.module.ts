import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MainLayoutComponent } from './main-layout.component';
import { HeaderModule } from './header/header.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dashboardService } from './dashboard/dashboard.service';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AlertsModule } from './alerts/alerts.module';
import { ProfileModule } from './profile/profile.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MeetingModule } from './meetings/meetings.module'; 
import { FooterComponent } from './footer/footer.component'; 
import { CongressOrganizationModule } from './congress-organization/congress-organization.module'; 
import { CongressLeadersModule } from './congress-leaders/congress-leaders.module';
import { ActivityListModule } from './activity-list/activity-list.module';
import { UserProfileModule } from './user-profile/user-profile.module';

// import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    MainLayoutComponent,
    DashboardComponent, 
    FooterComponent,
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,TranslateModule,
    CommonModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,MatFormFieldModule,MatSelectModule,NgxMatSelectSearchModule,
    GoogleMapsModule,
    HeaderModule,
    FullCalendarModule,
    AlertsModule,
    ProfileModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule, 
    MeetingModule,
    CongressOrganizationModule,
    ActivityListModule,
    CongressLeadersModule,
    UserProfileModule
    // ,CarouselModule
    
  ],
  exports: [
    MainLayoutComponent,
    FooterComponent,
    
  ],
  providers: [dashboardService],
  bootstrap: [MainLayoutComponent]
})
export class MainLayoutModule { }
