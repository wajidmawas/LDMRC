import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from '../profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-addactivity',
  templateUrl: './addactivity.component.html',
  styleUrl: './addactivity.component.scss'
})
export class AddactivityComponent {
  activityId: string | null = null;
  clsactivity:cls_addactivity=new cls_addactivity();
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedVillage:number | null = null;
  filename: any | null = null;
  Activities: any = [];
  ActivitiesDetail:any=[];
  states: any = []; cities: any = [];ActivityType: any = [];
  userDtail:any={};
  userdetails:any={};
  villages:any=[];
  responseid:any=[];
constructor(private route: ActivatedRoute,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
      
    this.titleService.setTitle("AICC - Profile");
   
    
    
}

ngOnDestroy(): void {
    
}
logout() {
  localStorage.removeItem("cl_user");
  window.location.href = "/dashboard";
}
ngOnInit(): void { 
  debugger;
  $(".page-loader-wrapper").fadeOut();  
  this.userDtail = localStorage.getItem("cl_user");
  this.userdetails = JSON.parse(this.userDtail)
  this.activityId = this.route.snapshot.paramMap.get('id');
  if (this.activityId && this.activityId.trim() !== '') {
    if (this.activityId === this.responseid) {
      console.log('Activity ID matches Response ID, navigating to Dashboard');
      window.location.href = "/profile";
    } else {
      console.log('Activity ID does not match Response ID, editing activity');
      this.EditActivity(this.activityId);
    }
  } else {
    console.error('Invalid or missing Activity ID');
  }


  // this.activityId = this.route.snapshot.paramMap.get('id');
  // if (this.activityId && this.activityId.trim() !== ''&& this.responseid {
  //   this.EditActivity(this.activityId); 
  // } else {
  //   console.error('Invalid or missing Activity ID');
  // }
this.getLookupMaster(0);
this.getActivityType(0);
this.LoadActivity(1);
}

ngAfterViewInit(): void {
  
}
addactivity(){
  window.location.href = "/profile/addactivity";
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
  debugger;
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
      debugger;
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
LoadActivity(id: any) {
  const objRequest = {
    typeId: 4,
    userid: 0,
    filterId: id,
    filterText: "",
    filterText1: ""
  };

  this.service.getMasters(objRequest).subscribe({
    next: (response: any) => { 
      var parseresponse = JSON.parse(response.response); 
      if (response["errorCode"] === "200") {
        this.Activities = parseresponse.Table2;
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
  debugger;
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
    formData.append('user_id', '1');
       // Append file only if it exists
       if (this.clsactivity.thumbnail_img && this.clsactivity.thumbnail_img instanceof File) {
        formData.append('thumbnail_img', this.clsactivity.thumbnail_img);
      }
    if (this.clsactivity.id != 0) {
      formData.append('id', this.clsactivity.id.toString());
      formData.delete('thumbnail_img'); 
  }
  
  

    
   
 
this.service.SaveActivity(formData).subscribe((res: any) => {
  setTimeout(() => {
    $(".page-loader-wrapper-review").hide();
  }, 500);
  var response = res;
  if (response._body.errorCode == "200") {
     this.snackbar.showSuccess(response._body.message, response._body.status);
    setTimeout(() => {
      this.responseid=JSON.parse(response._body.response).Table[0].id;
      this.activityId = this.route.snapshot.paramMap.get('id');
      if (this.activityId && this.activityId.trim() !== '') {
        if (this.activityId === this.responseid.toString()) {
          console.log('Activity ID matches Response ID, navigating to Dashboard');
          window.location.href = "/profile";
        } 
      }
      this.clsactivity = new cls_addactivity(); // Reset form data
    }, 3000);
   
  } else {
    this.snackbar.showInfo(response._body.message, "Error");
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

EditActivity(id: string){
   debugger;
   this.ActivityDetail(id);
  
    

console.log(this.ActivitiesDetail);
}
ActivityDetail(id :string){
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
        this.clsactivity = { ...this.ActivitiesDetail[0] };
     // Convert date_of_posting to 'YYYY-MM-DD' format
     this.clsactivity.date_posting = this.ActivitiesDetail[0].date_of_posting.split('T')[0];
     this.clsactivity.thumbnail_img=this.ActivitiesDetail[0].thumbnail_image;
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
CancelActivity()
{
  this.clsactivity = new cls_addactivity(); // Reset form data
}
Back()
{
  window.location.href = "/profile";
}
 // Action to delete activity
 deleteActivity() {
  alert('Activity deleted!');
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
  user_id:number=0;
}

