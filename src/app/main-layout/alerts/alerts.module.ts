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
import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';
const routes: Routes = [
  {
    path: 'alerts',
    component: AlertsComponent,
 
  }];

@NgModule({
  declarations: [
    AlertsComponent
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
    AlertsComponent
   ],
  providers: [AlertsService],
  bootstrap: [AlertsComponent]
})
export class AlertsModule { }
