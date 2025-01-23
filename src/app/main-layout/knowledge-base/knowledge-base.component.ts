 
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
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule], 
  templateUrl: './knowledge-base.component.html',
  styleUrl: './knowledge-base.component.scss'
})
export class KnowledgeBaseComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  FiltersList: any = [];
  knowledgebase: any = [];
  knowledgebaseList: any = [];
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
      this.LoadUsers() ;
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }  
  ActivityDetail(actitem:any){

  }
  showTab(tab_type:any){ 
    this.knowledgebase=this.knowledgebaseList; 
    if(tab_type=='Recommended')
      return this.knowledgebase=this.knowledgebase.filter((item: any) =>(item.is_recommended === true));
  else
      return this.knowledgebase=this.knowledgebase.filter((item: any) =>(item.type === tab_type));
  }
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
 
  LoadUsers() {
    const objRequest = {
      typeId: 34,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => { 
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.knowledgebase = parseresponse.Table; 
          this.knowledgebaseList = parseresponse.Table; 
          return this.knowledgebase=this.knowledgebase.filter((item: any) =>(item.type === 'Documents'));
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
   
  backtohome(){
    window.location.href = "/dashboard";
  }
}
