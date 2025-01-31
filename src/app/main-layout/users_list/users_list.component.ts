 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { dashboardService } from '../dashboard/dashboard.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { SnackbarService } from 'src/shared/snackbar-service';   
import { TranslateService } from '@ngx-translate/core'; 
import { FormControl ,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith, Subject, takeUntil } from 'rxjs'; 
@Component({
  selector: 'app-users_list',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule,FormsModule], 
  templateUrl: './users_list.component.html',
  styleUrl: './users_list.component.scss'
})

export class UsersListComponent {
  isLoggedIn:any='';
  userdetails:any={}; 
  userDetail:any={}; 
  Users: any = [];
  searchValue:any='';
  UsersList: any = []; 
  constructor(public sharedService: SharedService,private router: Router,private service:dashboardService, private snackbar:SnackbarService, private translate:TranslateService) {
    setTimeout(() => {
      $(".page-loader-wrapper-review").fadeOut();
    }, 300);
      this.userDetail = this.sharedService.getUserSession();
      
       
  }
 
  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
     if(this.isLoggedIn!=null){ 
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
  
 
  viewDetails(access_token:any){
    window.location.href = "/user-profile/"+access_token;
  }
 
  
 
  
  LoadUsers(filtertext:string) {
    const objRequest = {
      typeId: 44,
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
  
  changeStatus(filtertext:string,id:number){
    debugger;
    const objRequest = {
      typeId: 10, 
      userid: 0,
      filterId: id, 
      filterText: filtertext, 
      filterText1: "",
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
        console.log(JSON.stringify("Response", response))
        if (response["errorCode"] === "200") {
          this.snackbar.showInfo("Successfully Updated","Success");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        } else { 
          console.error("API returned an error:", response.message); 
        }
      } 
       
    });
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
