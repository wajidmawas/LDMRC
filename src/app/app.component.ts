import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from 'src/shared/Shared.Service';  
import { CryptoService } from 'src/shared/crypto.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  login:boolean=false;// Set this based on your application logic
  userDetails: any = {};
  title = 'ldmrc';
  ulang:any='';

 
 
  constructor(public location: Location,private router: Router, private sharedService: SharedService,
     
    private crypto:CryptoService) { 

    // Set the navigation translations  
  
    
    if (localStorage.getItem("cl_user") !== undefined && localStorage.getItem("cl_user") !== "" && localStorage.getItem("cl_user") !== null && !location.path().includes("auth")) {
      this.userDetails = localStorage.getItem("cl_user"); 
      this.login = false;
      if (location.path() == "" || location.path().includes("login")) { 
        // window.location.href = "/dashboard";
      }
    }
    else { 
      if (location.path() == "" || location.path().includes("maindashboard")) { 
          //  window.location.href='/auth/login';
          // window.location.href='/main-dashboard';

        //  window.location.href='http://localhost:4200/dashboard';
        // this.router.navigate(['/dashboard']);
      }
    }
  }


}
