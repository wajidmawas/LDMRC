import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';  
import {MatRadioModule} from '@angular/material/radio';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { AddactivityComponent } from './addactivity/addactivity.component';
import { ActivitydetailComponent } from './activitydetail/activitydetail.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
 {
    path: 'profile/addactivity/:id',
    component: AddactivityComponent, 
  },
  {
    path: 'activity_detail/:id',
    component: ActivitydetailComponent, 
  },
];

@NgModule({
  declarations: [
    ProfileComponent,
    AddactivityComponent,
    ActivitydetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCommonModule,
    MatOptionModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    TranslateModule.forChild(),
    [NgxMatTimepickerModule]
  ],
  exports: [
    ProfileComponent,
    AddactivityComponent,
    ActivitydetailComponent
   ],
  providers: [ProfileService],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
