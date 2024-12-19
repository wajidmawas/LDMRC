import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login.service';

const routes: Routes = [
    {
      path: 'auth',
      children:[{
        path: 'login',
        component: loginComponent
      }]
    }];


@NgModule({
  declarations: [
    loginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    loginComponent
   ],
  providers: [LoginService],
  bootstrap: [loginComponent]
})
export class loginModule { }
