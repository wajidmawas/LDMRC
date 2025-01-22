 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser'; 
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivitylistService } from './activity-list.service';
import 'jquery';
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule], 
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent {
  isLoggedIn:any='';
  Activities:any=[];
  ActivitiesList:any=[];
  selectedActivity: any = null;
  titlesearch:string='';
  constructor(private router: Router,private service:ActivitylistService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService) {
    this.titleService.setTitle("Leaders Development Mission - Profile");
}
ActivityDetail(Activity: any) {  
  if (Activity && Activity.code) {
    this.router.navigate([`activity_detail`, Activity.code]);
  } else {
    console.error('Invalid Activity object or missing ID');
  }
}
filterTab(caste_id:number){
  this.Activities=this.ActivitiesList; 
  return this.Activities = this.Activities.filter((item: any) =>item.caste_id=== caste_id);
}
addActivity(){ 
  if(this.isLoggedIn!=null)
  {
  window.location.href = "/profile";
  }
  else{
    window.location.href = "/auth/login";
  }
}
 
filtermyActivities(caste_id: number) {   
  this.Activities=this.ActivitiesList; 
  if(this.isLoggedIn!=null)
  return this.Activities.filter((item: any) =>item.created_by=== JSON.parse(this.isLoggedIn).user_id);
}
setSelectedActivity(activity: any): void {
  this.selectedActivity = activity;
}
EditActivity(Activity: any){ 
  // this.clsactivity = { ...Activity }; 
  //  // Convert date_of_posting to 'YYYY-MM-DD' format
  //  this.clsactivity.date_posting = Activity.date_of_posting.split('T')[0];
  //  this.clsactivity.friendlyurl = Activity.friendly_url;
  //  this.clsactivity.thumbnail_img=Activity.thumbnail_image;
  // this.getCities(Activity.state_id) ;
  // this.selectedCity = Activity.city_id; 
  // this.getvillages(Activity.city_id,Activity.state_id); 
  // this.selectedVillage = Activity.village_id; 

console.log(Activity);
}
DeleteActivity(Activity: any) { 
  const objRequest = {
    typeId: 22,
    userid: 0,
    filterId: 0,
    filterText: Activity.code,
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response);  
      if (response["errorCode"] === "200") {
        this.snackbar.showSuccess("", response.status);
            setTimeout(() => {
              window.location.href = "/profile";
            }, 2000);
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

  ngOnInit() {   
    $(".page-loader-wrapper").fadeOut();  
    this.isLoggedIn = localStorage.getItem("cl_user");
    this.LoadActivity();
   
  }
  LoadActivity() {
    const
     objRequest = {
      typeId: 30,
      userid: 0,
      filterId: 0,
      filterText: "",
      filterText1: ""
    };
  
    this.service.getMasters(objRequest).subscribe({
      next: (response: any) => {  
        var parseresponse = JSON.parse(response.response); 
        if (response["errorCode"] === "200") {
          this.Activities = parseresponse.Table;
          this.ActivitiesList=this.Activities;
          this.Activities = this.Activities.filter((item: any) =>item.caste_id=== 3);
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

  filter(){  
        $('.acc_filter').toggle();
      
  }
  backtohome(){
    window.location.href = "/dashboard";
  }
}
