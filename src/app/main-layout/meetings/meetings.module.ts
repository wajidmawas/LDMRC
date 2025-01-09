import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../../app-routing.module'; 
import { TranslateModule } from '@ngx-translate/core';
import { Meetingsservice } from './meetings.service';
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
import { MeetingsComponent } from './meetings.component';
import { AddmeetingsComponent } from './addmeetings/addmeetings.component';
import {MatRadioModule} from '@angular/material/radio';
import { AddmessageComponent } from './addmessage/addmessage.component';
const routes: Routes = [
  {
    path: 'meetings',
    component: MeetingsComponent
  },
 {
    path: 'meetings/addmeetings',
    component: AddmeetingsComponent, 
  },
  {
    path: 'meetings/addmessage',
    component: AddmessageComponent, 
  },
];



@NgModule({
  declarations: [
    MeetingsComponent,
    AddmeetingsComponent,
    AddmessageComponent
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
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    TranslateModule.forChild(),
    MatRadioModule
  ],
  exports: [
    MeetingsComponent,
    AddmeetingsComponent,
    AddmessageComponent
   ],
  providers: [Meetingsservice]
})
export class MeetingModule { }
