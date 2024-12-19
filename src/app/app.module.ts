import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutModule } from './main-layout/main-layout.module';
import { RegisterLoginModule } from './register-login/register-login.module';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { CryptoService } from 'src/shared/crypto.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    MainLayoutModule,
    RegisterLoginModule,
    FormsModule
    
  ],
  providers: [SharedService, SnackbarService, CryptoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
