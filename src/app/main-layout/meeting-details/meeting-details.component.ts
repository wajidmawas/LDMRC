import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from '../profile/profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meetingdetail',
  templateUrl: './meeting-details.component.html',
  styleUrl: './meeting-details.component.scss'
})
export class MeetingDetailComponent implements OnInit  {
  activityId: string | null = null;
  selectedActivity: any = null;
  ActivitiesDetail:any=[];
  ParticipantsDetail:any=[];
 clsactivity:cls_addactivity=new cls_addactivity();
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedVillage:number | null = null;
  filename: any | null = null;
  states: any = []; cities: any = [];ActivityType: any = [];
  userDtail:any={};
  userdetails:any={};
  villages:any=[];
  titlesearch:string='';






  constructor(private route: ActivatedRoute,private router: Router,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
    this.titleService.setTitle("AICC - Profile");
}
ngOnInit(): void { 
  // Get the path parameter
  this.activityId = this.route.snapshot.paramMap.get('id');
  console.log('Activity ID:', this.activityId);
  this.fetchMeetingDetail(this.activityId);

  $(".page-loader-wrapper").fadeOut();  
  this.userDtail = localStorage.getItem("cl_user");
  this.userdetails = JSON.parse(this.userDtail)
console.log("UserDetails",this.userdetails)
this.getLookupMaster(0);
this.getActivityType(0);
}
onstateChange(event: any): void {
  this.selectedState = event.target.value; 
  this.getCities(event.target.value) 
}
oncityChange(event: any): void {
  this.selectedCity = event.target.value; 
  this.getvillages(event.target.value,this.selectedState);
}
onvillageChange(event: any): void {
  this.selectedVillage = event.target.value; 
}
onActvitytypeChange(event: any): void {
  this.selectedActvity = event.target.value; 
}
getCities(id: any) {
  const objRequest = {
    typeId: 2,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };
  console.log(JSON.stringify(objRequest));
  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
     
      if (response["errorCode"] === "200") { 
        this.cities = parseresponse.Table
       console.log("Cities" + JSON.stringify(this.cities))
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
getvillages(id: any,state :any) { 
  const objRequest = {
    typeId: 5,
    userid: 0,
    filterId: state,
    filterText: String(id),
    filterText1: ""
  };
  console.log(JSON.stringify(objRequest));
  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => {  
      var parseresponse = JSON.parse(response.response); 
     
      if (response["errorCode"] === "200") { 
        this.villages = parseresponse.Table
       console.log("villages" + JSON.stringify(this.villages))
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
getLookupMaster(id: any) {
  const objRequest = {
    typeId: 1,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
      if (response["errorCode"] === "200") {
        this.states = parseresponse.Table1;
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
getActivityType(id: any) {
  const objRequest = {
    typeId: 18,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
      if (response["errorCode"] === "200") {
        this.ActivityType = parseresponse.Table;
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
SaveActivity() { 
  var validate:boolean=false;

  // Perform client-side validation
  if (this.clsactivity.title == undefined || this.clsactivity.title == null || this.clsactivity.title == '') {
    this.snackbar.showInfo("Please enter title", "Error");
    validate = true;
  } else if (this.clsactivity.short_desc == undefined || this.clsactivity.short_desc == null || this.clsactivity.short_desc == '') {
    this.snackbar.showInfo("Please enter short description", "Error");
    validate = true;
  } else if (this.clsactivity.description == undefined || this.clsactivity.description == null || this.clsactivity.description == '') {
    this.snackbar.showInfo("Please enter description", "Error");
    validate = true;
  } else if (this.clsactivity.thumbnail_img == undefined || this.clsactivity.thumbnail_img == null || this.clsactivity.thumbnail_img == '') {
    this.snackbar.showInfo("Please select an image", "Error");
    validate = true;
  }

  if (!validate) {
    $(".page-loader-wrapper-review").show();
    const formData = new FormData();
    // Append form fields
    formData.append('title', this.clsactivity.title);
    formData.append('date_posting', this.clsactivity.date_posting);
    formData.append('activity_type', this.clsactivity.activity_type.toString());
    formData.append('no_of_participants', this.clsactivity.no_of_participants.toString());
    formData.append('state_id', this.clsactivity.state_id.toString());
    formData.append('city_id', this.clsactivity.city_id.toString());
    formData.append('village_id', this.clsactivity.village_id.toString());
    formData.append('short_desc', this.clsactivity.short_desc);
    formData.append('description', this.clsactivity.description);
    formData.append('user_id', this.userdetails.user_id.toString());
    formData.append('friendly_url',this.clsactivity.friendlyurl.toString());
    formData.append('id', this.clsactivity.id.toString());
       // Append file only if it exists
       if (this.clsactivity.thumbnail_img && this.clsactivity.thumbnail_img instanceof File) {
        formData.append('thumbnail_img', this.clsactivity.thumbnail_img);
      }
      else
      formData.delete('thumbnail_img'); 
this.service.SaveActivity(formData).subscribe((res: any) => {
  setTimeout(() => {
    $(".page-loader-wrapper-review").hide();
  }, 500);
  var response = res;
  if (response.errorCode == "200") {
     this.snackbar.showSuccess(response.message, response.status);
    setTimeout(() => {
      this.clsactivity = new cls_addactivity(); // Reset form data
      window.location.reload();
    }, 1000);
   
  } else {
    this.snackbar.showInfo(response.message, "Error");
  }
});
 
  }
}
onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.thumbnail_img = file; // Assign File object
    }
}
CancelActivity()
{
  this.clsactivity = new cls_addactivity(); // Reset form data
}
EditActivity(){ 
  this.ActivityDetail();
  
}
setSelectedActivity(activity: any): void {
  this.selectedActivity = activity; ;
}
ActivityDetail(){ 
 const objRequest = {
   typeId: 25,
   userid: 0,
   filterId: 0,
   filterText: this.activityId?.toString(),
   filterText1: ""
 };

 this.service.getMasters(objRequest).subscribe({
   next: (response: any) => { 
     var parseresponse = JSON.parse(response.response); 
     if (response["errorCode"] === "200") {
       this.ActivitiesDetail = parseresponse.Table;
       this.clsactivity = { ...this.ActivitiesDetail[0] };
    // Convert date_of_posting to 'YYYY-MM-DD' format
    this.clsactivity.date_posting = this.ActivitiesDetail[0].date_of_posting.split('T')[0];
    this.clsactivity.friendlyurl = this.ActivitiesDetail[0].friendly_url;
    this.clsactivity.thumbnail_img=this.ActivitiesDetail[0].thumbnail_image;
    this.clsactivity.id=this.ActivitiesDetail[0].id;
   this.getCities(this.ActivitiesDetail[0].state_id) ;
   this.selectedCity = this.ActivitiesDetail[0].city_id; 
   this.getvillages(this.ActivitiesDetail[0].city_id,this.ActivitiesDetail[0].state_id); 
   this.selectedVillage = this.ActivitiesDetail[0].village_id; 
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
fetchMeetingDetail(id: string|null):void{ 
  const objRequest = {
    typeId: 35,
    userid: 0,
    filterId: 0,
    filterText: id?.toString(),
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
      if (response["errorCode"] === "200") { 
        this.ActivitiesDetail = parseresponse.Table;
        this.ParticipantsDetail = parseresponse.Table1;
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
  window.location.href = "/meetings";
}
 // Action to delete activity
 deleteActivity() {
  const objRequest = {
    typeId: 22,
    userid: 0,
    filterId: 0,
    filterText: this.activityId?.toString(),
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
export class cls_addactivity {
  constructor(){

  }
  title: string='';
  date_posting: string= '';
  activity_type:number=0;
  no_of_participants:number = 0;
  state_id:number = 0;
  city_id:number = 0;
  village_id:number = 0;
  short_desc: string = '';
  description: string = '';
  thumbnail_img: string | File = ''; // Allow both string and File
  id:number=0;
  imagePath:string='';
  user_id:string='';
  friendlyurl:string='';
}
