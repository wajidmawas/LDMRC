 
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
import { FormControl ,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
@Component({
  selector: 'app-congress-organization',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './congress-organization.component.html',
  styleUrl: './congress-organization.component.scss'
})

export class CongressOrganizationComponent {
  isLoggedIn:any='';
  userdetails:any={};
  DesignationLimit:number=5;
  StatesLimit:number=5;
  userDetail:any={};
  Designations: any = [];
  FiltersList: any = [];
  Users: any = [];
  searchValue:any='';
  UsersList: any = [];
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
      this.LoadUsers("") ;
     }
     else{
      window.location.href = "/auth/login";
     }
   
  }
  onSearchChange(): void {  
    this.Users=this.UsersList;
    if(this.searchValue!=null && this.searchValue!=undefined && this.searchValue!=""){
      var list=this.Users.filter((item: any) =>(item.first_name.includes(this.searchValue) ||
      item.last_name.includes(this.searchValue) ||
      item.mobile_no.includes(this.searchValue) ));
      this.Users=list;
    }
     
  }
  export2Excel(){
     
    const downloadLink = document.createElement('a');
    let table: any = [];
    table = document.getElementById('exportable');
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    var html = table.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
    downloadLink.href = 'data:' + url + ' ';
    downloadLink.download = 'congress_organisation.xls'
    downloadLink.click();
  }
  bindFilter(list:any,primarycol:any,filterType:any){
    let selectedlist = list
    .filter((item: any) => item.is_selected==true)
    .map((item: any) => item[primarycol]);
  
    selectedlist.forEach((element:any) => {
      this.FiltersList.push({ filterType: filterType, id: element });
    });
  }
  filterResult(){ 
    this.FiltersList=[];
    this.bindFilter(this.Designations,"id","Designations")
    this.bindFilter(this.States,"STATEID","States")  
    this.LoadUsers(JSON.stringify(this.FiltersList))
}

 
  onCheckedResult(childitem:any,checked_type:any) {  
    if(checked_type=='Designations'){
    let obj=this.Designations.filter((item: any) =>(item.id === childitem.id));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
  }
  else  if(checked_type=='States'){
    let obj=this.States.filter((item: any) =>(item.STATEID === childitem.STATEID));
    if(obj!=null){
      obj[0].is_selected=obj[0].is_selected==true ? false :true;
    }
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
       
        if (response["errorCode"] === "200") {
          var parseresponse = JSON.parse(response.response); 
          this.Designations = parseresponse.Table2;
          this.States = parseresponse.Table1; 
        } else {
          this.Designations=[];
          this.States=[];
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
  onAllCheckedResult(list:any,listType:any){
    list.forEach((element:any) => {
      element.is_selected=element.is_selected==true ? false :true;
    }); 
     
  }
  clearCheckedResult(list:any,listType:any){
    list.forEach((element:any) => {
      element.is_selected=false;
    }); 
     
  }
  LoadUsers(filtertext:string) {
    const objRequest = {
      typeId: 8,
      userid: 0,
      filterId: 0,
      filterText: filtertext,
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
        let el:any = document.getElementById('AICC');
        el.scrollIntoView();
        if (response["errorCode"] === "200") {
          var parseresponse = JSON.parse(response.response);
          this.Users = parseresponse.Table; 
          this.UsersList = parseresponse.Table; 
        } else {
          this.Users=[];
          this.UsersList=[];
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
