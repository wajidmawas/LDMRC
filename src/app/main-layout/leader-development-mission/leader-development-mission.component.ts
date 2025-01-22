 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { dashboardService } from '../dashboard/dashboard.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';   
import { TranslateService } from '@ngx-translate/core';  
import dayGridPlugin from '@fullcalendar/daygrid' 
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
@Component({
  selector: 'app-leader-mission',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule], 
  templateUrl: './leader-development-mission.component.html',
  styleUrl: './leader-development-mission.component.scss'
})
export class LeaderDevelopmentMissionComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  Users: any = [];
  UsersList: any = [];
  LDMActivities: any = [];
  States: any = [];
  Districts: any = [];
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
      
      var year  = new Date().getFullYear();
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric',
        month: 'long', // Full month name
        day: 'numeric',
        weekday: 'long', // Full day name
      }; 
  }
   
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
     if(this.isLoggedIn!=null){
      this.LoadMasters();
      this.LoadUsers() ;
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }
  showTab(tab_type:any){  
    this.Users=this.UsersList;
    this.Users=this.Users.filter((item: any) =>(item.stream === tab_type));
  }
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
  LoadMasters() {
    const objRequest = {
      typeId: 1,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Designations = parseresponse.Table2;
          this.States = parseresponse.Table1; 
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  LoadUsers() {
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Users = parseresponse.Table2; 
          this.UsersList = parseresponse.Table2; 
          this.Users=this.Users.filter((item: any) =>(item.stream === "SC Dept"));
          this.LDMActivities = parseresponse.Table3; 
        } else {
          console.error("API returned an error:", response.message); 
        }
      },
      error: (error: any) => {
        console.error("API call failed:", error);
        // Handle the error appropriately
        // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
      },
      complete: () => {
        console.log("API call completed.");
      }
    });
  }
  showmore(type:any){
if(type=='states'){
  this.StatesLimit=this.States.length;
}
else if(type=='designation'){
  this.DesignationLimit=this.Designations.length;
}
  }
  showless(type:any){
    if(type=='states'){
      this.StatesLimit=5;
    }
    else if(type=='designation'){
      this.DesignationLimit=5;
    }
      }
  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
