import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'jquery';  
import { SharedService } from 'src/shared/Shared.Service'; 
import { Router } from '@angular/router';
import { SnackbarService } from 'src/shared/snackbar-service';
import { dashboardService } from '../dashboard/dashboard.service';
@Component({
  selector: 'app-footer', 
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit  {
  isLoggedIn:any='';
  EmailAddress:any='';
  ngOnInit() {  
    this.isLoggedIn = localStorage.getItem("cl_user"); 
  }
constructor( private snackbar:SnackbarService,private service:dashboardService) {
   
}
subscribeEmail(){
  if(this.EmailAddress==null || this.EmailAddress=='' || this.EmailAddress==undefined){
    this.snackbar.showError("Invalid email address","Error");
  }
  else{
    const objRequest = {
      typeId: 33,
      userid: 0,
      filterId: 0,
      filterText: this.EmailAddress,
      filterText1: ""
    }; 
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
         this.EmailAddress='';
         this.snackbar.showSuccess("Successfully registered","Success");
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
 
}
  redirect_page(_pageTye:any){
    if(this.isLoggedIn==null)
      window.location.href = "/auth/login";
    else if(_pageTye=='CO')
    window.location.href = "/congress_organization";
    else if(_pageTye=='CL')
    window.location.href = "/congress_leaders"; 
  else if(_pageTye=='KB')
    window.location.href = "/knowledge_base";
    else if(_pageTye=='Activities')
    window.location.href = "/activity_list";
    else if(_pageTye=='Meetings')
    window.location.href = "/meetings";
    else if(_pageTye=='Trainings')
    window.location.href = "/meetings";
   }
}
