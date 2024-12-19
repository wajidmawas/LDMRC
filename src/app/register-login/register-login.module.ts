import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { registerLoginComponent } from './register-login.component';
import { loginModule } from './login/login.module';
import { registerModule } from './register/register.module'; 

@NgModule({
  declarations: [
    registerLoginComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    loginModule,
    registerModule
  ],
  exports: [
    registerLoginComponent,
    loginModule,
    registerModule
   ],
  providers: [],
  bootstrap: [registerLoginComponent]
})
export class RegisterLoginModule { }
