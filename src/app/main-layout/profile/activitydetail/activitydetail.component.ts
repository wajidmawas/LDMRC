import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from '../profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activitydetail',
  templateUrl: './activitydetail.component.html',
  styleUrl: './activitydetail.component.scss'
})
export class ActivitydetailComponent implements OnInit  {
  activityId: string | null = null;

  ActivitiesDetail:any=[];
  constructor(private route: ActivatedRoute,private router: Router,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
    this.titleService.setTitle("AICC - Profile");
}
ngOnInit(): void {
  debugger;
  // Get the path parameter
  this.activityId = this.route.snapshot.paramMap.get('id');
  console.log('Activity ID:', this.activityId);
  this.fetchActivitiesDetail(this.activityId);
}
EditActivity(Activity: any){
  if (Activity && Activity.id) {
    this.router.navigate([`/profile/addactivity`, Activity.id]);
  } else {
    console.error('Invalid Activity object or missing ID');
  }
console.log(Activity);
}
fetchActivitiesDetail(id: string|null):void{
  debugger;
  const objRequest = {
    typeId: 7,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
      if (response["errorCode"] === "200") {
        this.ActivitiesDetail = parseresponse.Table;
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

Back()
{
  window.location.href = "/profile";
}
 // Action to delete activity
 deleteActivity(activity: any) {
  const objRequest = {
    typeId: 22,
    userid: 0,
    filterId: activity.id,
    filterText: "",
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
}
