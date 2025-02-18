 
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
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import 'jquery';
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule], 
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent implements OnInit {
  isLoggedIn:any='';
  Activities:any=[];
  userdetails:any={};
  ActivitiesList:any=[];
  selectedActivity: any = null;
  // clsprofession: cls_addprofession = new cls_addprofession();
  selectedState:number | null = null;
  selectedCity:number | null = null;
  selectedActvity:number | null = null;
  selectedDesignation:number | null = null;

  selectedVillage:number | null = null; 
  ActivitiesDetail:any=[];
  states: any = []; cities: any = [];casteList: any = [];ActivityType: any = [];DesiginationList: any = []; 
  villages:any=[];
  clsactivity:cls_addactivity=new cls_addactivity();
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
  else if (this.clsactivity.details_img == undefined || this.clsactivity.details_img == null || this.clsactivity.details_img == '') {
    this.snackbar.showInfo("Please select an detail image", "Error");
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
    formData.append('id',this.clsactivity.id.toString());

       // Append file only if it exists
       if (this.clsactivity.thumbnail_img && this.clsactivity.thumbnail_img instanceof File) {
        formData.append('thumbnail_img', this.clsactivity.thumbnail_img);
      }
      if (this.clsactivity.details_img && this.clsactivity.details_img instanceof File) {
        formData.append('details_img', this.clsactivity.details_img);
      }
this.service.SaveActivity(formData).subscribe((res: any) => {
  setTimeout(() => {
    $(".page-loader-wrapper-review").hide();
  }, 500);
  var response = res;
  if (response.errorCode == "200") {
     this.snackbar.showSuccess(response.message, response.status);
    setTimeout(() => {
      window.location.reload();
      // this.responseid=JSON.parse(response.response).Table[0].id;
      // if(this.responseid==this.clsactivity.id)
      // {
      //   this.clsactivity = new cls_addactivity(); // Reset form data
      //   window.location.href = "/profile";
      // }
      // this.clsactivity = new cls_addactivity(); // Reset form data

    }, 3000);
   
  } else {
    this.snackbar.showInfo(response._body.message, "Error");
  }
});
 
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
    let userDtail:any = localStorage.getItem("cl_user");
    this.userdetails = JSON.parse(userDtail) 
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
  onDesignationChange(event: any): void {
    this.selectedDesignation = event.target.value; 
  }
  
onFileChange(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.thumbnail_img = file; // Assign File object
      const reader = new FileReader();
      reader.onload = e => this.userdetails.details_imagePath = reader.result;

      reader.readAsDataURL(file);
    }
}
onFileChange_2(event: any) {
  const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.clsactivity.details_img = file; // Assign File object
      const reader = new FileReader();
      reader.onload = e => this.userdetails.details_imagePath1 = reader.result;

      reader.readAsDataURL(file);
  
    }
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
       
        if (response["errorCode"] === "200") { 
          var parseresponse = JSON.parse(response.response);  
          this.cities = parseresponse.Table 
         
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
          this.casteList = parseresponse.Table;
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
  details_img: string | File = ''; // Allow both string and File
  id:number=0;
  imagePath:string='';
  details_imagePath:string='';
  user_id:string='';
  friendlyurl:string='';
}
