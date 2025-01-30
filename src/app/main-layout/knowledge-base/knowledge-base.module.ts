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
import { KnowledgeBaseComponent } from './knowledge-base.component'; // Import the standalone component.
import { KnowledgeDetailComponent } from '../knowledgedetails/knowledgedetails.component';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
const routes: Routes = [
  {
    path: 'knowledge_base',
    component: KnowledgeBaseComponent,
  },
  {
    path: 'knowledge_detail/:id',
    component: KnowledgeDetailComponent, 
  },
];

@NgModule({
  declarations: [ 
    KnowledgeDetailComponent
  ],
  imports: [
    HttpClientModule,
    AngularEditorModule,
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
    KnowledgeBaseComponent // Import the standalone component here.
  ],
  exports: [ 
    KnowledgeDetailComponent
   ],
})
export class KnowledgeBaseModule {}
