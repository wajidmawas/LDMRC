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
 
  login:boolean=false;
  userDetails: any = {};
  title = 'ldmrc';
  ulang:any='';
  constructor(public location: Location,private router: Router, private sharedService: SharedService,
     
    private crypto:CryptoService) { 

    // Set the navigation translations  
    
    
    
    if (localStorage.getItem("cl_user") !== undefined && localStorage.getItem("cl_user") !== "" && localStorage.getItem("cl_user") !== null && !location.path().includes("auth")) {
      this.userDetails = localStorage.getItem("cl_user");
      console.log(this.userDetails);
      this.login = true;

      // if (this.userDetails._UserLanguage !== "labels_en")
      //   $("body").addClass("rtl_mode");
      // else
      //   $("body").removeClass("rtl_mode")
      
      if (location.path() == "" || location.path().includes("login")) {
        //this.router.navigate(['dashboard']);
        window.location.href = "/dashboard";
      }

    }
    else { 
      if (location.path() == "" || location.path().includes("dashboard")) {
        window.location.href='/auth/login';
      }
    }
  }

 
}
