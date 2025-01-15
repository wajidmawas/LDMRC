import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'jquery';
import { SharedService } from 'src/shared/Shared.Service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from './profile.service';
import { SnackbarService } from 'src/shared/snackbar-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('activityModal') activityModal!: ElementRef;
 
  // activeTab = 0;
  //  tabs: any = [];
  Activities:any=[];
  //  Activity: {
  //   id: number;
  //   name: string;
  //   activities: {
  //     id: number;
  //     title: string;
  //     Date:string;
  //     date_of_posting:string;
  //     no_of_participants: number;
  //     short_desc: string;
  //     thumbnail_image: string;
  //     created_by: number;
  //     activity_type: number;
  //     Author: string;
  //     state_id: number;
  //     city_id: number;
  //     village_id: number;
  //     description: string;
  //     StateName: string;
  //     DistrictName: string;
  //     CityName: string;
  //     tab: number;
  //     Activtytypeid: number;
  //     Actvitytypename: string;
  //     // Activityselected: boolean;
  //   }[];
  //   // selected: boolean;
  // }[] = [];
 
  // get activeTabContent() {
  //   return this.Activities.filter((activity: Activity) => activity.tab === this.activeTab);
  // }

  // setActiveTab(index: number) {
  //   this.activeTab = index;
  // }
    // Activity model
   
  clsactivity:cls_addactivity=new cls_addactivity();
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedVillage:number | null = null;
  filename: any | null = null;
  // Activities: Activity[] = [];
  ActivitiesDetail:any=[];
  states: any = []; cities: any = [];ActivityType: any = [];
  userDtail:any={};
  userdetails:any={};
  villages:any=[];
  titlesearch:string='';

//#add activity 
activityId: string | null = null;
responseid:any=[];
//#end activity



constructor(private router: Router,private service:ProfileService,public sharedService: SharedService, private titleService: Title,private snackbar:SnackbarService, private translate:TranslateService) {
    this.titleService.setTitle("AICC - Profile");
}

ngOnDestroy(): void {
    
}
logout() {
  localStorage.removeItem("cl_user");
  window.location.href = "/dashboard";
}
ngOnInit(): void { 
  $(".page-loader-wrapper").fadeOut();  
  this.userDtail = localStorage.getItem("cl_user");
  this.userdetails = JSON.parse(this.userDtail)
console.log("UserDetails",this.userdetails)
this.getLookupMaster(0);
this.getActivityType(0);
 this.LoadActivity(this.userdetails.user_id,this.titlesearch);
// this.getloadactivity(this.userdetails.user_id,this.titlesearch);
}
// getloadactivity(id: any,searchtext:string) {
//   const objRequest = {
//     typeId: 23,
//     userid: 0,
//     filterId: id,
//     filterText: searchtext,
//     filterText1: ""
//   };

//   this.service.getMasters(objRequest).subscribe({
//     next: (response: any) => { 
//       debugger;
//        const parseresponse = JSON.parse(response.response); 
// const categoriesWithActivities = parseresponse.Table;
// // Step 2: Process the parsed data into the desired format
// this.Activity = (categoriesWithActivities|| []).map((category: any) => ({
// id: category.id,
// name: category.name,
// activities: (JSON.parse(category.activities) || []).map((activity: any) => ({
//   id: activity.id,
//   title: activity.title,
//   Date:activity.Date,
//   date_of_posting:activity.date_of_posting,
//   activity_type: activity.activity_type.toString(),
//   no_of_participants: activity.no_of_participants.toString(),
//   short_desc: activity.short_desc.toString(),
//   thumbnail_image: activity.thumbnail_image,
//   created_by: activity.created_by.toString(),
//   Author: activity.Author.toString(),
//   state_id: activity.state_id.toString(),
//   city_id: activity.city_id.toString(),
//   village_id: activity.village_id.toString(),
//   description: activity.description.toString(),
//   StateName: activity.StateName.toString(),
//   DistrictName: activity.DistrictName.toString(),
//   CityName: activity.CityName.toString(),
//   tab: activity.tab.toString(),
//   Activtytypeid: activity.Activtytypeid.toString(),
//   Actvitytypename: activity.Actvitytypename.toString(),
 
//   // Activityselected: false  // Initialize Activityselected as false for all activities
// }))
// }));
//        console.log(this.Activity);
//     },
//     error: (error: any) => {
//       console.error("API call failed:", error);
//     },
//     complete: () => {
//       console.log("API call completed.");
//     }
//   });
// }

ngAfterViewInit(): void {
  
}
addactivity(){
    this.router.navigate([`/profile/addactivity`, 0]);
}
searchactivity(){
  debugger;
  // this.getloadactivity(this.userdetails.user_id,this.titlesearch);
  this.LoadActivity(this.userdetails.user_id,this.titlesearch);

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
      debugger;
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
    formData.append('user_id', this.userdetails.user_id.toString());
    formData.append('friendly_url',this.clsactivity.friendlyurl.toString());

       // Append file only if it exists
       if (this.clsactivity.thumbnail_img && this.clsactivity.thumbnail_img instanceof File) {
        formData.append('thumbnail_img', this.clsactivity.thumbnail_img);
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

EditActivity(Activity: any){
   debugger;
    this.clsactivity = { ...Activity };
     // Convert date_of_posting to 'YYYY-MM-DD' format
     this.clsactivity.date_posting = Activity.date_of_posting.split('T')[0];
     this.clsactivity.thumbnail_img=Activity.thumbnail_image;
    this.getCities(Activity.state_id) ;
    this.selectedCity = Activity.city_id; 
    this.getvillages(Activity.city_id,Activity.state_id); 
    this.selectedVillage = Activity.village_id; 

console.log(Activity);
}
// ActivityDetail(Activity: any){
//   debugger;
//   const activityId = encodeURIComponent(Activity.id); 
//   window.location.href = `/profile/activitydetail/${activityId}`;
//   // debugger;
//   // const objRequest = {
//   //   typeId: 7,
//   //   userid: 0,
//   //   filterId: Activity.id,
//   //   filterText: "",
//   //   filterText1: ""
//   // };

//   // this.service.getMasters(objRequest).subscribe({
//   //   next: (response: any) => { 
//   //     var parseresponse = JSON.parse(response.response); 
//   //     if (response["errorCode"] === "200") {
//   //       this.ActivitiesDetail = parseresponse.Table;
//   //     } else {
//   //       console.error("API returned an error:", response.message); 
//   //     }
//   //   },
//   //   error: (error: any) => {
//   //     console.error("API call failed:", error);
//   //     // Handle the error appropriately
//   //     // this.snackbar.showInfo("Failed to fetch data from the server", "Error");
//   //   },
//   //   complete: () => {
//   //     console.log("API call completed.");
//   //   }
//   // });
// }
ActivityDetail(Activity: any) {
  debugger;
  console.log('Activity:', Activity);
  if (Activity && Activity.code) {
    this.router.navigate([`/profile/activitydetail`, Activity.code]);
  } else {
    console.error('Invalid Activity object or missing ID');
  }
}
DeleteActivity(Activity: any) {
  debugger;
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
      debugger;
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
  user_id:string='';
  friendlyurl:string='';
}
