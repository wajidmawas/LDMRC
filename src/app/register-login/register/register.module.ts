import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { registerComponent } from './register.component';
import { RegisterService } from './register.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';

const routes: Routes = [
    {
      path: 'auth',
      children : [
        {
          path:'register',
          component:registerComponent
        }
      ]
    }];
    
@NgModule({
  declarations: [
    registerComponent
  ],
  imports: [

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatRadioModule
  ],
  exports: [
    registerComponent
   ],
  providers: [RegisterService],
  
  bootstrap: [registerComponent]
})
export class registerModule { }
