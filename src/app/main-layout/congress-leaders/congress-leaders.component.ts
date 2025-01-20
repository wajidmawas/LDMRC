 
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
  selector: 'app-congress-leaders',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule], 
  templateUrl: './congress-leaders.component.html',
  styleUrl: './congress-leaders.component.scss'
})
export class CongressLeadersComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  CasteLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  CasteList: any = [];
  Users: any = [];
  UsersList: any = [];
  UsersProfessions: any = [];
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
    if(tab_type=='PCC')
    return this.Users=this.Users.filter((item: any) =>(item.designation_id === 2 || item.designation_id === 3));
  else  if(tab_type=='SC')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 3));
  else  if(tab_type=='ST')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 4));
  else  if(tab_type=='OBC')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 5));
  else  if(tab_type=='Minority')
  return this.Users=this.Users.filter((item: any) =>(item.caste_id === 6));
  }
  viewDetails(access_token:any){
    
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
            this.CasteList = parseresponse.Table;
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
          this.Users = parseresponse.Table; 
          this.UsersList = parseresponse.Table; 
          this.UsersProfessions = parseresponse.Table1; 
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
else if(type=='caste'){
  this.CasteLimit=this.CasteList.length;
}
}
FilterProfessions(uid:number){
  return this.UsersProfessions.filter((item: any) =>item.uid=== uid);
}
  showless(type:any){
    if(type=='states'){
      this.StatesLimit=5;
    }
    else if(type=='designation'){
      this.DesignationLimit=5;
    }
     else if(type=='caste'){
      this.CasteLimit=5;
    }
      }
  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
