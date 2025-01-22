import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from '../profile/profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Import this module
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,FormsModule], 
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})


export class UserProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('activityModal') activityModal!: ElementRef;
  selectedActivity: any = null;
  Activities:any=[];
  clsactivity:cls_addactivity=new cls_addactivity();
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedVillage:number | null = null;
  filename: any | null = null;
  ActivitiesDetail:any=[];
  states: any = []; cities: any = [];ActivityType: any = [];
  userDtail:any={};
  userdetails:any={};
  villages:any=[];
  titlesearch:string='';

//#add activity 
activityId: string | null = null;
user_access: string | null = null;
responseid:any=[];
//#end activity
ProfessionList: any = [];


constructor(private route: ActivatedRoute,private router: Router,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
    this.titleService.setTitle("Leaders Development Mission - Profile");
}

ngOnDestroy(): void {
    
}
logout() {
  localStorage.removeItem("cl_user");
  window.location.href = "/dashboard";
}
ngOnInit(): void { 
  $(".page-loader-wrapper").fadeOut();  
  this.user_access = this.route.snapshot.paramMap.get('id');
  if(this.user_access==null || this.user_access=="" || this.user_access==undefined)
  {
    window.location.href='/profile';
  }

  this.userDtail = localStorage.getItem("cl_user"); 
  this.getUserDetailsByAccess_token(this.user_access);

}
getprofessionDetails(id: number) {
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
        this.ProfessionList = parseresponse.Table1;
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

ngAfterViewInit(): void {
  
}
addactivity(){
    this.router.navigate([`/profile/addactivity`, 0]);
}
searchactivity(){ 
  this.LoadActivity(this.userdetails.user_id,this.titlesearch);

}
  
getUserDetailsByAccess_token(accesstoken: any) {
  const objRequest = {
    typeId: 18,
    userid: 0,
    filterId: 0,
    filterText: accesstoken,
    filterText1: ""
  };

  this.service.getUserDetailsByAccessToken(objRequest).subscribe({
    next: (response: any) => { 
      
      if (response["errorCode"] === "200") {
        var parseresponse =response.response;
        this.userDtail = parseresponse; 
        this.userdetails = parseresponse;
        this.LoadActivity(this.userdetails.user_id,this.titlesearch);
        this.getprofessionDetails(this.userdetails.user_id);
      } else {
        console.error("API returned an error:", response.message); 
        this.snackbar.showInfo(response.message, "Error");
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
LoadActivity(id: any,filterText:string) {
  const
   objRequest = {
    typeId: 4,
    userid: 0,
    filterId: id,
    filterText: filterText,
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
debugger;
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
    formData.append('id',this.clsactivity.id.toString());

       // Append file only if it exists
       if (this.clsactivity.thumbnail_img && this.clsactivity.thumbnail_img instanceof File) {
        formData.append('thumbnail_img', this.clsactivity.thumbnail_img);
      }
this.service.SaveActivity(formData).subscribe((res: any) => {
  setTimeout(() => {
    $(".page-loader-wrapper-review").hide();
  }, 500);
  var response = res;
  if (response.errorCode == "200") {
     this.snackbar.showSuccess(response.message, response.status);
    setTimeout(() => {
      this.responseid=JSON.parse(response.response).Table[0].id;
      if(this.responseid==this.clsactivity.id)
      {
        this.clsactivity = new cls_addactivity(); // Reset form data
        window.location.href = "/profile";
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



ActivityDetail(Activity: any) { 
  console.log('Activity:', Activity);
  if (Activity && Activity.code) {
    this.router.navigate([`activity_detail`, Activity.code]);
  } else {
    console.error('Invalid Activity object or missing ID');
  }
}
setSelectedActivity(activity: any): void {
  this.selectedActivity = activity;
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



CancelActivity()
{
  this.clsactivity = new cls_addactivity(); // Reset form data
}
Back()
{
  window.location.href = "/profile";
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