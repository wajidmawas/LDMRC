import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../../app-routing.module'; 
import { TranslateModule } from '@ngx-translate/core'; 
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatRadioModule } from '@angular/material/radio'; 
import { MastersComponent } from './masters.component';
import { LeaderDevelopmentMissionComponent } from '../leader-development-mission/leader-development-mission.component';
 
const routes: Routes = [
  {
    path: 'masters',
    component: MastersComponent,
  },
];

@NgModule({ 
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
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    MatRadioModule,
    MastersComponent,  
    LeaderDevelopmentMissionComponent
     // Import the standalone component here.
  ] 
})
export class MastersModule {}
